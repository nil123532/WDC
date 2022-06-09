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
        goToHome : () => {
            window.location.href = location.href.split("/even")[0] + "/home";
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
        addNumberOfResponses : () => {
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function(){
                if (this.readyState==4 && this.status == 200){
                    console.log(this.responseText);
                }
            };
            xhttp.open("POST", `/add_number_of_responses/${vueinst.eventDetail.event_id}`, true);
            xhttp.send(JSON.stringify({ responses : vueinst.eventDetail.responses+1 }));
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
        addAuthAvailability : () => {
            console.log(vueinst.filteredSelectedAvailabilities);
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function(){
                if (this.readyState==4 && this.status == 200){
                    console.log("Successfully added filtered new availabilities");
                }
            };
            xhttp.open("POST", `/auth_submit_availability/${vueinst.eventDetail.event_id}`, true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({ timestamps :  vueinst.filteredSelectedAvailabilities }));
        },
        addAnonAvailability : () => {
            console.log(vueinst.filteredSelectedAvailabilities);
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function(){
                if (this.readyState==4 && this.status == 200){
                    console.log("Successfully added filtered new availabilities");
                }
            };
            xhttp.open("POST", `/anon_submit_availability/${vueinst.eventDetail.event_id}`, true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({ timestamps :  vueinst.filteredSelectedAvailabilities }));
        },
        reInsertAvailability : () => {
            console.log(vueinst.filteredExistingAvailabilities);
            if (vueinst.filteredExistingAvailabilities.length===0) return;
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function(){
                if (this.readyState==4 && this.status == 200){
                    console.log("Successfully added filtered existing availabilities");
                }
            };
            xhttp.open("POST", `/reinsert_availability/${location.href.split("/event_invite/")[1]}`, true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({ nonDummy :  vueinst.filteredExistingAvailabilities}));
        },
        submitAnonForm : () => {
            console.log("Anon form");
            console.log(vueinst.selectedAvailabilities);
            if (vueinst.submitting) return;
            vueinst.submitting = true;
            vueinst.getExistingAvailabilities();
            const intersects = new Map();
            vueinst.addNumberOfResponses();
            // console.log(vueinst.existingAvailabilities);
            setTimeout(()=>{
                console.log(vueinst.selectedAvailabilities);
                console.log(vueinst.existingAvailabilities);
                for (const i of vueinst.selectedAvailabilities){
                    intersects.set(i, vueinst.existingAvailabilities.length===0 ? true : false);
                }
                for (let j of vueinst.existingAvailabilities){
                    let foundTime = j.startTime.split('T')[0] + " " + j.startTime.split('T')[1].split('.0')[0];
                    // console.log(j.startTime.split('T')[0] + " " + j.startTime.split('T')[1].split('.0')[0]);
                    // console.log(foundTime);
                    if (intersects.has(foundTime)){
                        // console.log(j.user_id);
                        if (j.user_id!==0) vueinst.filteredExistingAvailabilities.push(j);
                        j.startTime = foundTime;
                        intersects.set(foundTime, true);
                        // console.log(`${foundTime} : ${intersects.get(foundTime)}`);
                    }
                }
                for (const k of vueinst.selectedAvailabilities){
                    // console.log(`${k} : ${intersects.get(k)}`);
                    if (intersects.get(k)===true){
                        vueinst.filteredSelectedAvailabilities.push(k);
                    }
                }
                // console.log(vueinst.filteredExistingAvailabilities);
                vueinst.deleteExistingAvailabilities();
                vueinst.addAnonAvailability();
                vueinst.reInsertAvailability();
                // console.log(vueinst.filteredSelectedAvailabilities);
                setTimeout(()=>{
                    vueinst.submitting = false;
                    vueinst.goToHome();
                }, 2000);
            }, 3000);
        },
        submitAuthForm : () => {
            console.log("Auth form");
            if (vueinst.submitting) return;
            vueinst.submitting = true;
            vueinst.getExistingAvailabilities();
            const intersects = new Map();
            vueinst.addNumberOfResponses();
            // console.log(vueinst.existingAvailabilities);
            setTimeout(()=>{
                console.log(vueinst.selectedAvailabilities);
                console.log(vueinst.existingAvailabilities);
                for (const i of vueinst.selectedAvailabilities){
                    intersects.set(i, vueinst.existingAvailabilities.length===0 ? true : false);
                }
                for (let j of vueinst.existingAvailabilities){
                    let foundTime = j.startTime.split('T')[0] + " " + j.startTime.split('T')[1].split('.0')[0];
                    if (intersects.has(foundTime)){
                        if (j.user_id!==0) vueinst.filteredExistingAvailabilities.push(j);
                        j.startTime = foundTime;
                        intersects.set(foundTime, true);
                    }
                }
                for (const k of vueinst.selectedAvailabilities){
                    // console.log(`${k} : ${intersects.get(k)}`);
                    if (intersects.get(k)===true){
                        vueinst.filteredSelectedAvailabilities.push(k);
                    }
                }
                // console.log(vueinst.filteredExistingAvailabilities);
                vueinst.deleteExistingAvailabilities();
                vueinst.addAuthAvailability();
                vueinst.reInsertAvailability();
                // console.log(vueinst.filteredSelectedAvailabilities);
                setTimeout(()=>{
                    vueinst.submitting = false;
                    vueinst.goToHome();
                }, 2000);
            }, 3000);
        }
    },
    mounted : function(){
        this.getEventDetails();
        this.getAuthor();
        this.getMyAvailabilities();
        this.getProposedDates();
    },
});
