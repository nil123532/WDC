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
        pages : [{name : "Home", link : "/home"}, {name : "Events", link : "/events"}, {name : "Settings", link : "/settings"}],
        eventDetail : {name : "Loading..."},
        authorName : "Loading...",
        myAvailabilities: [],
        getting : false,
        GsignedIn : false,
        GcalendarLinked : false,
        GeventAdded : false
    },
    methods : {
        getEventDetails : () => {
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function(){
                if (this.readyState==4 && this.status == 200){
                    vueinst.eventDetail = JSON.parse(this.responseText)[0];
                }
            };
            xhttp.open("GET", `/get_event_details/${params.eventid}`, true);
            xhttp.send();
        },
        getAuthor : () => {
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function(){
                if (this.readyState==4 && this.status == 200){
                    let author = JSON.parse(this.responseText)[0];
                    vueinst.authorName = author.first_name + " " + author.last_name;
                }
            };
            xhttp.open("GET", `/get_author/${params.eventid}`, true);
            xhttp.send();
        },
        getMyAvailabilities : () => {
            if (!params.userid) return;
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function(){
                if (this.readyState==4 && this.status == 200){
                    console.log(JSON.parse(this.responseText));
                    for (const i of JSON.parse(this.responseText)){
                        let xDateObject = sqlToJsDate(i.startTime);
                        let xTime = xDateObject.toTimeString().split(" ")[0];
                        let xDate = xDateObject.toDateString();
                        vueinst.myAvailabilities.push(xDate + ", " + i.startTime.split('T')[1].split('.0')[0]);
                    }
                    vueinst.getting = false;
                }
            };
            xhttp.open("GET", `/users/${params.userid}/events/${params.eventid}/my_availability`, true);
            xhttp.send();
        },
        prettyPrintDate(date){
            let dateParts = date.split("-");
            let dateObj = new Date(dateParts[0], dateParts[1] - 1, dateParts[2].substr(0,2));
            return dateObj.toDateString();
        },
    },
    mounted : function(){
        this.getting = true;
        this.getEventDetails();
        this.getAuthor();
        this.getMyAvailabilities();
    },
});


// Google

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
    linkCalendar();

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