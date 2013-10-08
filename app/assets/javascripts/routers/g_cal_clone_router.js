GCalClone.Routers.CalendarRouter = Backbone.Router.extend({
  initialize: function (calendars) {
    this.calendars = calendars;
    var eventPojos = [];

    this.calendars.each(function (calendar) {
      _(calendar.get('events')).each(function (calEvent) {
        calEvent.start_date = new Date(calEvent.start_date);
        calEvent.end_date = new Date(calEvent.end_date);
        eventPojos.push(calEvent);
      });
    });

    eventPojos = _(eventPojos).sortBy(function (eventPojo) {
      return eventPojo.start_date;
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