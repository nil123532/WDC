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
        getting : false
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
