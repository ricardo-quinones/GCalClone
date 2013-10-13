GCalClone.Views.Calendars = Backbone.View.extend({

  el: "#calendar-views",

  initialize: function () {
    var self = this;

    self.listenTo(self.collection, 'add', self.addAll);
    self.listenTo(self.collection, 'change', self.addAll);
    self.listenTo(self.collection, 'remove', self.addAll);
    self.listenTo(self.collection, 'reset', self.addAll);
  },

  render: function () {
    var sideBar = new GCalClone.Views.Sidebar({
      collection: this.options.myCalendars,
      calendarShares: this.options.calendarShares,
      subscribedCalendars: this.options.subscribedCalendars
    });

    sideBar.render();

    this.$el.fullCalendar({
      editable: true,
      header: {
        left: "title",
        right: "agendaDay,agendaWeek,month today prev,next"
      },
      defaultView: "agendaDay",
      slotMinutes: 15,
      timeFormat: "h:mm t{ - h:mm t}",
      selectable: true,
      selectHelper: true,
      editable: true,
      select: this.select.bind(this)
    });
  },

  addAll: function () {
    this.$el.fullCalendar('addEventSource', this.collection.toJSON());
  },

  select: function (startDate, endDate) {
    var newEvent = new GCalClone.Views.NewEvent({
      el: $("#form-views"),
      model: new GCalClone.Models.Event({
        start: startDate,
        end: endDate
      }),
      collection: this.collection,
      calendar: this.options.myCalendars.get(1) // change later
    });

    newEvent.render();
    $("#form-views").dialog({
      modal: true,
      width: "auto"
    });
  }
});