GCalClone.Views.NewCalendarShare = Backbone.View.extend({

  template: JST['calendar_shares/new'],

  render: function () {
    this.$el.empty();
    this.$el.unbind();

    this.$el.html(this.template());
    return this;
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