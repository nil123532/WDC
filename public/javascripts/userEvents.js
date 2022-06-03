var vueinst = new Vue({
    el : "#app",
    data : {
        attendingEvents : [],
    },
    mounted : function(){
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
            if (this.readyState==4 && this.status == 200){
                for (const i of JSON.parse(this.responseText)){
                    console.log(i);
                    vueinst.attendingEvents.push(i);
                }
            }
        };
        xhttp.open("GET", "/get_events", true);
        xhttp.send();
    },
});