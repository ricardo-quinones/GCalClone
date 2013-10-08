GCalClone.Views.CalendarsAgenda = Backbone.View.extend({
  el: '#calendar-view',

  template: JST['calendars/agenda'],

  initialize: function () {
    var self = this;

    var renderCallback = self.render.bind(self)

    self.listenTo(self.collection, 'add', renderCallback);
  },

  render: function () {
    self = this;
    $('#calendar-nav').html(JST['calendars/nav']());

    var calendarsSidebarView = new GCalClone.Views.CalendarsSidebar({
      collection: self.options.calendars
    });

    calendarsSidebarView.render();
    self.$el.html(self.template({
      events: self.collection
    }));

    return self;
  }
});