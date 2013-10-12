GCalClone.Routers.CalendarRouter = Backbone.Router.extend({
  initialize: function (user) {
    this.currentUser = user;

    var manageable_calendars = this.currentUser.get("calendars").concat(
      this.currentUser.get("manage_sharing_calendars")
    );
    GCalClone.myCalendars = new GCalClone.Collections.Calendars(
      manageable_calendars
    );

    this.myCalendars = GCalClone.myCalendars;
    this.myCalendars.comparator = function (calendar) {
      return calendar.id
    };
    this.myCalendars.sort();

    var subscribedCalendars = this.currentUser.get("make_event_changes_calendars").concat(
      this.currentUser.get("see_event_details_calendars")
    );
    GCalClone.subscribedCalendars = new GCalClone.Collections.Calendars(
      subscribedCalendars
    );
    this.subscribedCalendars = GCalClone.subscribedCalendars;
    this.subscribedCalendars.comparator = function (calendar) {
      return calendar.id
    };
    this.subscribedCalendars.sort();

    this.calendarShares = new GCalClone.Collections.CalendarShares(
      this.currentUser.get("calendar_shares")
    );
    this.calendarShares.comparator = function(calendarShare) {
      return calendarShare.get('title');
    };
    this.calendarShares.sort();

    this.$settingsView = $('#settings-views');
    this.$calendarView = $('#calendar-views');
    this.$formView = $('#form-views')
    this.currentView = null;

    var eventPojos = [];

    this.myCalendars.each(function (calendar) {
      _(calendar.get('events')).each(function (calEvent) {
        calEvent["start"] = calEvent.local_start_date;
        calEvent["end"] = calEvent.local_end_date;
        calEvent["allDay"] = calEvent.all_day;
        // newEvent["id"] = calEvent.id;
        // newEvent["title"] = calEvent.title;
        // newEvent["creatorId"] = calEvent.creator_id;
        // newEvent["calendarId"] = calEvent.calendar_id;
        // newEvent["timeZone"] = calEvent.time_zone;
        eventPojos.push(calEvent);
      });
    });

    // this.myCalendars.each(function (calendar) {
    //   _(calendar.get('events')).each(function (calEvent) {
    //     eventPojos.push(calEvent);
    //   });
    // });

    this.subscribedCalendars.each(function (calendar) {
      _(calendar.get('events')).each(function (calEvent) {
        calEvent["start"] = calEvent.local_start_date;
        calEvent["end"] = calEvent.local_end_date;
        calEvent["allDay"] = calEvent.all_day;
        eventPojos.push(calEvent);
      });
    });

    this.events = new GCalClone.Collections.Events(eventPojos);

    GCalClone.events = this.events;
    this.events.comparator = function(calEvent) {
      return calEvent.startDate();
    };

    this.events.sort();
  },

  routes: {
    "": "agenda",
    "test_calendar": "testCalendar",
    "calendars": "calendarsIndex",
    "calendars/new": "newCalendar",
    "user_settings": "editUser",
    "calendars/:calendar_id/events/new": "newEvent",
    "calendars/:id": "editCalendar",
    "subscribed_calendars/:id": "editCalendarShare",
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
      myCalendars: this.myCalendars,
      subscribedCalendars: this.subscribedCalendars,
      calendarShares:  this.calendarShares
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
      collection: this.myCalendars
    });

    this.currentView.render();
  },

  editCalendar: function (id) {
    this.closePreviousView();

    var calendar = this.myCalendars.get(id);

    this.currentView = new GCalClone.Views.EditCalendar({
      el: this.$settingsView,
      model: calendar
    });

    this.currentView.render();
  },

  editCalendarShare: function (id) {
    this.closePreviousView();

    var calendarShare = this.calendarShares.get(id);

    this.currentView = new GCalClone.Views.EditCalendarShare({
      el: this.$settingsView,
      model: calendarShare
    });

    this.currentView.render();
  },

  newCalendar: function() {
    this.closePreviousView();

    this.currentView = new GCalClone.Views.NewCalendar({
      el: this.$settingsView,
      collection: this.myCalendars,
      calendarShares: this.calendarShares
    });

    this.currentView.render();
  },

  newEvent: function (calendar_id) {
    this.closePreviousView();

    var calendar = this.myCalendars.get(calendar_id);
    this.currentView = new GCalClone.Views.NewEvent({
      el: this.$formView,
      calendar: calendar,
      collection: this.events
    });

    this.currentView.render();
  },

  editEvent: function (id) {
   this.closePreviousView();

   var calEvent = this.events.get(id);
   this.currentView = new GCalClone.Views.EditEvent({
     el: this.$formView,
     model: calEvent
   });

   this.currentView.render();
  },

  testCalendar: function () {
    this.closePreviousView();

    this.currentView = new GCalClone.Views.CalendarTest({
      collection: this.events
    });
    this.currentView.render();
    this.currentView.addAll();
  }
});