GCalClone.Views.Sidebar = Backbone.View.extend({
  el: "#sidebar",

  render: function () {
    var self = this;
    var sidebarTop = new GCalClone.Views.CalendarsSidebarTop({
      collection: self.collection,
      events: this.options.events
    });
    var sidebarBottom = new GCalClone.Views.CalendarsSidebarBottom({
      collection: self.options.calendarShares,
      calendars: self.options.subscribedCalendars,
      availabilityShares: this.options.availabilityShares
    });

    self.$el
      .append(sidebarTop.render().$el)
      .append(sidebarBottom.render().$el);

    return self;
  },

  addToCal: function (event) {
    event.preventDefault();
    var calendarId = $(event.target).data("id")
    var calendar = this.collection.get(calendarId);
    calendar = (typeof calendar === "undefined" ? this.options.subscribedCalendars.get(calendarId) : calendar)

    var newEventView = new GCalClone.Views.NewEvent({
     el: $("#form-views"),
     model: new GCalClone.Models.Event({
       start: this.nextNearestHour(),
       end: this.oneHourLater()
     }),
     collection: this.options.calEvents,
     calendar: calendar,
     myCalendars: this.collection,
     calendarShares: this.options.calendarShares
   });

   newEventView.render();
  },

  nextNearestHour: function () {
    var now = new Date;
    now.setMinutes (now.getMinutes() + 60);
    now.setMinutes(0);
    return now;
  },

  oneHourLater: function () {
    var later = this.nextNearestHour();
    later.setMinutes(60);
    return later;
  },

  editCal: function (event) {
    event.preventDefault();
    var calendar = this.collection.get($(event.target).data("id"));

    var editCalendarView = new GCalClone.Views.EditCalendar({
      el: $("#form-views"),
      model: calendar
   });

   editCalendarView.render();
  },

  // this refers to calendars that are shared with you, e.g. subscribed calendars
  editCalShare: function (event) {
    event.preventDefault();
    var calendar = this.options.subscribedCalendars.get($(event.target).data("id"));
    var calendarShare = this.options.calendarShares.findWhere({calendar_id: calendar.id});

    var editCalendarShareView = new GCalClone.Views.EditCalendarShare({
      el: $("#form-views"),
      model: calendarShare,
    });

    editCalendarShareView.render();
  },

  newCal: function (event) {
    event.preventDefault();

    var newCalendarView = new GCalClone.Views.NewCalendar({
      el: $("#form-views"),
      collection: this.collection,
      calendarShares: this.options.calendarShares
    });

    newCalendarView.render();
  },

  editSharesOfAvailability: function (event) {
    event.preventDefault();

    var sharesOfAvailabilityView = new GCalClone.Views.EditSharesOfAvailability({
      el: $("#form-views"),
      collection: this.options.availabilityShares
    });

    sharesOfAvailabilityView.render();
  },

  editAvailabilityCalendar: function (event) {
    event.preventDefault();
    var availabilityShare = this.options.availabilityShares.findWhere({
      id: $(event.target).data("id")
    });
    var availabilityCalendar = this.options.subscribedCalendars.findWhere({
      availability_share_id: $(event.target).data("id")
    });
    var availabilityCalendarView = new GCalClone.Views.EditAvailabilityCalendar({
      el: $("#form-views"),
      collection: this.options.subscribedCalendars,
      model: availabilityShare,
      calendar: availabilityCalendar
    });

    availabilityCalendarView.render();
  },

  changeCalColor: function (event) {
    event.preventDefault();
    var $el = $(event.target)
    var calId = $el.data("id"), color = $el.data("color"), calType = $el.data("calendartype");

    if (calType == "cal-settings") {
      var params = {calendar: {color: color} }
      this.collection.get(calId).save(params,  {
        wait: true,
        patch: true,
        success: function (response) {
          var events = $("#calendar-views").fullCalendar("clientEvents", function (fcEvent) {
            return fcEvent.calendar_id == calId
          });

          _(events).each(function (fcEvent) {
            fcEvent.color = color
            $("#calendar-views").fullCalendar("updateEvent", fcEvent);
          });
        },
        error: function (resonse) {
          console.log(resonse);
        }
      });
    }
    else if (calType == "cal-share-settings") {
      var params = {calendar_share: {color: color} }
      this.options.calendarShares.findWhere({calendar_id: calId}).save(params,  {
        wait: true,
        patch: true,
        success: function (response) {
          var events = $("#calendar-views").fullCalendar("clientEvents", function (fcEvent) {
            return fcEvent.calendar_id == calId
          });

          _(events).each(function (fcEvent) {
            fcEvent.color = color
            $("#calendar-views").fullCalendar("updateEvent", fcEvent);
          });
        },
        error: function (resonse) {
          console.log(resonse);
        }
      });
    }
    else {
      var params = {availability_share: {color: color} }
      this.options.availabilityShares.get(calId).save(params,  {
        wait: true,
        patch: true,
        success: function (response) {
          var events = $("#calendar-views").fullCalendar("clientEvents", function (fcEvent) {
            return fcEvent.availability_share_id == calId
          });

          _(events).each(function (fcEvent) {
            fcEvent.color = color
            $("#calendar-views").fullCalendar("updateEvent", fcEvent);
          });
        },
        error: function (resonse) {
          console.log(resonse);
        }
      });
    }
  },

  displayOneCalendar: function (event) {
    event.preventDefault();
    var calId = $(event.target).data("id")

    $(".cal-color").each(function () {
      var $el = $(this);
      if ($el.data("calendar") == calId) {
        if ($el.css("background-color") == "rgb(255, 255, 255)") {
          calEvents = (function () {
            return _(GCalClone.events.where({calendar_id: $el.data("calendar")})).map(function (calEvent) {
              return calEvent.toJSON();
            });
          })();

          $("#calendar-views").fullCalendar("addEventSource", calEvents);

          $el.css({
            "background-color": $el.css("border-color"),
            "border-color": "white"
          });
        };
      }
      else {
        if ($el.css("background-color") !== "rgb(255, 255, 255)") {
          if ($el.data("calendartype") == "see details") {
            $("#calendar-views").fullCalendar("removeEvents", function (calEvent) {
              return calEvent.calendar_id == $el.data("calendar");
            });

            $el.css({
              "border-color": $el.css("background-color"),
              "background-color": "white"
            });
          }
          else {
            $("#calendar-views").fullCalendar("removeEvents", function (calEvent) {
              return calEvent.availability_share_id == $el.data("calendar");
            });

            $el.css({
              "border-color": $el.css("background-color"),
              "background-color": "white"
            });
          };
        };
      };
    });
  }
});