GCalClone.Routers.CalendarRouter = Backbone.Router.extend({
  initialize: function (calendars) {
    this.calendars = calendars;
  },

  routes: {
    "": "sidebar"
  },

  sidebar: function () {
    var calendarsSidebarView = new GCalClone.Views.CalendarsSidebar({
      collection: this.calendars
    });

    calendarsSidebarView.render();
  }

});