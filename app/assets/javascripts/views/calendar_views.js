GCalClone.Views.Calendars = Backbone.View.extend({
  el: "#calendar-views",

  initialize: function () {
    this.currentView = null

    this.collection.bind('reset', this.addAll);
    // self.listenTo(self.collection, 'change', self.addAll);
//     self.listenTo(self.collection, 'remove', self.adAll);
  },

  events: {
    "click .new-cal-event": "addToCal"
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
      events: this.events
    });

    sideBar.render();

    this.$el.fullCalendar({
      editable: true,
      header: {
        left: "title",
        right: "agendaDay,agendaWeek,month today prev,next"
      },
      defaultView: "agendaWeek",
      slotMinutes: 15,
      timeFormat: "h:mm t{ - h:mm t}",
      selectable: true,
      selectHelper: true,
      editable: true,
      select: this.select.bind(this),
      eventClick: this.eventClick.bind(this)
    });
  },

  addAll: function () {
    this.closePreviousView();
    this.$el.fullCalendar('addEventSource', this.collection.toJSON());
  },

  select: function (startDate, endDate) {
    this.closePreviousView();

    this.currentView = new GCalClone.Views.NewEvent({
      el: $("#form-views"),
      model: new GCalClone.Models.Event({
        start: startDate,
        end: endDate
      }),
      collection: this.collection,
      calendar: this.options.myCalendars.get(1) // change later
    });

    this.currentView.render();
  },

  eventClick: function (fcEvent) {
    this.closePreviousView();

    this.currentView = new GCalClone.Views.EditEvent({
      el: $("#form-views"),
      model: this.collection.get(fcEvent.id)
    })

    this.currentView.render();
  }
});