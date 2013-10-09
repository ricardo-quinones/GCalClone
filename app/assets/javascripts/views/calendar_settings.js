GCalClone.Views.CalendarSettings = Backbone.View.extend({

  template: JST['calendars/settings'],

  events: {
    'click #update-calendar': 'update'
  },

  render: function () {
    var self = this;
    var auth_token = $('meta[name=\"csrf-token\"').attr("content");

    self.$el.html(self.template({
      calendar: this.model,
      auth_token: auth_token
     }));

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