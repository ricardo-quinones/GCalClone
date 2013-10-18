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
    var pojo = self.options.calendar.toJSON();
    pojo.title = formData.availability_share.title;

    this.model.save(formData, {
      patch: true,
      success: function (response) {
        self.options.calendar.set(pojo); // trigger is not functioning properly
        self.$el.dialog("close");
      },
      error: function (response) {
        console.log(response);
      }
    })
  }
});