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
        proposedDates : [],
        times : ["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23"],
        myAvailabilities: [],
        selectedAvailabilities: [],
        existingAvailabilities: [],
        filteredSelectedAvailabilities: [],
        filteredExistingAvailabilities: [],
        submitting: false,
        busyDateTime: []
    },
    methods : {
        changePage : (i) => {
            this.currentPage = 2;
        },
        getEventDetails : () => {
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function(){
                if (this.readyState==4 && this.status == 200){
                    vueinst.eventDetail = JSON.parse(this.responseText)[0];
                }
            };
            xhttp.open("GET", "/get_event_details/" + location.href.split("/event_invite/")[1], true);
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
            xhttp.open("GET", "/get_author/" + location.href.split("/event_invite/")[1], true);
            xhttp.send();
        },
        getMyAvailabilities : () => {
            if (!params.userid) return;
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function(){
                if (this.readyState==4 && this.status == 200){
                    for (const i of JSON.parse(this.responseText)){
                        let xDateObject = sqlToJsDate(i.startTime);
                        let xTime = xDateObject.toTimeString().split(" ")[0];
                        let xDate = xDateObject.toDateString();
                        vueinst.myAvailabilities.push(xDate + ", " + xTime);
                    }
                }
            };
            xhttp.open("GET", `/users/${params.userid}/events/${location.href.split("/event_invite/")[1]}/my_availability`, true);
            xhttp.send();
        },
        getProposedDates : () => {
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function(){
                if (this.readyState==4 && this.status == 200){
                    for (const i of JSON.parse(this.responseText)){
                        let x = i.date.split("T")[0];
                        vueinst.proposedDates.push(x);
                        // let xDateObject = sqlToJsDate(i.date);
                        // let xDate = xDateObject.toDateString();
                        // //console.log(xDate);
                        // vueinst.proposedDates.push(xDate);
                    }
                }
            };
            xhttp.open("GET", `/proposed_dates/${location.href.split("/event_invite/")[1]}`, true);
            xhttp.send();
        },
        prettyPrintDate(date){
            let dateParts = date.split("-");
            let dateObj = new Date(dateParts[0], dateParts[1] - 1, dateParts[2].substr(0,2));
            return dateObj.toDateString();
        },
        goToLogin : () => {
            window.location.href = location.href.split("/even")[0];
        },
        goToHome : () => {
            window.location.href = location.href.split("/even")[0] + "/home";
        },
        getExistingAvailabilities : () => {
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function(){
                if (this.readyState==4 && this.status == 200){
                    // //console.log(this.responseText);
                    for (const i of JSON.parse(this.responseText)){
                        vueinst.existingAvailabilities.push(i);
                    }
                }
            };
            xhttp.open("GET", `/existing_availabilities/${vueinst.eventDetail.event_id}`, true);
            xhttp.send();
        },
        addNumberOfResponses : () => {
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function(){
                if (this.readyState==4 && this.status == 200){
                    //console.log(this.responseText);
                }
            };
            xhttp.open("POST", `/add_number_of_responses/${vueinst.eventDetail.event_id}`, true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({ responses : vueinst.eventDetail.responses+1 }));
        },
        deleteExistingAvailabilities : () => {
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function(){
                if (this.readyState==4 && this.status == 200){
                    //console.log(this.responseText);
                }
            };
            xhttp.open("POST", `/delete_non_dummy_availability/${vueinst.eventDetail.event_id}`, true);
            xhttp.send();
        },
        addAuthAvailability : () => {
            //console.log(vueinst.filteredSelectedAvailabilities);
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function(){
                if (this.readyState==4 && this.status == 200){
                    //console.log("Successfully added filtered new availabilities");
                }
            };
            xhttp.open("POST", `/auth_submit_availability/${vueinst.eventDetail.event_id}`, true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({ timestamps :  vueinst.filteredSelectedAvailabilities }));
        },
        addAnonAvailability : () => {
            //console.log(vueinst.filteredSelectedAvailabilities);
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function(){
                if (this.readyState==4 && this.status == 200){
                    //console.log("Successfully added filtered new availabilities");
                }
            };
            xhttp.open("POST", `/anon_submit_availability/${vueinst.eventDetail.event_id}`, true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({ timestamps :  vueinst.filteredSelectedAvailabilities }));
        },
        reInsertAvailability : () => {
            //console.log(vueinst.filteredExistingAvailabilities);
            if (vueinst.filteredExistingAvailabilities.length===0) return;
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function(){
                if (this.readyState==4 && this.status == 200){
                    //console.log("Successfully added filtered existing availabilities");
                }
            };
            xhttp.open("POST", `/reinsert_availability/${location.href.split("/event_invite/")[1]}`, true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({ nonDummy :  vueinst.filteredExistingAvailabilities}));
        },
        submitAnonForm : () => {
            //console.log("Anon form");
            //console.log(vueinst.selectedAvailabilities);
            if (vueinst.submitting) return;
            vueinst.submitting = true;
            vueinst.getExistingAvailabilities();
            const intersects = new Map();
            vueinst.addNumberOfResponses();
            // //console.log(vueinst.existingAvailabilities);
            setTimeout(()=>{
                //console.log(vueinst.selectedAvailabilities);
                //console.log(vueinst.existingAvailabilities);
                for (const i of vueinst.selectedAvailabilities){
                    intersects.set(i, vueinst.existingAvailabilities.length===0 ? true : false);
                }
                for (let j of vueinst.existingAvailabilities){
                    let foundTime = j.startTime.split('T')[0] + " " + j.startTime.split('T')[1].split('.0')[0];
                    // //console.log(j.startTime.split('T')[0] + " " + j.startTime.split('T')[1].split('.0')[0]);
                    // //console.log(foundTime);
                    if (intersects.has(foundTime)){
                        // //console.log(j.user_id);
                        if (j.user_id!==0) vueinst.filteredExistingAvailabilities.push(j);
                        j.startTime = foundTime;
                        intersects.set(foundTime, true);
                        // //console.log(`${foundTime} : ${intersects.get(foundTime)}`);
                    }
                }
                for (const k of vueinst.selectedAvailabilities){
                    // //console.log(`${k} : ${intersects.get(k)}`);
                    if (intersects.get(k)===true){
                        vueinst.filteredSelectedAvailabilities.push(k);
                    }
                }
                // //console.log(vueinst.filteredExistingAvailabilities);
                vueinst.deleteExistingAvailabilities();
                vueinst.addAnonAvailability();
                vueinst.reInsertAvailability();
                // //console.log(vueinst.filteredSelectedAvailabilities);
                setTimeout(()=>{
                    vueinst.submitting = false;
                    vueinst.goToHome();
                }, 2000);
            }, 3000);
        },
        submitAuthForm : () => {
            //console.log("Auth form");
            if (vueinst.submitting) return;
            vueinst.submitting = true;
            vueinst.getExistingAvailabilities();
            const intersects = new Map();
            vueinst.addNumberOfResponses();
            // //console.log(vueinst.existingAvailabilities);
            setTimeout(()=>{
                //console.log(vueinst.selectedAvailabilities);
                //console.log(vueinst.existingAvailabilities);
                for (const i of vueinst.selectedAvailabilities){
                    intersects.set(i, vueinst.existingAvailabilities.length===0 ? true : false);
                }
                for (let j of vueinst.existingAvailabilities){
                    let foundTime = j.startTime.split('T')[0] + " " + j.startTime.split('T')[1].split('.0')[0];
                    if (intersects.has(foundTime)){
                        //if (j.user_id!==0)
                        vueinst.filteredExistingAvailabilities.push(j);
                        j.startTime = foundTime;
                        intersects.set(foundTime, true);
                    }
                }
                for (const k of vueinst.selectedAvailabilities){
                    // //console.log(`${k} : ${intersects.get(k)}`);
                    if (intersects.get(k)===true){
                        vueinst.filteredSelectedAvailabilities.push(k);
                    }
                }
                // //console.log(vueinst.filteredExistingAvailabilities);
                vueinst.deleteExistingAvailabilities();
                vueinst.addAuthAvailability();
                vueinst.reInsertAvailability();
                // //console.log(vueinst.filteredSelectedAvailabilities);
                setTimeout(()=>{
                    vueinst.submitting = false;
                    vueinst.goToHome();
                }, 2000);
            }, 3000);
        },
        checkIfBusy(date, startTime){
            let duration = this.eventDetail.duration;
            // return true if not busy
            let startTimeObj = new Date(date + "T" + startTime + ":00:00Z");
            for(let busyDT of this.busyDateTime){
                let busyStartObj = new Date(busyDT.start);
                if(busyStartObj.toISOString().split('T')[0] == date){
                    let busyEndObj = new Date(busyDT.end);
                    if(busyStartObj.getTime() <= (startTimeObj.getTime() + duration * 60 * 60 * 1000 ) && busyEndObj.getTime() >= startTimeObj.getTime()){
                        return false;
                    }
                }
            }
            return true;
        }
    },
    mounted : function(){
        this.getEventDetails();
        this.getAuthor();
        this.getMyAvailabilities();
        this.getProposedDates();
    },
});


