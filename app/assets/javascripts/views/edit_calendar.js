GCalClone.Views.EditCalendar = Backbone.View.extend({

  initialize: function () {
    this.calendarShares = {};
  },

  template: JST['calendars/edit'],

  events: {
    'click #update-calendar': 'update',
    'click #delete-calendar': 'destroy',
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
    self.$el.html(self.template({ calendar: this.model }));

    $calendarShare = self.$el.find("#add-calendar-share");
    // var editCalendarShare = new GCalClone.Views.EditCalendarShare({
//       el: $calendarShare,
//       calendar: this.model
//     });

    $calendarShare.html(JST['calendar_shares/new']());
    this.buildExistingShares();

    return self;
  },

  update: function (event) {
    var self = this;
    event.preventDefault();

    var formData = $(event.target.form).serializeJSON();
    formData["calendar_shares"] = this.calendarShares;

    self.model.save(formData, {
      wait: true,
      patch: true,
      success: function (response) {
        self.closeDialog();
      },
      error: function (response) {
        console.log(response);
      }
    });
  },

  destroy: function (event) {
    var self = this;
    event.preventDefault();

    var calendarId = $(event.target).data('id');
    var reallyDelete = confirm("Are you sure?")

    if (reallyDelete) {
      self.model.destroy(); // also need to delete related events
      self.closeDialog();
    }
  },

  buildExistingShares: function () {
    var self = this;

    _(self.model.get("emails_shared_with")).each(function (emailHash) {
      var key = _(self.calendarShares).pairs().length;
      self.calendarShares[key] = emailHash;

      $buildExistingShare = JST["calendar_shares/build_email"]({
        calShare: emailHash,
        key: key
      });

      $("#listed-calendar-shares").append($buildExistingShare);
    });
  },

  addCalendarShare: function (event) {
    if (event.which === 1 || event.which === 13) {
      event.preventDefault();

      var formData = $(event.target.form).serializeJSON();
      var key = _(this.calendarShares).pairs().length;
      this.calendarShares[key] = formData;

      $buildNewShare = JST["calendar_shares/build_email"]({
        calShare: formData,
        key: key
      });

      $("#listed-calendar-shares").append($buildNewShare);
      $("#email-input").val("");
      console.log(this.calendarShares);
    }
  },

  removeCalendarShare: function (event) {
    event.preventDefault();

    var deleteKey = $(event.target).data("id");
    $(event.target).parent().parent().remove();
    delete this.calendarShares[deleteKey];
  }
});