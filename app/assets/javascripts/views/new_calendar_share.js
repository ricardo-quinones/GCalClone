GCalClone.Views.NewCalendarShare = Backbone.View.extend({

  template: JST['calendar_shares/new'],

  render: function () {
    this.$el.empty();
    this.$el.unbind();

    this.$el.html(this.template());
    return this;
  }
});