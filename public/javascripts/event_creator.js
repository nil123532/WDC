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
        cancelling : false
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
            let 
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function(){
                if (this.readyState==4 && this.status == 200){
                    for (const i of JSON.parse(this.responseText)){
                        let xDateObject = sqlToJsDate(i.startTime);
                        let xDate = xDateObject.toDateString();
                        vueinst.availabilities.push({ display : xDate + ", " + i.startTime.split('T')[1].split('.0')[0], raw : i.startTime.split('T')[0] + " " + i.startTime.split('T')[1].split('.0')[0]});
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
            console.log(vueinst.finalised_time);
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function(){
                if (this.readyState==4 && this.status == 200){
                    window.location.href = location.href.split("/even")[0] + "/events";
                }
            };
            xhttp.open("POST", "/finalise_time/" + params.eventid, true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({ final : vueinst.finalised_time }));
        }
    },
    mounted : function(){
        this.getEventDetails();
        this.getAuthor();
        this.getAvailabilities();
    },
});
