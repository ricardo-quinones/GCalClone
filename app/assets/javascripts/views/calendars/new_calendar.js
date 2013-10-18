GCalClone.Views.NewCalendar = Backbone.View.extend({

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
    self.$el.find("#add-calendar-share").html(JST["calendar_shares/new"]());

    return self;
  },

  create: function(event) {
    var self = this;
    event.preventDefault();

    var formData = $(event.target.form).serializeJSON();
    formData["calendar_shares"] = this.createCalendarSharesList();

    self.collection.create(formData, {
      wait: true,
      success: function (response) {
        self.$el.dialog("close");
      },
      error: function (response) {
        console.log(response);
      }
    });
  },

  createCalendarSharesList: function () {
    var self = this;
    var newShares = {};
    $(".listed-calendar-share").each(function () {
      var key = _(newShares).pairs().length;
      var newShare = {
        email: $(this).find(".td-email").text(),
        permissions: $(this).find("select").val()
      };

      newShares[key] = newShare;
    });

    return newShares;
  },

  addCalendarShare: function (event) {
    if (event.which === 1 || event.which === 13) {
      event.preventDefault();

      var formData = $(event.target.form).serializeJSON();

      $buildNewShare = JST["calendar_shares/build_email"]({
        calShare: formData
      });

      $("#listed-calendar-shares").append($buildNewShare);
      $("#email-input").val("");
    }
  },

  removeCalendarShare: function (event) {
    event.preventDefault();
    $(event.target).parent().parent().remove();
  }
});