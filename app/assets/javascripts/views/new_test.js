GCalClone.Views.CalendarTest = Backbone.View.extend({

  initialize: function () {
    // _.bindAll(this);
    var self = this;

    self.listenTo(self.collection, 'add', self.addAll);
    self.listenTo(self.collection, 'change', self.addAll);
    self.listenTo(self.collection, 'remove', self.addAll);
    self.listenTo(self.collection, 'reset', self.addAll);
  },

  render: function () {
    $("#test-calendar").fullCalendar({
      editable: true,
      header: {
        left: "title",
        center: 'agendaDay,agendaWeek,month',
        right: "today prev,next"
      },
      defaultView: "agendaDay",
      slotMinutes: 15,
      timeFormat: "h:mm t{ - h:mm t}"
    });
    
    
  },

  addAll: function () {
    $("#test-calendar").fullCalendar('addEventSource', this.collection.toJSON());
  }
});