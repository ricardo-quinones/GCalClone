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

  render: function () {
    var self = this;
    self.$el.html(self.template({ calendar: this.model }));

    $calendarShare = self.$el.find("#add-calendar-share");

    $calendarShare.html(JST['calendar_shares/new']());
    this.buildExistingShares();

    return self;
  },

  update: function (event) {
    var self = this;
    event.preventDefault();

    var formData = $(event.target.form).serializeJSON();
    formData["calendar_shares"] = this.createCalendarSharesList();

    self.model.save(formData, {
      wait: true,
      patch: true,
      success: function (response) {
        self.$el.dialog("close");
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
      $("#calendar-views").fullCalendar("removeEvents", function (calEvent) {
        return calEvent.calendar_id == self.model.id;
      });
      self.model.destroy();
      self.$el.dialog("close");
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
      var key = _(this.calendarShares).pairs().length;
      this.calendarShares[key] = formData;

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
    delete this.calendarShares[deleteKey];
  }
});