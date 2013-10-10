GCalClone.Views.EditCalendarShare = Backbone.View.extend({

  template: JST['calendar_shares/edit'],

  events: {
    'click #update-calendar-share': 'update'
  },

  render: function () {
    var self = this;
    self.$el.html(self.template({ calendarShare: this.model }));
    return self;
  },

  update: function (event) {
    var self = this;
    event.preventDefault();

    var formData = $(event.target.form).serializeJSON();
    console.log(event);
    console.log(formData);

    self.model.save(formData, {
      patch: true,
      success: function (response) {
        Backbone.history.navigate("#/");
      },
      error: function (response) {
        console.log(response);
      }
    });
  },

  destroy: function (event) {
    var self = this;
    event.preventDefault();

    var calendarId = $(event.target).data('id');
    var reallyDelete = confirm("Are you sure?")

    if (reallyDelete) {
      self.model.destroy();
      Backbone.history.navigate("#/");
    }
  }
});