GCalClone.Models.Event = Backbone.Model.extend({
  urlRoot: "/events",

  addFullCalendarAttrs: function () {
    var self = this;
    _(self.attributes).extend({
      start: new Date(typeof self.get("local_start_date" == "undefined") ? self.get("start_date"): self.get("local_start_date")),
      end: new Date(typeof self.get("local_end_date" == "undefined") ? self.get("end_date"): self.get("local_end_date")),
      allDay: self.get("all_day"),
      color: (function () {
        var calendarShare = GCalClone.calendarShares.findWhere({calendar_id: self.get("calendar_id")});
        return (typeof calendarShare == "undefined" ? self.get("color") : calendarShare.get("color"));
      })()
    });
  },

  convertDateFromString: function (date) {
    return (typeof date === "string" ? new Date(date) : date);
  },

  // methods for show view
  singleDay: function () {
    var string = this.startDayOfWeek() + ", " + this.startMonth() + " " + this.startDayOfMonth() + ", ";
    string = string.concat(this.convertToAmPm(this.startTimeString()) + " - ");
    return string;
  },

  displayEventTime: function () {
    var string = this.singleDay();
    if (this.startDateString() == this.endDateString()) return string.concat(this.convertToAmPm(this.endTimeString()));
    string = string.concat(this.endDayOfWeek() + ", " + this.endMonth() + " " + this.endDayOfMonth() + ", ");
    string = string.concat(this.convertToAmPm(this.endTimeString()));
    return string;
  },

  convertToAmPm: function (time) {
    var newTime = (time.slice(3,5) == "00" ? time.slice(0,2) : time);
    if (newTime.slice(0,2) > 12) return newTime.slice(0,2) % 12 + newTime.slice(2,5) + "pm";
    return newTime.slice(1,5) + "am";
  },

  dayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],

  // methods for edit view
  startDateString: function () {
    return  this.startMonthNum() + "/" + this.startDayOfMonth() + "/" + this.startYear();
  },

  startTimeString: function () {
    return this.formatTimeString(this.startTime());
  },

  endDateString: function () {
    return  this.endMonthNum() + "/" + this.endDayOfMonth() + "/" + this.endYear();
  },

  endTimeString: function () {
    return this.formatTimeString(this.endTime());
  },

  formatTimeString: function (timeString) {
    if (timeString.length < 5) return "0".concat(timeString);
    return timeString;
  },

  // methods for agenda view
  allDay: function () {
    return this.get('all_day');
  },

  startDate: function () {
    if (typeof this.get("start") !== "string") return this.get("start");
    return new Date(this.get("start"));
  },

  endDate: function () {
    if (typeof this.get("end") !== "string") return this.get("end");
    return new Date(this.get("end"));
  },

  startYear: function () {
    return this.startDate().getFullYear();
  },

  startMonthNum: function () {
    return this.startDate().getMonth() + 1;
  },

  startMonth: function () {
    return this.monthNames[this.startDate().getMonth()];
  },

  startDayOfMonth: function () {
    return this.startDate().getDate();
  },

  startDayOfWeek: function () {
    return this.dayNames[this.startDate().getDay()];
  },

  startTime: function () {
    var hours = this.startDate().getHours() + ":";
    var minutes = this.startDate().getMinutes()
    return (minutes < 10 ? (hours + "0" + minutes) : (hours + minutes));
  },

  endYear: function () {
    return this.endDate().getFullYear();
  },

  endMonthNum: function () {
    return this.endDate().getMonth() + 1
  },

  endMonth: function () {
    return this.monthNames[this.endDate().getMonth()];
  },

  endDayOfMonth: function () {
    return this.endDate().getDate();
  },

  endDayOfWeek: function () {
    return this.dayNames[this.endDate().getDay()];
  },

  endTime: function () {
    var hours = this.endDate().getHours() + ":";
    var minutes = this.endDate().getMinutes();
    return (minutes < 10 ? (hours + "0" + minutes) : (hours + minutes));
  },

  dayId: function () {
    return this.startYear() + "-" + this.startMonth() + "-" + this.startDayOfMonth();
  },

  timeRange: function () {
    return this.startTime() + " - " + this.endTime();
  },

  monthNames: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ]
});