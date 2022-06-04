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

            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    redirectSignUp();
                }
                else if (this.status == 123){
                    emailInUse();
                }
             }
            xhttp.open("POST", "/users/signup", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({ first_name: this.first_name , last_name : this.last_name , email : this.email , password: this.password}));
        },
        user_signin:function()
        {
            var xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    redirectSignIn();
                }
             };

            xhttp.open("POST", "/users/signin", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({email : this.email , password: this.password}));
        },
        user_logout:function(){
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    redirectLogOut();
                }
             };
            xhttp.open("GET", "/users/logout", true);
            xhttp.send();
        },
        changePage : (i) => {
            this.currentPage = 2;
        }
    }
});

//this function redirects user to Sign in page once sign-up is successful
function redirectSignUp(){
    location.href = '/user-sign-in.html';
}

function redirectSignIn(){
    location.href = '/home.html';
}

function redirectLogOut(){
    location.href = '/user-sign-in.html';
}

function emailInUse(){
    alert("This email is already in use");
};
