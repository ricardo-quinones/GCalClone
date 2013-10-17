GCalClone.Views.EditUser = Backbone.View.extend({

  template: JST['users/edit'],

  events: {
    'click #update-user': 'update'
  },

  render: function () {
    var self = this;

    self.$el.html(self.template({ user: this.model }));

    return self;
  },

  update: function (event) {
    var self = this;
    event.preventDefault();

    var formData = $(event.target).parent().serializeJSON();
    self.model.save(formData, {
      patch: true,
      success: function (response) {
        Backbone.history.navigate("#/");
      },
      error: function (response) {
        console.log(response);
      }
    });
  }
});
