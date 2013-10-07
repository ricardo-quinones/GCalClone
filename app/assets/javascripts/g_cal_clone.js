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
});