// GOOGLE

var auth2;
var accessToken;
var GsignedIn = false;
var GcalendarLinked = false;
var GeventAdded = false;

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
            GcalendarLinked = true;
        }
        if(GcalendarLinked) {
            for(let date of vueinst.proposedDates){
                checkAvailability(date);
            }
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
      ////console.log(JSON.stringify({message: "success", value: success}));
      accessToken = success.access_token;
      GcalendarLinked = true;
    },
    function(fail){
      //alert(JSON.stringify({message: "fail", value: fail}));
    });
}



function checkAvailability(details){
    let x = new Date(details);
    x.setTime(x.getTime() + 24 * 60 * 60 * 1000);
    if(GcalendarLinked == false) {
        return;
    }
    details = details + "T00:00:00Z";
    var calendarDetails = {
        "timeMin": details,
        "timeMax": x.toISOString(),
        "items": [
            {
            "id" : "primary",
            }
        ]
    };
    gapi.load('client', function() {
        gapi.client.init({
            'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']
        }).then(function() {
            return gapi.client.calendar.freebusy.query(calendarDetails);
          }).then(function(response) {
            ////console.log(response.result.calendars.primary.busy);
            for(let resp of response.result.calendars.primary.busy){
                vueinst.busyDateTime.push(resp);
            }
        }, function(reason) {
            alert('Error: ' + reason.result.error.message);
        });
    });
}
