var vueinst = new Vue({
    el : "#app",
    data : {
        pages : [{name : "Home", link : "/home"}, {name : "Events", link : "/events"}, {name : "Settings", link : "/settings"}],
        events : [],
    },
    mounted : function(){
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
            if (this.readyState==4 && this.status == 200){
                for (const i of JSON.parse(this.responseText)){
                    console.log(i);
                    vueinst.events.push(i);
                }
            }
        };
        xhttp.open("GET", "/get_user_events", true);
        xhttp.send();
    },
});
