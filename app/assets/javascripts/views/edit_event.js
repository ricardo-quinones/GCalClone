GCalClone.Views.EditEvent = Backbone.View.extend({

  template: JST['events/edit'],

  events: {
    'click #update-event': 'update',
    'click #delete-event': 'destroy'
  },

  render: function () {
    var self = this;
    console.log(this.model);
    var eventsCal = GCalClone.myCalendars.get(this.model.get("calendar_id"));
    self.$el.html(self.template({
      calEvent: this.model,
      eventsCal: eventsCal
    }));

    return self;
  },

  closeDialog: function () {
    this.$el.dialog("close");
    this.$el.empty();
    this.$el.unbind();
  },

  update: function (event) {
    var self = this;
    event.preventDefault();

    var formData = $(event.target.form).serializeJSON();
    this.convertDates(formData.cal_event)

    self.model.save(formData, {
      patch: true,
      wait: true,
      success: function (response) {
        response.addFullCalendarAttrs();
        self.closeDialog();
        var fcEvent = $("#calendar-views").fullCalendar("clientEvents", response.get('id'))[0];
        _(fcEvent).extend(response.attributes);
        $("#calendar-views").fullCalendar("updateEvent", fcEvent);
      },
      error: function (response) {
        console.log(response);
      }
    });
  },

  convertDates: function (calEvent) {
    var start_date = calEvent.start_date;
    var end_date = calEvent.end_date;

    calEvent["start_date"] = new Date(
      start_date.date + " " + start_date.time
    ).toUTCString();

    calEvent["end_date"] = new Date(
      end_date.date + " " + end_date.time
    ).toUTCString();
  },

  destroy: function (event) {
    var self = this;
    event.preventDefault();
    var reallyDelete = confirm("Are you sure?")

    if (reallyDelete) {
      self.model.destroy({
        success: function (response) {
          self.$el.dialog("close");
          $("#calendar-views").fullCalendar("removeEvents", self.model.id);
        }
      });
    }
  }
});