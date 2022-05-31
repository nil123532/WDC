var vueinst = new Vue
({
    el : "#app",
    data :
    {
        first_name : "",
        last_name : "",
        email :  "",
        password : "",
        pages : [{name : "Home", link : "/home.html"}, {name : "Events", link : "/events.html"}, {name : "Settings", link : "/settings.html"}],
    },
    methods:
    {
        user_signup:function()
        {
            var xhttp = new XMLHttpRequest();
            xhttp.open("POST", "/users/signup", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({ first_name: this.first_name , last_name : this.last_name , email : this.email , password: this.password}));
        },
        user_signin:function()
        {
            var xhttp = new XMLHttpRequest();
            xhttp.open("POST", "/users/signin", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({email : this.email , password: this.password}));
        },
        changePage : (i) => {
            this.currentPage = 2;
        }
    }
});