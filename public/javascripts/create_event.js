var vuedate = new Vue({
    el : "#app",
    data : {
        currentPage : -1,
        pages : [{name : "Home", link : "/home.html"}, {name : "Events", link : "/events.html"}, {name : "Settings", link : "/settings.html"}],
        dateObj: new Date(),
        currentMonth: new Date().getMonth(),
        currentYear: new Date().getFullYear(),
        currentDate: new Date().getDate(),
        currentDay: new Date().getDay(),
        firstDay: "",
        lastDate: ""
    },
    computed: {
        printMonthandYear() {
            const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
            this.firstDay = new Date(this.currentYear, this.currentMonth).getDay();
            this.lastDate = new Date(this.currentYear, this.currentMonth+1, 0).getDate();
            return months[this.currentMonth] + " " + this.currentYear;
        }
    },
    methods : {
        loadDatePicker: function() {
            let base = document.getElementById("datepicker");
            while (base.firstChild) {
                base.removeChild(base.lastChild);
            }
            let row = document.createElement("div");
            row.classList.add("date-picker-row");
            let empty = document.createElement("div");
            empty.classList.add("date-picker-date-empty");
            let dateitem = document.createElement("div");
            dateitem.classList.add("date-picker-date");
            let day = 0;
            let date = 1;
            base.appendChild(row.cloneNode());
            while(day < this.firstDay) {
                base.appendChild(empty.cloneNode());
                day++;
            }
            while(date <= this.lastDate) {
                if (day == 7) {
                    day = 0;
                    base.appendChild(row.cloneNode());
                }
                let newdateitem = dateitem.cloneNode();
                newdateitem.innerText = date;
                base.appendChild(newdateitem);
                date++;
                day++;
            }

        },
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
        changePage : (i) => {
            this.currentPage = 2;
        }
    },
});