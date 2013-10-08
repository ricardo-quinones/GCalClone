GCalClone.Views.UserSettings = Backbone.View.extend({
  el: '#settings-view-pages',

  template: JST['settings/user_settings'],

  initialize: function () {
    var self = this;
    var renderCallback = self.render.bind(self);
  },

  render: function () {
    var self = this;
    self.$el.html(self.template({ user: this.model }));

    return self;
  }
});