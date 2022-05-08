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
        },]
    },
    methods : {
        changePage : (i) => {
            this.currentPage = 2;
        }
    },
});