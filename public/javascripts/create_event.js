var vuedate = new Vue({
    el : "#app",
    data : {
        currentPage : -1,
        pages : [{name : "Home", link : "/home"}, {name : "Events", link : "/events"}, {name : "Settings", link : "/settings"}],
        days : ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
        months: ["January","February","March","April","May","June","July","August","September","October","November","December"],
        currentMonth: "",
        currentYear: "",
        currentDate: "",
        currentDay: "",
        firstDay: "",
        lastDate: "",
        totalDateOffset: "",
        selectedDates: [],
        eventName: "",
        eventDescription: "",
        eventDuration: "",
        eventStreetName: "",
        eventStreetNumber: "",
        eventState: "",
        eventCity: "",
        eventPostcode: "",
        eventCountry: "",
    },
    computed: {
        printMonthandYear() {
            this.firstDay = new Date(this.currentYear, this.currentMonth).getDay();
            this.lastDate = new Date(this.currentYear, this.currentMonth+1, 0).getDate();
            this.totalDateOffset = this.firstDay + this.lastDate;
            return this.months[this.currentMonth] + " " + this.currentYear;
        }
    },
    methods : {
        nextmonth: function() {
            this.currentMonth += 1;
            if (this.currentMonth == 12){
                this.currentMonth = 0;
                this.currentYear += 1;
            }
        },
        previousmonth: function() {
            this.currentMonth -= 1;
            if (this.currentMonth == -1){
                this.currentMonth = 11;
                this.currentYear -= 1;
            }
        },
        dateAdded: function(x) {
            let newdate = this.currentYear + "-";
            if (this.currentMonth<10) newdate += "0";
            newdate += this.currentMonth + "-";
            if (x<10) newdate += "0";
            newdate += x;
            var index = this.selectedDates.indexOf(newdate);
            if (index !== -1) {
                return index+1;
            }
            return false;
        },
        addDate: function(date) {
            let newdate = this.currentYear + "-";
            if (this.currentMonth<10) newdate += "0";
            newdate += this.currentMonth + "-";
            if (date<10) newdate += "0";
            newdate += date;
            let index = this.dateAdded(date);
            if (index) {
                this.selectedDates.splice(index-1, 1);
            }
            else {
                this.selectedDates.push(newdate);
            }

        },
        createEvent : () => {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    // console.log("Successfully created event");
                    console.log(this.responseText);
                    // res.redirect("/home.html");
                    // window.location.href = location.href.split("/creat")[0] + "/events";
                }
            };
            console.log(JSON.stringify({ dates: this.selectedDates, name: this.eventName, description: this.eventDescription, duration: this.eventDuration, streetName: this.eventStreetName, streetNumber: this.eventStreetNumber, state: this.eventState, city: this.eventCity, postcode: this.eventPostcode, country: this.eventCountry }));
            xhttp.open("POST", "/users/create_event", true); // INSERT ROUTE HERE
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({ dates: this.selectedDates, name: this.eventName, description: this.eventDescription, duration: this.eventDuration, streetName: this.eventStreetName, streetNumber: this.eventStreetNumber, state: this.eventState, city: this.eventCity, postcode: this.eventPostcode, country: this.eventCountry }));
        },
        createProposedDates : () => {
            console.log(vuedate.selectedDates);
            // var xhttp = new XMLHttpRequest();
            // xhttp.onreadystatechange = function() {
            //     if (this.readyState == 4 && this.status == 200) {
            //         // console.log("Successfully created event");
            //         // console.log(this.responseText);
            //         // res.redirect("/home.html");
            //         // window.location.href = location.href.split("/creat")[0] + "/events";
            //     }
            // };
            // xhttp.open("POST", "/users/create_event", true); // INSERT ROUTE HERE
            // xhttp.setRequestHeader("Content-type", "application/json");
            // xhttp.send(JSON.stringify({ dates: this.selectedDates }));
        },
        submit: function() {
            this.createEvent();
            this.createProposedDates();
            window.location.href = location.href.split("/creat")[0] + "/events";
        },
        changePage : (i) => {
            this.currentPage = 2;
        }
    },
    beforeMount : function(){
        let dateObj = new Date();
        this.currentMonth = dateObj.getMonth();
        this.currentYear = dateObj.getFullYear();
        this.currentDate = dateObj.getDate();
        this.currentDay = dateObj.getDay();
    }
});
