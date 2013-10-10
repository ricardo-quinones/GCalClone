GCalClone.Views.CalendarsIndex = Backbone.View.extend({

  template: JST['calendars/index'],

  initialize: function () {
    var self = this;

    var renderCallback = self.render.bind(self)

    self.listenTo(self.collection, 'add', renderCallback);
    self.listenTo(self.collection, 'change', renderCallback);
    self.listenTo(self.collection, 'remove', renderCallback);
  },

  render: function () {
    var self = this;

    self.$el.html(self.template({ calendars: this.collection }));

    return self;
  }
});