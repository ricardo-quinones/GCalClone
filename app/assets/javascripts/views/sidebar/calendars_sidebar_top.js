GCalClone.Views.CalendarsSidebarTop = Backbone.View.extend({
  el: $("<ul>").addClass("calendars").attr("id", "owned-calendars"),

  template: JST['calendars/sidebar_top'],

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
      calendars: self.collection
    }));

    return self;
  }
});