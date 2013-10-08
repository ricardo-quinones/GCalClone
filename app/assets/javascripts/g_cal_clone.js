window.GCalClone = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function() {
    GCalClone.calendars = new GCalClone.Collections.Calendars;

    GCalClone.calendars.fetch({
      success: function (calendars) {
       new GCalClone.Routers.CalendarRouter(calendars)
       Backbone.history.start();
      },
      error: function () { console.log('errors'); }
    });
  }
};

$(document).ready(function(){
  GCalClone.initialize();

  monthNames = [
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
  ];

  currentDate = function () {
    return new Date();
  };

  currentDayOfMonth = function () {
    return currentDate().getDate();
  };

  currentMonth = function () {
    return monthNames[currentDate().getMonth()];
  };

  currentYear = function () {
    return currentDate().getFullYear();
  };
});
