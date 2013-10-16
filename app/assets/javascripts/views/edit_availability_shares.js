GCalClone.Views.EditAvailabilityShares = Backbone.View.extend({

  initialize: function () {
    this.emails = this.collection.map(function (share) { return share.get("email"); });
  },

  template: JST['availability_shares/edit'],

  events: {
    'click #update-availability-shares': 'update',
    'click #unsubscribe-to-calendar': 'destroy'
  },

  render: function () {
    var self = this;

    self.$el.html(self.template({
      availabilityShares: this.collection
    }));

    this.buildExistingShares();

    return self;
  },

  buildExistingShares: function () {
    var self = this;

    _(this.emails).each(function (email, index) {
      $buildExistingShare = JST["availability_shares/build_email"]({
        email: email,
        index: index
      });

      $("#listed-availability-shares").append($buildExistingShare);
    });
  }

  // update: function (event) {
  //   var self = this;
  //   event.preventDefault();
  //
  //   var formData = $(event.target.form).serializeJSON();
  //
  //   self.model.save(formData, {
  //     patch: true,
  //     success: function (response) {
  //       self.$el.dialog("close");
  //     },
  //     error: function (response) {
  //       console.log(response);
  //     }
  //   });
  // },
  //
  // destroy: function (event) {
  //   var self = this;
  //   event.preventDefault();
  //
  //   var calendarId = $(event.target).data('id');
  //   var reallyDelete = confirm("Are you sure?")
  //
  //   if (reallyDelete) {
  //     self.model.destroy({
  //       success: function(response) {
  //         $("#calendar-views").fullCalendar("removeEvents", function (calEvent) {
  //           return calEvent.calendar_id == self.model.get("calendar_id");
  //         });
  //         self.$el.dialog("close");
  //       }
  //     });
  //   }
  // }
});