GCalClone.Views.EditCalendarShare = Backbone.View.extend({

  template: JST['calendar_shares/edit'],

  events: {
    'click #update-calendar-share': 'update',
    'click #unsubscribe-to-calendar': 'destroy'
  },

  render: function () {
    var self = this;
    self.$el.html(self.template({
      calendarShare: this.model,
      calendar: this.options.calendar
    }));
    return self;
  },

  update: function (event) {
    var self = this;
    event.preventDefault();

    var formData = $(event.target.form).serializeJSON();

    self.model.save(formData, {
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
      self.model.destroy({
        success: function(response) {
          $("#calendar-views").fullCalendar("removeEvents", function (calEvent) {
            return calEvent.calendar_id == self.model.get("calendar_id");
          });
          self.$el.dialog("close");
        }
      });
    }
  }
});