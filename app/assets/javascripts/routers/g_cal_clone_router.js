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
      this.currentUser.get("see_event_details_calendars")).concat(
      this.currentUser.get("subscribed_user_availability_calendars")
    );
    GCalClone.subscribedCalendars = new GCalClone.Collections.Calendars(
      subscribedCalendars
    );
    this.subscribedCalendars = GCalClone.subscribedCalendars;
    this.subscribedCalendars.comparator = function (calendar) {
      return calendar.get("title")
    };
    this.subscribedCalendars.sort();

    this.calendarShares = new GCalClone.Collections.CalendarShares(
      this.currentUser.get("calendar_shares")
    );
    this.calendarShares.comparator = function(calendarShare) {
      return calendarShare.get('title');
    };
    this.calendarShares.sort();
    GCalClone.calendarShares = this.calendarShares;

    this.$settingsView = $('#settings-views');
    this.$calendarView = $('#calendar-views');
    this.$formView = $('#form-views')
    this.currentView = null;

    var eventPojos = [];

    this.myCalendars.each(function (calendar) {
      _(calendar.get('events')).each(function (calEvent) {
        eventPojos.push(calEvent);
      });
    });

    this.subscribedCalendars.each(function (calendar) {
      _(calendar.get('events')).each(function (calEvent) {
        eventPojos.push(calEvent);
      });
    });

    this.availabilityStatuses = new GCalClone.Collections.AvailabilityStatuses(
      this.currentUser.get("availability_statuses")
    );

    GCalClone.availabilityStatuses = this.availabilityStatuses;

    GCalClone.sharesOfAvailability = this.currentUser.get("shares_of_users_availability")

    this.availabilityShares = new GCalClone.Collections.AvailabilityShares(
      this.currentUser.get("availabilities_shared_with_user")
    );

    GCalClone.availabilityShares = this.availabilityShares;

    this.events = new GCalClone.Collections.Events(eventPojos);

    this.events.each(function (calEvent, index) {
      var status = "free"
      var color;

      if (typeof calEvent.get("availability_share_id") == "undefined") {
        color = (function () {
          var calendarShare = GCalClone.calendarShares.findWhere({calendar_id: calEvent.get("calendar_id")});
          return (typeof calendarShare == "undefined" ? calEvent.get("color") : calendarShare.get("color"));
        })();
      }
      else {
        color = GCalClone.availabilityShares.get(calEvent.get("availability_share_id")).get("color")
      }

      if (typeof calEvent.get("availability_share_id") == "undefined") {
        status = GCalClone.availabilityStatuses.findWhere({event_id: calEvent.id}).get("availability");
      }
      calEvent.addFullCalendarAttrs(status, color);
    });

    GCalClone.events = this.events;
    this.events.comparator = function(calEvent) {
      return calEvent.startDate();
    };

    this.events.sort();
  },

  routes: {
    "": "calendarView",
    "user_settings": "editUser"
  },

  closePreviousView: function () {
    if (this.currentView !== null) {
      this.currentView.$el.empty();
      this.currentView.$el.unbind();
    }
  },

  calendarView: function () {
    this.closePreviousView();

    this.currentView = new GCalClone.Views.Calendars({
      subscribedCalendars: this.subscribedCalendars,
      calendarShares: this.calendarShares,
      myCalendars: this.myCalendars,
      availabilityShares: this.availabilityShares,
      collection: this.events
    });

    this.currentView.render();
    this.currentView.addAll();
  },

  editUser: function () {
    this.closePreviousView();
    $("#sidebar").empty();
    $("#sidebar").unbind();

    this.currentView = new GCalClone.Views.EditUser({
      el: this.$settingsView,
      model: this.currentUser
    });

    this.currentView.render();
  }

 //  calendarsIndex: function () {
 //    this.closePreviousView();
 //
 //    this.currentView = new GCalClone.Views.CalendarsIndex({
 //      el: this.$settingsView,
 //      collection: this.myCalendars
 //    });
 //
 //    this.currentView.render();
 //  },
 //
 //  editCalendar: function (id) {
 //    this.closePreviousView();
 //
 //    var calendar = this.myCalendars.get(id);
 //
 //    this.currentView = new GCalClone.Views.EditCalendar({
 //      el: this.$settingsView,
 //      model: calendar
 //    });
 //
 //    this.currentView.render();
 //  },
 //
 //  editCalendarShare: function (id) {
 //    this.closePreviousView();
 //
 //    var calendarShare = this.calendarShares.get(id);
 //
 //    this.currentView = new GCalClone.Views.EditCalendarShare({
 //      el: this.$settingsView,
 //      model: calendarShare
 //    });
 //
 //    this.currentView.render();
 //  },
 //
 //  newCalendar: function() {
 //    this.closePreviousView();
 //
 //    this.currentView = new GCalClone.Views.NewCalendar({
 //      el: this.$settingsView,
 //      collection: this.myCalendars,
 //      calendarShares: this.calendarShares
 //    });
 //
 //    this.currentView.render();
 //  },
 //
 //  newEvent: function (calendar_id) {
 //    this.closePreviousView();
 //
 //    var calendar = this.myCalendars.get(calendar_id);
 //    this.currentView = new GCalClone.Views.NewEvent({
 //      el: this.$formView,
 //      calendar: calendar,
 //      collection: this.events
 //    });
 //
 //    this.currentView.render();
 //  },
 //
 //  editEvent: function (id) {
 //   this.closePreviousView();
 //
 //   var calEvent = this.events.get(id);
 //   this.currentView = new GCalClone.Views.EditEvent({
 //     el: this.$formView,
 //     model: calEvent
 //   });
 //
 //   this.currentView.render();
 // }
});