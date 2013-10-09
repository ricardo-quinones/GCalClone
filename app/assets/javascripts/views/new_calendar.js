GCalClone.Views.NewCalendar = Backbone.View.extend({

  template: JST['calendars/sidebar'],

  initialize: function () {
    var self = this;
    var renderCallback = self.render.bind(self);

    self.listenTo(self.collection, 'add', renderCallback)
  },

  render: function () {
    var self = this;
    self.$el.html(self.template({ calendars: self.collection }));

    return self;
  }
});