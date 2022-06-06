var vueinst = new Vue
({
    el : "#app",
    data :
    {
        first_name : "",
        last_name : "",
        email :  "",
        password : "",
        new_password : "",
        confirm_password : "",
        passwordError : "",
        passError : false,
        pages : [{name : "Home", link : "/home"}, {name : "Events", link : "/events"}, {name : "Settings", link : "/settings"}],
    },
    methods:
    {
        changePage : (i) => {
            this.currentPage = 2;
        },
        user_logout:function(){
            //GsignOut(); //FIX THIS?
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    location.href = '/';
                }
             };
            xhttp.open("GET", "/users/logout", true);
            xhttp.send();
        },

        passwordChange1:function(){

            if(!(this.new_password == "") && this.confirm_password == ""){
                this.passError = true;
                this.passwordError = "Enter new password in confirm password";
                return;
            }
            else if(this.new_password != this.confirm_password && !(this.new_password == "" && this.confirm_password == "")){
                this.passError = true;
                this.passwordError = "Passwords do not match";
                return;
            }
            else if(this.new_password == this.confirm_password && !(this.new_password == "" && this.confirm_password == "")){
                var xhttp = new XMLHttpRequest();

                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {

                        var xhttp = new XMLHttpRequest();
                        xhttp.onreadystatechange = function() {
                            if (this.readyState == 4 && this.status == 200) {
                                location.href = '/';
                            }
                        };
                        xhttp.open("GET", "/users/logout", true);
                        xhttp.send();
                    }
                 };

                xhttp.open("POST", "/settingsChangePassword1", true);
                xhttp.setRequestHeader("Content-type", "application/json");
                xhttp.send(JSON.stringify({new_password: this.new_password }));
            }
        }
    }
});

function GsignOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
}


///FUNCTIONS FOR SETTINGS PAGE
function getSettingsInfo(){
    var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let rows = JSON.parse(this.responseText);
                document.getElementById("settingsFirstName").setAttribute("value",rows[0].first_name);
                document.getElementById("settingsLastName").setAttribute("value",rows[0].last_name);
                document.getElementById("settingsEmail").setAttribute("value",rows[0].email);

            }
        };
        xhttp.open("GET", "/users/getSettingsInfo", true);
        xhttp.send();
}
