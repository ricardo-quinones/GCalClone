GCalClone.Views.Sidebar = Backbone.View.extend({
  el: "#sidebar",

  // events: {
  //   "click .new-cal-event": "click"
  // },

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

    var calendar_id = $(event.target).data("id");
    var calendar = this.collection.get(calendar_id);

    var newEventView = new GCalClone.Views.NewEvent({
     el: $("#form-views"),
     model: new GCalClone.Models.Event({
       start: this.nextNearestHour(),
       end: this.oneHourLater()
     }),
     collection: this.options.events,
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
  }
});