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
        pages : [{name : "Home", link : "/home.html"}, {name : "Events", link : "/events.html"}, {name : "Settings", link : "/settings.html"}],
        eventDetail : {},
        authorName : "",
        dummyDates : [],
        times : ["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24"],
        availabilities : [],
        users:["Julia Robbins","Samuel Smith"]
    },
    methods : {
        changePage : (i) => {
            this.currentPage = 2;
        },
        getPageLink : () => {
            navigator.clipboard.writeText(location.href.split("/even")[0] + "/event_invite/14");
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
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function(){
                if (this.readyState==4 && this.status == 200){
                    for (const i of JSON.parse(this.responseText)){
                        let xDateObject = sqlToJsDate(i.startTime);
                        let xTime = xDateObject.toTimeString().split(" ")[0];
                        let xDate = xDateObject.toDateString();
                        vueinst.availabilities.push(xDate + ", " + xTime);
                    }
                }
            };
            xhttp.open("GET", "/get_availabilities/" + params.eventid, true);
            xhttp.send();
        }
    },
    mounted : function(){
        this.getEventDetails();
        this.getAuthor();
        this.getAvailabilities();
    },
});