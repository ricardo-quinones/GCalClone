GCalClone.Views.CalendarsSidebarBottom = Backbone.View.extend({
  el: $("<ul>").addClass("calendars"),

  template: JST['calendars/sidebar_bottom'],

  initialize: function () {
    var self = this;
    var renderCallback = self.render.bind(self);

    self.listenTo(self.collection, 'add', renderCallback);
    self.listenTo(self.collection, 'change', renderCallback); // not working for availability calendars
    self.listenTo(self.collection, 'remove', renderCallback);
    self.listenTo(self.collection, 'change:title', renderCallback); // not working for availability calendars
  },

  render: function () {
    var self = this;

    var calendars = self.collection.filter(function (calendarShare) {
      return (typeof self.options.calendars.findWhere({id: calendarShare.get("calendar_id")}) == "object");
    });

    calendars = calendars.concat(self.options.calendars.filter(function (calendar) {
      return (typeof calendar.id == "undefined");
    }));

    self.$el.html(self.template({
      calendars: calendars
    }));

    return self;
  }
});