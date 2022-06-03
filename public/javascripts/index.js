var vueinst = new Vue({
    el : "#app",
    data : {
        currentPage : -1,
        pages : [{name : "Home", link : "/home.html"}, {name : "Events", link : "/events.html"}, {name : "Settings", link : "/settings.html"}],
        events : [],
        // attendingEvents : [],
        adminevents : [{
            name : "Pizza party",
            desc : "At dominos",
            date : "xd",
            time : "xd",
            count : 100,
            address : "Address1",
            created :"Created by Dominic Fike",
            confirmed:false
        },{
            name : "Pizza party",
            desc : "At dominos",
            date : "xd",
            time : "xd",
            count : 100,
            address : "Address2",
            created:"Created by Dominic Fike",
            confirmed:true
        },{
            name : "Pizza party",
            desc : "At dominos",
            date : "xd",
            time : "xd",
            count : 100,
            address : "Address3",
            created:"Created by Dominic Fike",
            confirmed:false
        },],
        dummyDates : ["December 9th 2022", "December 13th 2022", "December 13th 2022"],
        times : ["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24"],
        possibleTimes : ["December 9th 2022, 9PM", "December 13th 2022, 3AM", "December 13th 2022, 4PM"],
        users:["Julia Robbins","Samuel Smith"]
    },
    methods : {
        changePage : (i) => {
            this.currentPage = 2;
        },
    },
    // mounted : function(){
    //     const xhttp = new XMLHttpRequest();
    //     xhttp.onreadystatechange = function(){
    //         if (this.readyState==4 && this.status == 200){
    //             for (const i of JSON.parse(this.responseText)){
    //                 console.log(i);
    //                 vueinst.events.push(i);
    //             }
    //         }
    //     };
    //     xhttp.open("GET", "/get_events", true);
    //     xhttp.send();
    // },
});