GCalClone.Views.EditCalendar = Backbone.View.extend({

  template: JST['calendars/edit'],

  events: {
    'click #update-calendar': 'update'
  },

  render: function () {
    var self = this;

    self.$el.html(self.template({ calendar: this.model }));

    return self;
  },

  update: function (event) {
    var self = this;
    event.preventDefault();

    var formData = $(event.target).parent().parent().serializeJSON();
    console.log(formData);
    self.model.save(formData, {
      patch: true,
      success: function (response) {
        console.log(response);
        Backbone.history.navigate("/#");
      },
      error: function (response) {
        console.log(response);
      }
    });
  }
});