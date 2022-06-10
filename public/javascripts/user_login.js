//var globalVar = false;
var login = new Vue
({
    el : "#app",
    data :
    {
        form: false,
        first_name : "",
        last_name : "",
        email :  "",
        password : "",
        error: false,
        errorMessage: "",
        signup: false,
        users: [],
        check : false,
        events : []
    },
    mounted:function()
    {
        ////console.log(this.email);
        this.check_form();
        this.get_users();
        this.get_events();
    },
    methods:
    {
        get_events:function()
        {
            var xhttp = new XMLHttpRequest();
            xhttp.open("GET", "/get_events", true);
            xhttp.onreadystatechange = function() {
                if (this.readyState==4 && this.status == 200){
                    var response = JSON.parse(this.responseText);
                    for (let i=0;i<response.length;i++)
                    {
                        if (response[i].first_name === null || response[i].last_name === null)
                        {
                            response.splice(i,1);
                        }
                    }
                    login.events = response;
                    // //console.log(login.users);
                }
            };
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send();
        },
        remove_events:function(id)
        {
            for(let i=0;i<this.events.length;i++)
            {
                if (this.events[i].event_id === id) {this.events.splice(i,1);}
            }
            var xhttp = new XMLHttpRequest();
            xhttp.open("POST", "/remove_event", true);
            xhttp.onreadystatechange = function() {
                if (this.readyState==4 && this.status == 200){
                    alert("Event Removed");
                }
            };
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({"event_id":id}));
        },
        switchsignin:function()
        {
            if(this.signup){ this.signup = !this.signup;}
            this.error = false;
        },
        switchsignup:function()
        {
            if(!this.signup){ this.signup = !this.signup;}
            this.error = false;
        },
        user_signup:function(gtoken)
        {
            if(!gtoken){
                if(this.first_name == "" || this.last_name == "" || this.email == "" || this.password == ""){
                    this.error = true;
                    this.errorMessage = "Please enter a value for all fields.";
                    return;
                }
                else{
                    this.error = false;
                }
            }
            var xhttp = new XMLHttpRequest();
            xhttp.open("POST", "/signup", true);
            xhttp.onreadystatechange = function() {
                if (this.readyState==4 && this.status != 200){
                    login.error = true;
                    if (this.status == 500){
                        login.errorMessage = "Server error occured, try again later.";
                    }
                    else if (this.status == 400){
                        login.errorMessage = "Unknown error occured.";
                    }
                    else if (this.status == 409){
                        login.errorMessage = "This email is already in use.";
                    }
                }
                else if (this.readyState == 4 && this.status == 200){
                    location.href = '/home';
                }
            };
            xhttp.setRequestHeader("Content-type", "application/json");
            if(gtoken) {
                //console.log("gtoken found");
                xhttp.send(JSON.stringify({ token : gtoken }));
            }
            else {
                xhttp.send(JSON.stringify({ first_name: this.first_name , last_name : this.last_name , email : this.email , password: this.password}));
            }
        },
        user_signin:function(gtoken)
        {
            var xhttp = new XMLHttpRequest();
            xhttp.open("POST", "/usersignin", true);
            xhttp.onreadystatechange = function() {
                if (this.readyState==4 && this.status != 200){
                    login.error = true;
                    if (this.status == 500){
                        if(gtoken){ login.errorMessage = "Could not log in with Google, try again later."; }
                        else{
                            login.errorMessage = "Server error occured, try again later.";
                        }
                    }
                    else if (this.status == 400){
                        login.errorMessage = "Unknown error occured.";
                    }
                    else if (this.status == 401){
                        login.errorMessage = "Incorrect credentials.";
                    }
                }
                else if (this.readyState == 4 && this.status == 200){
                    location.href = '/home';
                }
            };
            xhttp.setRequestHeader("Content-type", "application/json");
            if(gtoken) {
                xhttp.send(JSON.stringify({ token : gtoken }));
            }
            else {
                xhttp.send(JSON.stringify({ email : this.email , password: this.password}));
            }
        },
        //Nilesh Code
        admin_signin:function()
        {
            var xhttp = new XMLHttpRequest();
            xhttp.open("POST", "/adminsignin", true);
            xhttp.onreadystatechange = function() {
                if (this.readyState==4 && this.status != 200){
                    login.error = true;
                    if (this.status == 500){
                            login.errorMessage = "Server error occured, try again later.";
                    }
                    else if (this.status == 400){
                        login.errorMessage = "Unknown error occured.";
                    }
                    else if (this.status == 401){
                        login.errorMessage = "Incorrect credentials.";
                    }
                }
                else if (this.readyState == 4 && this.status == 200){
                    location.href = 'admin-home';
                }
            };
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({ email : this.email , password: this.password}));
        },
        admin_signup:function()
        {

            var xhttp = new XMLHttpRequest();
            xhttp.open("POST", "/adminsignup", true);
            xhttp.onreadystatechange = function() {
                if (this.readyState==4 && this.status != 200){
                    login.error = true;
                    if (this.status == 500){
                        login.errorMessage = "Server error occured, try again later.";
                    }
                    else if (this.status == 400){
                        login.errorMessage = "Unknown error occured.";
                    }
                    else if (this.status == 409){
                        login.errorMessage = "This email is already in use.";
                    }
                }
                else if (this.readyState == 4 && this.status == 200){
                    alert("New Admin Added");
                }
            };
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({ first_name: this.first_name , last_name : this.last_name , email : this.email , password: this.password}));
            },
        check_form:function()
        {
           // //console.log("hoho");
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    ////console.log("accessed");
                    login.form = true;
                   // globalVar = true;
                }
                else if (xhttp.readyState == 4 && xhttp.status == 403)
                {
                   // globalVar = false;
                   login.form = false;
                }
            };
            xhttp.open("GET", "/admin-add-user", true);
            xhttp.send();
        },
        a_logout : function()
        {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    location.href = '/';
                }
             };
            xhttp.open("GET", "/users/logout", true);
            xhttp.send();
        },
        get_users : function()
        {
            var xhttp = new XMLHttpRequest();
            xhttp.open("GET", "/get_user", true);
            xhttp.onreadystatechange = function() {
                if (this.readyState==4 && this.status == 200){
                    var response = JSON.parse(this.responseText);
                    for (let i=0;i<response.length;i++)
                    {
                        if (response[i].first_name === null || response[i].last_name === null)
                        {
                            response.splice(i,1);
                        }
                    }
                    login.users= response;
                    // //console.log(login.users);
                }
            };
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send();
        },
        remove_user : function(id)
        {
            for(let i=0;i<this.users.length;i++)
            {
                if (this.users[i].user_id === id) {this.users.splice(i,1);}
            }
            var xhttp = new XMLHttpRequest();
            xhttp.open("POST", "/remove_user", true);
            xhttp.onreadystatechange = function() {
                if (this.readyState==4 && this.status == 200){
                    alert("User Removed");
                }
            };
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({"user_id":id}));
        }
    }
});

function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    var profile = googleUser.getBasicProfile();
    //console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    //console.log('Name: ' + profile.getName());
    //console.log('Image URL: ' + profile.getImageUrl());
    //console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    if(login.signup) {
        login.user_signup(id_token);
    }
    else {
        login.user_signin(id_token);
    }
}