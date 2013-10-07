GCalClone.Routers.CalendarRouter = Backbone.Router.extend({
  initialize: function (calendars) {
    this.calendars = calendars;
    var eventPojos = [];

    this.calendars.each(function (calendar) {
      _(calendar.get('events')).each(function (calendarEvent) {
        eventPojos.push(calendarEvent);
      });
    });

    this.events = new GCalClone.Collections.Events(eventPojos);
  },

  routes: {
    "": "agenda"
  },

  agenda: function () {
    var calendarsAgendaView = new GCalClone.Views.CalendarsAgenda({
      collection: this.events, calendars: this.calendars
    });

    calendarsAgendaView.render();
  }

});