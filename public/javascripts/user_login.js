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
        errorMessage: ""
    },
    methods:
    {
        user_signup:function()
        {
            if(this.first_name == "" || this.last_name == "" || this.email == "" || this.password == ""){
                this.error = true;
                this.errorMessage = "Please enter a value for all fields.";
                return;
            }
            else{
                this.error = false;
            }
            var xhttp = new XMLHttpRequest();
            xhttp.open("POST", "/users/signup", true);
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
                    window.location.href = location.href.split("/user-sign-up")[0] + "/home.html";
                }
            };
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({ first_name: this.first_name , last_name : this.last_name , email : this.email , password: this.password}));
        },
        user_signin:function()
        {
            var xhttp = new XMLHttpRequest();
            xhttp.open("POST", "/users/signin", true);
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
                    window.location.href = location.href.split("/user-sign-in")[0] + "/home.html";
                }
            };
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({email : this.email , password: this.password}));
        }
    }
});