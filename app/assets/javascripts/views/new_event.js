GCalClone.Views.NewEvent = Backbone.View.extend({

  template: JST["events/new"],

  events: {
    "click #create-event": "create"
  },

  render: function () {
    var self = this;

    var calendarSelect = this.options.myCalendars.toJSON();
    calendarSelect = calendarSelect.concat(
      this.options.calendarShares.where({can_edit_events: true}).map(function (share) {
        return share.toJSON();
      })
    );

    console.log(this.options.calendar);

    var calendarShare = this.options.calendarShares.findWhere({calendar_id: this.options.calendar.id});
    var calTitle = (typeof calendarShare == "undefined" ? this.options.calendar.get("title") : calendarShare.get("title"));

    self.$el.html(self.template({
      calEvent: this.model,
      calTimeZone: this.options.calendar.get("time_zone"),
      calTitle: calTitle,
      calendarSelect: calendarSelect
    }));

    return self;
  },

  create: function(event) {
    var self = this;
    event.preventDefault();

    var formData = $(event.target.form).serializeJSON();
    this.convertDates(formData.cal_event);
    console.log(formData.cal_event);

    self.collection.create(formData, {
      wait: true,
      success: function (response) {
        response.addFullCalendarAttrs();
        self.$el.dialog("close");
        $("#calendar-views").fullCalendar("renderEvent", response.toJSON());
      },
      error: function (response) {
        console.log(response);
      }
    });
  },

  convertDates: function (calEvent) {
    var start_date = calEvent.start_date;
    var end_date = calEvent.end_date;

    console.log(start_date.date);
    console.log(start_date.time);

    console.log(TIME_ZONES[calEvent.time_zone].tzinfo.identifier);

    calEvent["start_date"] = moment.tz(
      start_date.date + " " + start_date.time,
      TIME_ZONES[calEvent.time_zone].tzinfo.identifier
    ).format();

    console.log(calEvent["start_date"]);

    calEvent["end_date"] = moment.tz(
      end_date.date + " " + end_date.time,
      TIME_ZONES[calEvent.time_zone].tzinfo.identifier
    ).format();

    console.log(calEvent["end_date"]);
  }
});