var login = new Vue
({
    el : "#app",
    data :
    {
        first_name : "",
        last_name : "",
        email :  "",
        password : "",
        error: false,
        errorMessage: "",
        signup: false
    },
    methods:
    {
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
                console.log("gtoken found");
                xhttp.send(JSON.stringify({ token : gtoken }));
            }
            else {
                xhttp.send(JSON.stringify({ first_name: this.first_name , last_name : this.last_name , email : this.email , password: this.password }));
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
                xhttp.send(JSON.stringify({ email : this.email , password: this.password }));
            }
        },
    }
});

function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    if(login.signup) {
        login.user_signup(id_token);
    }
    else {
        login.user_signin(id_token);
    }
}