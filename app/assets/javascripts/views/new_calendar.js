GCalClone.Views.NewCalendar = Backbone.View.extend({

  initialize: function () {
    this.newCalendarShares = {};
  },

  template: JST['calendars/new'],

  events: {
    "click #create-calendar": "create",
    "click #add-person": "addCalendarShare",
    "keypress #email-input": "addCalendarShare",
    "click .remove-share": "removeCalendarShare"
  },

  closeDialog: function () {
    this.$el.dialog("close");
    this.$el.empty();
    this.$el.unbind();
  },

  render: function () {
    var self = this;
    self.$el.html(self.template({ calendar: self.model }));

    var $calendarShare = self.$el.find("#add-calendar-share");
    var newCalendarShare = new GCalClone.Views.NewCalendarShare({
      el: $calendarShare
    });

    newCalendarShare.render();

    return self;
  },

  create: function(event) {
    var self = this;
    event.preventDefault();

    var formData = $(event.target.form).serializeJSON();
    formData["calendar_shares"] = this.newCalendarShares;
    console.log(formData);
    console.log(self.collection);

    self.collection.create(formData, {
      wait: true,
      success: function (response) {
        self.closeDialog();
      },
      error: function (response) {
        console.log(response);
      }
    });
  },

  addCalendarShare: function (event) {
    if (event.which === 1 || event.which === 13) {
      event.preventDefault();

      var formData = $(event.target.form).serializeJSON();
      var key = _(this.newCalendarShares).pairs().length;
      this.newCalendarShares[key] = formData;

      $buildNewShare = JST["calendar_shares/build_email"]({
        calShare: formData,
        key: key
      });

      $("#listed-calendar-shares").append($buildNewShare);
      $("#email-input").val("");
    }
  },

  removeCalendarShare: function (event) {
    event.preventDefault();

    var deleteKey = $(event.target).data("id");
    $(event.target).parent().parent().remove();
    delete this.newCalendarShares[deleteKey];
  }
});