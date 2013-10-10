GCalClone.Views.EditCalendar = Backbone.View.extend({

  template: JST['calendars/edit'],

  events: {
    'click #update-calendar': 'update',
    'click #delete-calendar': 'destroy'
  },

  render: function () {
    var self = this;

    self.$el.html(self.template({ calendar: this.model }));

    return self;
  },

  update: function (event) {
    var self = this;
    event.preventDefault();

    var formData = $(event.target.form).serializeJSON();

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