GCalClone.Views.NewEvent = Backbone.View.extend({

  template: JST["events/new"],

  events: {
    "click #create-event": "create"
  },

  render: function () {
    var self = this;

    self.$el.html(self.template({
      eventsCal: self.options.calendar,
      calEvent: this.model
    }));

    return self;
  },

  create: function(event) {
    var self = this;
    event.preventDefault();

    var formData = $(event.target.form).serializeJSON();
    this.convertDates(formData.cal_event);
    console.log(formData);

    self.collection.create(formData, {
      wait: true,
      success: function (response) {
        console.log(response);
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

    calEvent["start_date"] = new Date(
      start_date.date + " " + start_date.time
    );

    calEvent["end_date"] = new Date(
      end_date.date + " " + end_date.time
    );
  }
});