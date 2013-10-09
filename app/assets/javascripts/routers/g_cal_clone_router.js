GCalClone.Routers.CalendarRouter = Backbone.Router.extend({
  initialize: function (calendars) {
    this.calendars = calendars;
    this.calendars.comparator = function (calendar) {
      return calendar.id
    };
    this.calendars.sort();

    this.currentUser = GCalClone.currentUser

    this.$settingsView = $('#settings-views');
    this.$calendarView = $('#calendar-views');

    var eventPojos = [];

    this.calendars.each(function (calendar) {
      _(calendar.get('events')).each(function (calEvent) {
        calEvent.local_start_date = new Date(calEvent.local_start_date);
        calEvent.local_end_date = new Date(calEvent.local_end_date);
        eventPojos.push(calEvent);
      });
    });

    this.events = new GCalClone.Collections.Events(eventPojos);
    this.events.comparator = function(calEvent) {
      return calEvent.get('local_start_date')
    };

    this.events.sort();
  },

  routes: {
    "": "agenda",
    "user_settings": "userSettings",
    "calendar_settings/:id": "calendarSettings"
  },

  agenda: function () {
    this.$settingsView.empty();

    var calendarsAgendaView = new GCalClone.Views.CalendarsAgenda({
      el: this.$calendarView,
      collection: this.events,
      calendars: this.calendars
    });

    calendarsAgendaView.render();
  },

  userSettings: function () {
    this.$calendarView.empty();

    var userSettingsView = new GCalClone.Views.UserSettings({
      el: this.$settingsView,
      model: this.currentUser
    });

    userSettingsView.render();
  },

  calendarSettings: function (id) {
    this.$calendarView.empty();

    var calendar = this.calendars.get(id);
    var calendarSettingsView = new GCalClone.Views.CalendarSettings({
      el: this.$settingsView,
      model: calendar
    });

    calendarSettingsView.render();
  }

});