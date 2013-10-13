GCalClone.Views.CalendarsSidebarBottom = Backbone.View.extend({
  el: $("<ul>").addClass("calendars"),

  template: JST['calendars/sidebar_bottom'],

  initialize: function () {
    var self = this;
    var renderCallback = self.render.bind(self);

    self.listenTo(self.collection, 'add', renderCallback);
    self.listenTo(self.collection, 'change', renderCallback);
    self.listenTo(self.collection, 'remove', renderCallback);
  },

  render: function () {
    var self = this;
    self.$el.html(self.template({
      calendarShares: self.collection.filter(function (calendarShare) {
        return (typeof self.options.calendars.findWhere({id: calendarShare.get("calendar_id")}) == "object");
      })
    }));

    return self;
  }
});