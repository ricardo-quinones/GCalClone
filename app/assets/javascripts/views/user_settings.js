GCalClone.Views.UserSettings = Backbone.View.extend({
  el: '#settings-view-pages',

  template: JST['settings/user_settings'],

  initialize: function () {
    var self = this;
    var renderCallback = self.render.bind(self);

    self.listenTo(self.model, 'change', renderCallback);
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
    event.preventDefault();

    var formData = $(event.target).parent().serializeJSON();
    this.model.save(formData, {patch: true}) // add wait: true
  }
});