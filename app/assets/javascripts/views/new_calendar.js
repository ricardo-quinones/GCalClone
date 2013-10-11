GCalClone.Views.NewCalendar = Backbone.View.extend({

  initialize: function () {
    this.newCalendarShares = {}
  },

  template: JST['calendars/new'],

  events: {
    "click #create-calendar": "create",
    "click #add-person": "addCalendarShare",
    "keypress #email-input": "addCalendarShare",
    "click .remove-share": "removeCalendarShare"
  },

  render: function () {
    var self = this;
    self.$el.html(self.template({ calendar: self.model }));

    $calendarShare = self.$el.find("#add-calendar-share")
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
    // console.log(formData);

    self.collection.create(formData, {
      success: function (response) {
        Backbone.history.navigate("#/");
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
        newShare: formData,
        key: key
      });

      $("#pending-calendar-shares").append($buildNewShare);
      $(event.target).val("");
    }
  },

  removeCalendarShare: function (event) {
    event.preventDefault();

    var deleteKey = $(event.target).data("id");
    $(event.target).parent().parent().remove();
    delete this.newCalendarShares[deleteKey];
  }
});