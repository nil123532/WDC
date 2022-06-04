// var vuehome = new Vue({
//     el : "#app",
//     data : {
//         randomString : "random shit",
//         attendingEvents : [],
//     },
//     beforeMount : function(){
//         console.log("User events");
//         const xhttp = new XMLHttpRequest();
//         xhttp.onreadystatechange = function(){
//             if (this.readyState==4 && this.status == 200){
//                 for (const i of JSON.parse(this.responseText)){
//                     vueinst.attendingEvents.push(i);
//                     console.log(vueinst.attendingEvents);
//                 }
//             }
//         };
//         xhttp.open("GET", "/get_events", true);
//         xhttp.send();
//     },
// });

var vueinst = new Vue({
    el : "#app",
    data : {
        pages : [{name : "Home", link : "/home.html"}, {name : "Events", link : "/events.html"}, {name : "Settings", link : "/settings.html"}],
        attendingEvents : [],
    },
    mounted : function(){
        console.log("User events");
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
            if (this.readyState==4 && this.status == 200){
                for (const i of JSON.parse(this.responseText)){
                    vueinst.attendingEvents.push(i);
                    console.log(vueinst.attendingEvents);
                }
            }
        };
        xhttp.open("GET", "/users/8/get_events", true);
        xhttp.send();
    },
});