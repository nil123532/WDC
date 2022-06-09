const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});

function sqlToJsDate(sqlDate){
    let dateParts = sqlDate.split("-");
    return new Date(dateParts[0], dateParts[1] - 1, dateParts[2].substr(0,2));
}

var vueinst = new Vue({
    el : "#app",
    data : {
        currentPage : -1,
        pages : [{name : "Home", link : "/home"}, {name : "Events", link : "/events"}, {name : "Settings", link : "/settings"}],
        eventDetail : {},
        authorName : "",
        dummyDates : [],
        times : ["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24"],
        availabilities : [],
        finalised_time : "",
        cancelling : false,
        finalising : false,
        GsignedIn: false,
        GcalendarLinked: false,
        GeventAdded: false
    },
    methods : {
        changePage : (i) => {
            this.currentPage = 2;
        },
        getPageLink : () => {
            navigator.clipboard.writeText(location.href.split("/even")[0] + "/event_invite/" + params.eventid);
            alert("Copied to clipboard");
        },
        getEventDetails : () => {
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function(){
                if (this.readyState==4 && this.status == 200){
                    vueinst.eventDetail = JSON.parse(this.responseText)[0];
                    alert(JSON.stringify(vueinst.eventDetail));
                }
            };
            xhttp.open("GET", "/get_event_details/" + params.eventid, true);
            xhttp.send();
        },
        getAuthor : () => {
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function(){
                if (this.readyState==4 && this.status == 200){
                    let author = JSON.parse(this.responseText)[0];
                    vueinst.authorName += author.first_name + " " + author.last_name;
                }
            };
            xhttp.open("GET", "/get_author/" + params.eventid, true);
            xhttp.send();
        },
        getAvailabilities : () => {
            let uniqueTimestamps = new Set();
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function(){
                if (this.readyState==4 && this.status == 200){
                    for (const i of JSON.parse(this.responseText)){
                        let xDateObject = sqlToJsDate(i.startTime);
                        let xDate = xDateObject.toDateString();
                        let displayDate = xDate + ", " + i.startTime.split('T')[1].split('.0')[0];
                        let rawDate = i.startTime.split('T')[0] + " " + i.startTime.split('T')[1].split('.0')[0]
                        if (uniqueTimestamps.has(rawDate)) continue;
                        uniqueTimestamps.add(rawDate);
                        vueinst.availabilities.push({ display : displayDate, raw : rawDate});
                    }
                }
            };
            xhttp.open("GET", "/existing_availabilities/" + params.eventid, true);
            xhttp.send();
        },
        deleteAvail : () => {
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function(){
                if (this.readyState==4 && this.status == 200){
                    // window.location.href = location.href.split("/even")[0] + "/events";
                }
            };
            xhttp.open("POST", "/delete_avail/" + params.eventid, true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify());
        },
        deleteDates : () => {
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function(){
                if (this.readyState==4 && this.status == 200){
                    // window.location.href = location.href.split("/even")[0] + "/events";
                }
            };
            xhttp.open("POST", "/delete_dates/" + params.eventid, true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify());
        },
        deleteEvent : () => {
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function(){
                if (this.readyState==4 && this.status == 200){
                    // window.location.href = location.href.split("/even")[0] + "/events";
                }
            };
            xhttp.open("POST", "/delete_event/" + params.eventid, true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify());
        },
        cancelEvent : () => {
            console.log("works here");
            if (vueinst.cancelling) return;
            vueinst.cancelling = true;
            vueinst.deleteAvail();
            vueinst.deleteDates();
            setTimeout(vueinst.deleteEvent,1500);
            setTimeout(()=>{
                window.location.href = location.href.split("/even")[0] + "/events";
            },3000);
        },
        finalise : () => {
            // /finalise_time/:eventid
            if (vueinst.finalising) return;
            if (vueinst.finalised_time.length===0){
                alert("Please pick a time from the availability or cancel the event");
                return;
            }
            vueinst.finalising = true;
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function(){
                if (this.readyState==4 && this.status == 200){
                    window.location.href = location.href.split("/even")[0] + "/events";
                }
            };
            xhttp.open("POST", "/finalise_time/" + params.eventid, true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({ final : vueinst.finalised_time }));
        },
    },
    mounted : function(){
        this.getEventDetails();
        this.getAuthor();
        this.getAvailabilities();
    },
});

//GOOGLE

var auth2;
var accessToken;

function init() {
    gapi.load('auth2', function() {
        auth2 = gapi.auth2.init({
            client_id: '710141737855-re05dhe02ji6trjmum35ben9k7lk1gec.apps.googleusercontent.com',
            cookiepolicy: 'single_host_origin',
            // Request scopes in addition to 'profile' and 'email'
            scope: 'profile email'
          });
        
        auth2.isSignedIn.listen(signinChanged);
      });
    
}

var signinChanged = function (val) {
    if(val){
        let grantedScopes = auth2.currentUser.get().getGrantedScopes();
        if (grantedScopes.includes('https://www.googleapis.com/auth/calendar')){
            vueinst.GcalendarLinked = true;
        }
    }
};

function linkCalendar(){
    let option = {
        scope: 'https://www.googleapis.com/auth/calendar',
        prompt: 'consent'
    };
    googleUser = auth2.currentUser.get();
    googleUser.grant(option).then(
    function(success){
      console.log(JSON.stringify({message: "success", value: success}));
      accessToken = success.access_token;
      vueinst.GcalendarLinked = true;
    },
    function(fail){
      //alert(JSON.stringify({message: "fail", value: fail}));
    });
}

function addEventToCalendar(eventdetails){
    let dateStartTime = eventdetails.finalised_time.split('Z')[0] + "+1000";
    let dateEndTime = new Date(eventdetails.finalised_time);
    dateEndTime.setTime(dateEndTime.getTime() + eventdetails.duration * 60 * 60 * 1000);
    dateEndTime = dateEndTime.toISOString().split('Z')[0] + "+1000";

    var event = {
            'summary': eventdetails.name,
            'location': eventdetails.address_street_number + " " + eventdetails.address_street_name + ", " + eventdetails.address_city + " "  + eventdetails.address_postcode + ", " + eventdetails.address_city + ", " + eventdetails.address_country,
            'description': eventdetails.description,
            'start': {
                'dateTime': dateStartTime,
            },
            'end': {
                'dateTime': dateEndTime,
                
            },
        };

    gapi.load('client', function() {
        gapi.client.init({
            'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']
        }).then(function() {
            return gapi.client.calendar.events.insert({
                'calendarId': 'primary',
                'resource': event    
            });
          }).then(function(response) {
            console.log(response.result);
            vueinst.GeventAdded = true;
          }, function(reason) {
            console.log('Error: ' + reason.result.error.message);
        });
    });
}