GCalClone.Models.Event = Backbone.Model.extend({
  urlRoot: "/events",

  addFullCalendarAttrs: function (status, color) {
    var self = this;
    _(self.attributes).extend({
      start: self.convertToUserTimeZone(self.get("start_date")).format(),
      end: self.convertToUserTimeZone(self.get("end_date")).format(),
      allDay: self.get("all_day"),
      color: (function () {
        var calendarShare = GCalClone.calendarShares.findWhere({calendar_id: self.get("calendar_id")});
        if (typeof color !== "undefined") return color
        return (typeof calendarShare == "undefined" ? self.get("color") : calendarShare.get("color"));
      })(),
      availability: status
    });
  },

  convertToUserTimeZone: function (date) {
    return moment.tz(
      date,
      TIME_ZONES[GCalClone.currentUser.get("time_zone")].identifier
    );
  },

  convertDateFromString: function (date) {
    return (typeof date === "string" ? new Date(date) : date);
  },

  // methods for show view
  singleDay: function (date) {
    string = moment(
      moment(date).format().slice(0,19)
    ).format("ddd, MMMM D, ");
    string = string.concat(this.convertToAmPm(this.inputTimeString(date)));
    return string;
  },

  displayEventTime: function (start, end) {
    var string = this.singleDay(start) + " - ";
    if (this.inputDateString(start) == this.inputDateString(end)) {
      return string.concat(this.convertToAmPm(this.inputTimeString(end)));
    }
    else {
      return string.concat(this.singleDay(end));
    };
  },

  convertToAmPm: function (time) {
    var newTime;
    if (time.slice(0,2) % 12 !== 0) { newTime = time.slice(0,2) % 12; }
    else { newTime = "12"; };

    newTime = newTime + (time.slice(3,5) == 0 ? "" : time.slice(2,5));

    return newTime + (time.slice(0,2) > 11 ? "pm" : "am");
  },

  // dayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],

  // methods for edit view
  inputDateString: function (date) {
    return this.convertToUserTimeZone(date).format("M/D/YYYY");
  },

  inputTimeString: function (date) {
    return this.convertToUserTimeZone(date).format("HH:mm");
  },

  // methods for agenda view
  // startDate: function () {
  //   if (typeof this.get("start") !== "string") return this.get("start");
  //   return new Date(this.get("start"));
  // },
  //
  // endDate: function () {
  //   if (typeof this.get("end") !== "string") return this.get("end");
  //   return new Date(this.get("end"));
  // },
  //
  // startYear: function () {
  //   return this.startDate().getFullYear();
  // },
  //
  // startMonthNum: function () {
  //   return this.startDate().getMonth() + 1;
  // },
  //
  // startMonth: function () {
  //   return this.monthNames[this.startDate().getMonth()];
  // },
  //
  // startDayOfMonth: function () {
  //   return this.startDate().getDate();
  // },
  //
  // startDayOfWeek: function () {
  //   return this.dayNames[this.startDate().getDay()];
  // },
  //
  // startTime: function () {
  //   var hours = this.startDate().getHours() + ":";
  //   var minutes = this.startDate().getMinutes()
  //   return (minutes < 10 ? (hours + "0" + minutes) : (hours + minutes));
  // },
  //
  // endYear: function () {
  //   return this.endDate().getFullYear();
  // },
  //
  // endMonthNum: function () {
  //   return this.endDate().getMonth() + 1
  // },
  //
  // endMonth: function () {
  //   return this.monthNames[this.endDate().getMonth()];
  // },
  //
  // endDayOfMonth: function () {
  //   return this.endDate().getDate();
  // },
  //
  // endDayOfWeek: function () {
  //   return this.dayNames[this.endDate().getDay()];
  // },
  //
  // endTime: function () {
  //   var hours = this.endDate().getHours() + ":";
  //   var minutes = this.endDate().getMinutes();
  //   return (minutes < 10 ? (hours + "0" + minutes) : (hours + minutes));
  // },
  //
  // monthNames: [
  //   "January",
  //   "February",
  //   "March",
  //   "April",
  //   "May",
  //   "June",
  //   "July",
  //   "August",
  //   "September",
  //   "October",
  //   "November",
  //   "December"
  // ]
});