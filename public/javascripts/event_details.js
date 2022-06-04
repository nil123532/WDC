const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });

var vueinst = new Vue({
    el : "#app",
    data : {
        currentPage : -1,
        pages : [{name : "Home", link : "/home.html"}, {name : "Events", link : "/events.html"}, {name : "Settings", link : "/settings.html"}],
        eventDetail : {},
        dummyDates : ["December 9th 2022", "December 13th 2022", "December 13th 2022"],
        times : ["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24"],
        possibleTimes : ["December 9th 2022, 9PM", "December 13th 2022, 3AM", "December 13th 2022, 4PM"],
        users:["Julia Robbins","Samuel Smith"]
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
            xhttp.open("GET", "/get_event_details/" + params.eventid, true);
            xhttp.send();
        }
    },
    mounted : function(){
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
            if (this.readyState==4 && this.status == 200){
                vueinst.eventDetail = JSON.parse(this.responseText)[0];
            }
        };
        xhttp.open("GET", "/get_event_details/" + params.eventid, true);
        xhttp.send();
    },
});