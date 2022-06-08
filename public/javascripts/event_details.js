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
        times : ["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24"],
        myAvailabilities: [],
        selectedAvailabilities: [],
        existingAvailabilities: [],
        filteredSelectedAvailabilities: [],
        filteredExistingAvailabilities: [],
        submitting: false
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
                        // console.log(xDate);
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
        getExistingAvailabilities : () => {
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function(){
                if (this.readyState==4 && this.status == 200){
                    // console.log(this.responseText);
                    for (const i of JSON.parse(this.responseText)){
                        vueinst.existingAvailabilities.push(i);
                    }
                }
            };
            xhttp.open("GET", `/existing_availabilities/${vueinst.eventDetail.event_id}`, true);
            xhttp.send();
        },
        deleteExistingAvailabilities : () => {
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function(){
                if (this.readyState==4 && this.status == 200){
                    console.log(this.responseText);
                }
            };
            xhttp.open("POST", `/delete_non_dummy_availability/${vueinst.eventDetail.event_id}`, true);
            xhttp.send();
        },
        submitAnonForm : () => {
            console.log(vueinst.selectedAvailabilities);
            vueinst.getExistingAvailabilities();
            // submit form stuff here? Might need a different or followup function for authorized user?
            // const xhttp = new XMLHttpRequest();
            // xhttp.onreadystatechange = function(){
            //         if (this.readyState==4 && this.status == 200){

            //         }
            //     }
            // };
            // xhttp.open("POST", `/anon_availability/${location.href.split("/event_invite/")[1]}`, true);
            // xhttp.send({ possibleTimes :  vueinst.selectedAvailabilities});
        },
        submitAuthForm : () => {
            // console.log(vueinst.selectedAvailabilities);
            if (vueinst.submitting) return;
            vueinst.submitting = true;
            vueinst.getExistingAvailabilities();
            const intersects = new Map();
            for (const i of vueinst.selectedAvailabilities){
                intersects.set(i, false);
            }
            // console.log(vueinst.existingAvailabilities);
            setTimeout(()=>{
                for (const j of vueinst.existingAvailabilities){
                    console.log(sqlToJsDate(j.startTime).toDateString());
                    // console.log(j.startTime);
                    // if (map1.has(i))
                }
            }, 2000);
            // submit form stuff here? Might need a different or followup function for authorized user?
            // const xhttp = new XMLHttpRequest();
            // xhttp.onreadystatechange = function(){
            //         if (this.readyState==4 && this.status == 200){

            //         }
            //     }
            // };
            // xhttp.open("POST", `/anon_availability/${location.href.split("/event_invite/")[1]}`, true);
            // xhttp.send({ possibleTimes :  vueinst.selectedAvailabilities});
        }
    },
    mounted : function(){
        this.getEventDetails();
        this.getAuthor();
        this.getMyAvailabilities();
        this.getProposedDates();
    },
});
