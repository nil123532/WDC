var vueGoogle = new Vue({
    el : "#GoogleCalendar",
    data : {
        GsignedIn: false,
        GcalendarLinked: false
    },
    methods : {

    },
    mounted : function(){
    },
});

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
            vueGoogle.GcalendarLinked = true;
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
      vueGoogle.GcalendarLinked = true;
    },
    function(fail){
      //alert(JSON.stringify({message: "fail", value: fail}));
    });
}

function addEventToCalendar(){
    linkCalendar();
    alert();
    var event = {
            'summary': 'Google I/O 2015',
            'location': '800 Howard St., San Francisco, CA 94103',
            'description': 'A chance to hear more about Google\'s developer products.',
            'start': {
                'date': '2022-06-09',
            },
            'end': {
                'date': '2022-06-10',
                
            },
        };

    gapi.load('client', function() {
        gapi.client.init({
            'apiKey': 'AIzaSyDnfjswm-r09OvRi9C26j-U4c0wYhF2PcA',
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