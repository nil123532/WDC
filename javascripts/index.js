var vueinst = new Vue({
    el : "#app",
    data : {
        currentPage : -1,
        pages : [{name : "Home", link : "/home.html"}, {name : "Events", link : "/events.html"}, {name : "Settings", link : "/settings.html"}],
        events : [{
            name : "Pizza party",
            desc : "At dominos",
            date : "xd",
            time : "xd",
            count : 100,
            img : "https://www.w3schools.com/w3css/img_lights.jpg"
        },{
            name : "Pizza party",
            desc : "At dominos",
            date : "xd",
            time : "xd",
            count : 100,
            img : "https://www.w3schools.com/w3css/img_lights.jpg"
        },{
            name : "Pizza party",
            desc : "At dominos",
            date : "xd",
            time : "xd",
            count : 100,
            img : "https://www.w3schools.com/w3css/img_lights.jpg"
        },],
        dummyDates : ["December 9th 2022", "December 13th 2022", "December 13th 2022"],
        times : ["00:00","01:00","02:00"]
    },
    methods : {
        changePage : (i) => {
            this.currentPage = 2;
        }
    },
});