GCalClone.Views.UserSettings = Backbone.View.extend({
  el: '#settings-view-pages',

  template: JST['settings/user_settings'],

  initialize: function () {
    var self = this;

    // self.listenTo(self.model, 'change', Backbone.history.navigate("/#"));
  },

  events: {
    'click #save-user': 'save'
  },

  render: function () {
    var self = this;
    self.$el.html(self.template({ user: this.model }));

    return self;
  },

  save: function (event) {
    var self = this;
    event.preventDefault();

    var formData = $(event.target).parent().serializeJSON();
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