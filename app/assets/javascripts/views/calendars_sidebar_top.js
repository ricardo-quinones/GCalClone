GCalClone.Views.CalendarsSidebarTop = Backbone.View.extend({
  el: $("<ul>").addClass("calendars").attr("id", "owned-calendars"),

  template: JST['calendars/sidebar_partial'],

  initialize: function () {
    var self = this;
    var renderCallback = self.render.bind(self);

    self.listenTo(self.collection, 'add', renderCallback)
  },

  render: function () {
    var self = this;
    self.$el.html(self.template({
      calendars: self.collection,
      title: "My Calendars"
    }));

    return self;
  }
});