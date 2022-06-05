var vueinst = new Vue
({
    el : "#app",
    data :
    {
        first_name : "",
        last_name : "",
        email :  "",
        password : "",
        pages : [{name : "Home", link : "/home"}, {name : "Events", link : "/events"}, {name : "Settings", link : "/settings"}],
    },
    methods:
    {
        changePage : (i) => {
            this.currentPage = 2;
        },
        user_logout:function(){
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    location.href = '/';
                }
             };
            xhttp.open("GET", "/users/logout", true);
            xhttp.send();
        }
    }
});

