GCalClone.Models.Event = Backbone.Model.extend({

  monthNames: [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december"
  ],

  startDate: function () {
    return this.get('start_date');
  },

  endDate: function () {
    return this.get('end_date');
  },

  startMonth: function () {
    return this.monthNames[this.startDate().getMonth()];
  },

  startDayOfMonth: function () {
    return this.startDate().getDate();
  },

  startTime: function () {
    var hours = this.startDate().getHours() + ":";
    var minutes = this.startDate().getMinutes()
    return (minutes < 10 ? (hours + "0" + minutes) : (hours + minutes));
  },

  endMonth: function () {
    return this.monthNames[this.endDate().getMonth()];
  },

  endDayOfMonth: function () {
    return this.endDate().getDate();
  },

  endTime: function () {
    return this.endDate().getHours() + ":" + this.endDate().getSeconds();
  }
});