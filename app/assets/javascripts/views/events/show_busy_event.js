GCalClone.Views.ShowBusyEvent = Backbone.View.extend({

  template: JST['events/busy_show'],

  render: function () {
    var self = this;

    self.$el.html(self.template({
      calEvent: self.options.calEvent,
      availabilityShare: self.options.availabilityShare
    }));

    return this;
  },
});