GCalClone.Views.EditAvailabilityCalendar = Backbone.View.extend({

  template: JST['calendars/availability_edit'],

  events: {
    "click #update-availability-calendar": "update"
  },

  render: function () {
    var self = this;
    self.$el.html(self.template({
      availabilityShare: this.model
    }));

    return self;
  },

  update: function (event) {
    var self = this;
    event.preventDefault();

    var formData = $(event.target.form).serializeJSON();

    this.model.save(formData, {
      wait: true,
      patch: true,
      success: function (response) {
        console.log(response);
        console.log(self.model);
        self.$el.dialog("close");
      },
      error: function (response) {
        console.log(response);
      }
    })
  }
});