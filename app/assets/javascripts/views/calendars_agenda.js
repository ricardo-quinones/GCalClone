GCalClone.Views.CalendarsAgenda = Backbone.View.extend({
  el: '#calendar-view',

  template: JST['calendars/agenda'],

  initialize: function () {
    var self = this;

    var renderCallback = self.template({
      calendars: self.collection,
    })

    self.listenTo(self.collection, 'add', renderCallback)
  },

  render: function () {
    self = this;
    $('#calendar-nav').html(JST['calendars/nav']());

    var calendarsSidebarView = new GCalClone.Views.CalendarsSidebar({
      collection: self.collection
    });

    calendarsSidebarView.render();
    self.$el.html(self.template({ calendars: self.collection }));

    return self;
  }
});