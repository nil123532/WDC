var settingsInst = new Vue
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
        GsignedIn: false,
        GcalendarLinked: false,
        GeventAdded: false
    },
    methods:
    {
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
        },

        //function that runs when Save Changes is clicked
        //This is for changing the checkbox values in the database
        settingsNotifications:function(){
            var firstNoti = document.getElementById("emailnoti1").checked;
            var secondNoti = document.getElementById("emailnoti2").checked;
            var thirdNoti = document.getElementById("emailnoti3").checked;
            var fourthNoti = document.getElementById("emailnoti4").checked;

            var xhttp = new XMLHttpRequest();
            xhttp.open("POST", "/users/emailNotificationsSettings", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({emailFinal: firstNoti, emailCancel: secondNoti, emailDayBefore: thirdNoti, emailRes: fourthNoti }));


        },
        changePage : (i) => {
            this.currentPage = 2;
        },
    }
});

//Logout
function user_logout(){
    var newWindow = window.open('https://mail.google.com/mail/?logout&hl=fr','Disconnect from Google','width=100,height=50,menubar=no,status=no,location=no,toolbar=no,scrollbars=no,top=200,left=200');
            setTimeout(function(){
                if (newWindow) newWindow.close();
                window.location="/";
            },1500);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            location.href = '/';
        }
     };
    xhttp.open("GET", "/users/logout", true);
    xhttp.send();
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

//settings function for giving state to checkboxes
function getSettingsInfo2(){
    var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let rows = JSON.parse(this.responseText);
                if(rows[0].NotiFinal){
                    document.getElementById("emailnoti1").checked = true;
                }
                if(rows[0].NotiCancel){
                    document.getElementById("emailnoti2").checked = true;
                }
                if(rows[0].NotiRespond){
                document.getElementById("emailnoti3").checked = true;
                }
            }

            }
        xhttp.open("GET", "/users/getSettingsInfo2", true);
        xhttp.send();
}

//GOOGLE
var auth2;
var accessToken;

function init() {
    gapi.load('auth2', function() {
        auth2 = gapi.auth2.init({
            client_id: '710141737855-re05dhe02ji6trjmum35ben9k7lk1gec.apps.googleusercontent.com',
            cookiepolicy: 'single_host_origin',
            // Request scopes in addition to 'profile' and 'email'
            scope: 'profile email'
          });

        auth2.isSignedIn.listen(signinChanged);
      });

}

var signinChanged = function (val) {
    if(val){
        let grantedScopes = auth2.currentUser.get().getGrantedScopes();
        if (grantedScopes.includes('https://www.googleapis.com/auth/calendar')){
            GcalendarLinked = true;
        }
    }
};

function linkCalendar(){
    let option = {
        scope: 'https://www.googleapis.com/auth/calendar',
        prompt: 'consent'
    };
    googleUser = auth2.currentUser.get();
    googleUser.grant(option).then(
    function(success){
      console.log(JSON.stringify({message: "success", value: success}));
      accessToken = success.access_token;
      settingsInst.GcalendarLinked = true;
    },
    function(fail){
      //alert(JSON.stringify({message: "fail", value: fail}));
    });
}

function addEventToCalendar(eventdetails){
    linkCalendar();

    let dateStartTime = eventdetails.finalised_time.split('Z')[0] + "+1000";
    let dateEndTime = new Date(eventdetails.finalised_time);
    dateEndTime.setTime(dateEndTime.getTime() + eventdetails.duration * 60 * 60 * 1000);
    dateEndTime = dateEndTime.toISOString().split('Z')[0] + "+1000";

    var event = {
            'summary': eventdetails.name,
            'location': eventdetails.address_street_number + " " + eventdetails.address_street_name + ", " + eventdetails.address_city + " "  + eventdetails.address_postcode + ", " + eventdetails.address_city + ", " + eventdetails.address_country,
            'description': eventdetails.description,
            'start': {
                'dateTime': dateStartTime,
            },
            'end': {
                'dateTime': dateEndTime,

            },
        };

    gapi.load('client', function() {
        gapi.client.init({
            'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']
        }).then(function() {
            return gapi.client.calendar.events.insert({
                'calendarId': 'primary',
                'resource': event
            });
          }).then(function(response) {
            console.log(response.result);
          }, function(reason) {
            console.log('Error: ' + reason.result.error.message);
        });
    });
}
