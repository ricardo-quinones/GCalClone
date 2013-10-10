GCalClone.Views.NewCalendar = Backbone.View.extend({

  template: JST['calendars/new'],

  events: {
    "click #create-calendar": "create"
  },

  render: function () {
    var self = this;
    self.$el.html(self.template({ calendar: self.model }));
    return self;
  },

  create: function(event) {
    var self = this;
    event.preventDefault();

    var formData = $(event.target.form).serializeJSON();

    self.collection.create(formData, {
      success: function (response) {
        Backbone.history.navigate("#/");
      },
      error: function (response) {
        console.log(response);
      }
    });
  }
});