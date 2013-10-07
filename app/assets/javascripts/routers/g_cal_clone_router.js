GCalClone.Routers.CalendarRouter = Backbone.Router.extend({
  initialize: function (calendars) {
    this.calendars = calendars;
  },

  routes: {
    "": "agenda"
  },

  agenda: function () {
    var calendarsAgendaView = new GCalClone.Views.CalendarsAgenda({
      collection: this.calendars
    });

    calendarsAgendaView.render();
  }

});