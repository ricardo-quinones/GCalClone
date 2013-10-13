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
  }
});