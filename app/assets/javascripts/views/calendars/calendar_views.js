GCalClone.Views.Calendars = Backbone.View.extend({
  el: "#calendar-views",

  initialize: function () {
    this.currentView = null;

    this.collection.bind('reset', this.addAll);
  },

  events: {
    "click .new-cal-event": "addToCal",
    "click .cal-settings": "editCal",
    "click .cal-share-settings": "editCalShare",
    "click #create-cal": "newCal",
    "click #share-availability": "editSharesOfAvailability",
    "click .availability-calendar-settings": "editAvailabilityCalendar"
  },

  closePreviousView: function () {
    if (this.currentView !== null) {
      this.currentView.$el.empty();
      this.currentView.$el.unbind();
    }
  },

  render: function () {
    this.closePreviousView();

    var sideBar = new GCalClone.Views.Sidebar({
      collection: this.options.myCalendars,
      calendarShares: this.options.calendarShares,
      subscribedCalendars: this.options.subscribedCalendars,
      availabilityShares: this.options.availabilityShares,
      events: this.events,
      calEvents: this.collection
    });

    sideBar.render();

    this.$el.fullCalendar({
      contentHeight: $(window).height() - $("html").height() - $(".fc-header").height() - 58,
      editable: true,
      header: {
        left: "title",
        right: "agendaDay,agendaWeek,month today prev,next"
      },
      defaultView: "agendaWeek",
      ignoreTimezone: false,
      slotMinutes: 15,
      timeFormat: "h:mm t{ - h:mm t}",
      selectable: true,
      selectHelper: true,
      editable: true,
      select: this.select.bind(this),
      eventClick: this.eventClick.bind(this),
      eventDrop: this.eventDropOrResize.bind(this),
      eventResize: this.eventDropOrResize.bind(this)
    });
  },

  addAll: function () {
    this.closePreviousView();
    this.$el.fullCalendar('addEventSource', this.collection.toJSON());
  },

  select: function (startDate, endDate, allDay) {
    this.closePreviousView();

    this.currentView = new GCalClone.Views.NewEvent({
      el: $("#form-views"),
      model: new GCalClone.Models.Event({
        start: startDate,
        end: endDate,
        allDay: allDay
      }),
      collection: this.collection,
      calendar: this.options.myCalendars.get(GCalClone.currentUser.get("default_calendar_id")),
      myCalendars: this.options.myCalendars,
      calendarShares: this.options.calendarShares
    });

    this.currentView.render();
  },

  eventClick: function (fcEvent) {
    this.closePreviousView();

    if (typeof fcEvent.id !== "undefined") {
      this.currentView = new GCalClone.Views.EditEvent({
        el: $("#form-views"),
        model: this.collection.get(fcEvent.id),
        myCalendars: this.options.myCalendars,
        subscribedCalendars: this.options.subscribedCalendars,
        calendarShares: this.options.calendarShares
      });

      this.currentView.render();
    }
    else {
      calEvent = this.collection.findWhere({
        availability_share_id: fcEvent.availability_share_id,
        start: fcEvent.start,
        end: fcEvent.end
      });
      var availabilityShare = this.options.availabilityShares.get(fcEvent.availability_share_id)
      this.currentView = new GCalClone.Views.ShowBusyEvent({
        el: $("#form-views"),
        calEvent: calEvent,
        availabilityShare: availabilityShare
      });

      this.currentView.render();
    }
  },

  eventDropOrResize: function (fcEvent) {
    var status = this.collection.get(fcEvent.id).get("availability");
    this.collection.get(fcEvent.id).save(
      {cal_event: {start_date: fcEvent.start, end_date: fcEvent.end, all_day: fcEvent.allDay}}, {
        patch: true,
        wait: true,
        success: function (response) {
          response.addFullCalendarAttrs(status);
          var fcEvent = $("#calendar-views").fullCalendar("clientEvents", response.get('id'))[0];
          _(fcEvent).extend(response.attributes);
          $("#calendar-views").fullCalendar("updateEvent", fcEvent);
        }
      }
    );
  }
});