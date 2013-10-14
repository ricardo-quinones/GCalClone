GCalClone.Models.Event = Backbone.Model.extend({
  urlRoot: "/events",

  addFullCalendarAttrs: function () {
    var self = this;
    _(self.attributes).extend({
      start: new Date(self.get("local_start_date")),
      end: new Date(self.get("local_end_date")),
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
    return monthNames[this.startDate().getMonth()];
  },

  startDayOfMonth: function () {
    return this.startDate().getDate();
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
    return monthNames[this.endDate().getMonth()];
  },

  endDayOfMonth: function () {
    return this.endDate().getDate();
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
  }
});