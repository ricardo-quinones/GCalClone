GCalClone.Routers.CalendarRouter = Backbone.Router.extend({
  initialize: function (user) {
    this.currentUser = user;
    GCalClone.calendars = new GCalClone.Collections.Calendars(
      this.currentUser.get("calendars")
    );
    this.calendars = GCalClone.calendars;
    this.calendars.comparator = function (calendar) {
      return calendar.id
    };
    this.calendars.sort();

    this.$settingsView = $('#settings-views');
    this.$calendarView = $('#calendar-views');
    this.$formView = $('#form-views')
    this.currentView = null;

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
    "calendars": "calendarsIndex",
    "calendars/new": "newCalendar",
    "user_settings": "editUser",
    "calendars/:calendar_id/events/new": "newEvent",
    "calendars/:id": "editCalendar",
    "events/:id": "editEvent"

  },

  closePreviousView: function () {
    if (this.currentView !== null) {
      this.currentView.$el.empty();
      this.currentView.$el.unbind();
    }
  },

  agenda: function () {
    this.closePreviousView();

    this.currentView = new GCalClone.Views.CalendarsAgenda({
      el: this.$calendarView,
      collection: this.events,
      calendars: this.calendars
    });

    this.currentView.render();
  },

  editUser: function () {
    this.closePreviousView();

    this.currentView = new GCalClone.Views.EditUser({
      el: this.$settingsView,
      model: this.currentUser
    });

    this.currentView.render();
  },

  calendarsIndex: function () {
    this.closePreviousView();

    this.currentView = new GCalClone.Views.CalendarsIndex({
      el: this.$settingsView,
      collection: this.calendars
    });

    this.currentView.render();
  },

  editCalendar: function (id) {
    this.closePreviousView();

    var calendar = this.calendars.get(id);
    this.currentView = new GCalClone.Views.EditCalendar({
      el: this.$settingsView,
      model: calendar
    });

    this.currentView.render();
  },

  newCalendar: function() {
    this.closePreviousView();

    this.currentView = new GCalClone.Views.NewCalendar({
      el: this.$settingsView,
      collection: this.calendars
    });

    this.currentView.render();
  },

  newEvent: function (calendar_id) {
    this.closePreviousView();

    var calendar = this.calendars.get(calendar_id);
    this.currentView = new GCalClone.Views.NewEvent({
      el: this.$formView,
      calendar: calendar,
      collection: this.events
    })

    this.currentView.render();
  },

  editEvent: function (id) {
   this.closePreviousView();

   var calEvent = this.events.get(id);
   this.currentView = new GCalClone.Views.EditEvent({
     el: this.$formView,
     model: calEvent
   })

   this.currentView.render();
  }
});