var auth2;
var accessToken;
var GsignedIn = false;
var GcalendarLinked = false;
var GeventAdded = false;

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
      GcalendarLinked = true;
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