var vueinst = new Vue({
    el : "#app",
    data : {
        currentPage : -1,
        pages : [{name : "Home", link : "#"}, {name : "Events", link : "#"}, {name : "Settings", link : "#"}]
    },
    methods : {
        changePage : (i) => {
            this.currentPage = 2;
            console.log(this.currentPage);
        }
    },
});