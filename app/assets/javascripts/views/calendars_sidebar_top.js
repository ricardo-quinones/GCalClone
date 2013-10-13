GCalClone.Views.CalendarsSidebarTop = Backbone.View.extend({
  el: $("<ul>").addClass("calendars").attr("id", "owned-calendars"),

  template: JST['calendars/sidebar_top'],

  initialize: function () {
    var self = this;
    var renderCallback = self.render.bind(self);


    self.listenTo(self.collection, 'add', renderCallback)
  },

  events: {
    "click .new-cal-event": "renderNewCalEvent"
  },

  render: function () {
    var self = this;
    self.$el.html(self.template({
      calendars: self.collection
    }));

    return self;
  },

  renderNewCalEvent: function (event) {
    console.log("click");
    var self = this;

    var calendar_id = $(event.target).data("id");
    var calendar = this.collection.get(calendar_id);

    var newEventView = new GCalClone.Views.NewEvent({
     el: $("#form-views"),
     model: new GCalClone.Models.Event,
     collection: this.options.events,
     calendar: calendar
   });

   newEventView.render();

   $("#form-views").dialog({
     modal: true,
     width: "auto"
   });
  }
});