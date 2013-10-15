GCalClone.Views.EditEvent = Backbone.View.extend({

  events: {
    'click #update-event': 'update',
    'click #delete-event': 'destroy'
  },

  render: function () {
    var self = this;
    var calendarId = this.model.get("calendar_id");
    var eventsCal = this.options.myCalendars.get(calendarId);
    eventsCal = eventsCal || this.options.subscribedCalendars.get(calendarId);

    var calendarSelect = this.options.myCalendars.toJSON();
    calendarSelect = calendarSelect.concat(
      this.options.calendarShares.where({can_edit_events: true}).map(function (share) {
        return share.toJSON();
      })
    );

    var calendarShare = this.options.calendarShares.findWhere({calendar_id: eventsCal.id});
    var calTitle = (typeof calendarShare == "undefined" ? eventsCal.get("title") : calendarShare.get("title"));

    if (typeof calendarShare == "undefined" || calendarShare.get("can_edit_events")) {
      self.$el.html(JST['events/edit']({
        calEvent: this.model,
        calTimeZone: eventsCal.get("time_zone"),
        calTitle: eventsCal.get("title"),
        calendarSelect: calendarSelect
      }));
    }
    else {
      self.$el.html(JST['events/show']({
        calEvent: this.model,
        calendarShare: calendarShare
      }));
    }

    return self;
  },

  update: function (event) {
    var self = this;
    event.preventDefault();

    var formData = $(event.target.form).serializeJSON();
    this.convertDates(formData.cal_event);

    self.model.save(formData, {
      patch: true,
      wait: true,
      success: function (response) {
        response.addFullCalendarAttrs();
        self.$el.dialog("close");

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

    calEvent["start_date"] = moment.tz(
      start_date.date + " " + start_date.time,
      TIME_ZONES[calEvent.time_zone].tzinfo.identifier
    ).format();

    calEvent["end_date"] = moment.tz(
      end_date.date + " " + end_date.time,
      TIME_ZONES[calEvent.time_zone].tzinfo.identifier
    ).format();
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