GCalClone.Views.EditAvailabilityCalendar = Backbone.View.extend({

  template: JST['calendars/availability_edit'],

  events: {
    "click #update-availability-calendar": "update"
  },

  render: function () {
    var self = this;
    console.log(this.model);
    console.log(this.options.availabilityShare);
    self.$el.html(self.template({
      availabilityShare: this.options.availabilityShare
    }));

    return self;
  },

  update: function (event) {
    event.preventDefault();

    console.log("click")
  }
});