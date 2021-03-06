var vueinst = new Vue({
    el : "#app",
    data : {
        currentPage : -1,
        pages : [{name : "Home", link : "/home"}, {name : "Events", link : "/events"}, {name : "Settings", link : "/settings"}],
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
});
