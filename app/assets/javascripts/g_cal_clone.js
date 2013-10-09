window.GCalClone = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function() {
    GCalClone.calendars = new GCalClone.Collections.Calendars;
    GCalClone.currentUser = new GCalClone.Models.User({id: CURRENT_USER_ID});
    GCalClone.currentUser.fetch();

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

var originalSync = Backbone.sync;
Backbone.sync = function(method, model, options) {
    if (method === 'patch') options.type = 'PUT';
    return originalSync(method, model, options);
};