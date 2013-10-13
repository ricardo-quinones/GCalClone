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
      calendars: self.options.subscribedCalendars
    });

    self.$el
      .append(sidebarTop.render().$el)
      .append(sidebarBottom.render().$el);

    return self;
  },

  addToCal: function (event) {
    event.preventDefault();
    var calendar = this.collection.get($(event.target).data("id"));

    var newEventView = new GCalClone.Views.NewEvent({
     el: $("#form-views"),
     model: new GCalClone.Models.Event({
       start: this.nextNearestHour(),
       end: this.oneHourLater()
     }),
     collection: this.options.calEvents,
     calendar: calendar
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

  editCalShare: function (event) {
    event.preventDefault();
    var calendar = this.options.subscribedCalendars.get($(event.target).data("id"));
    var calendarShare = this.options.calendarShares.findWhere({calendar_id: calendar.id});
    console.log(calendarShare)
    var editCalendarShareView = new GCalClone.Views.EditCalendarShare({
      el: $("#form-views"),
      model: calendarShare,
    });

    editCalendarShareView.render();
  }
});