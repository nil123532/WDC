var vueinst = new Vue({
    el : "#app",
    data : {
        currentPage : -1,
        pages : [{name : "Home", link : "#"}, {name : "Events", link : "#"}, {name : "Settings", link : "#"}],
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
        dummyAvailability : ["December 9th 2022, 9 a.m", "December 13th 2022, 2:30 p.m. - 3:00 p.m.", "December 13th 2022, 2:30 p.m."]
    },
    methods : {
        changePage : (i) => {
            this.currentPage = 2;
        }
    },
});