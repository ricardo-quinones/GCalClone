GCalClone.Views.CalendarsAgenda = Backbone.View.extend({
  el: '#calendar-view',

  template: JST['calendars/agenda'],

  initialize: function () {
    var self = this;

    var renderCallback = self.render.bind(self)

    self.listenTo(self.collection, 'add', renderCallback);
  },

  render: function () {
    self = this;
    $('#calendar-nav').html(JST['calendars/nav']());

    var calendarsSidebarView = new GCalClone.Views.CalendarsSidebar({
      collection: self.options.calendars
    });

    $agenda = self.renderAgendaItems();

    calendarsSidebarView.render();
    self.$el.html($agenda);

    return self;
  },

  renderAgendaItems: function () {
    self = this;
    $agenda = $("<ul>");
    self.collection.each(function (calEvent) {
      if (calEvent.startDate() > currentDate()) {
        var dayId = calEvent.dayId()
        var doesntHaveTag = ($agenda.find("#" + dayId).length == 0)
        var allDay = calEvent.allDay()
        console.log(calEvent.startDate());
        console.log(calEvent.allDay());

        if (doesntHaveTag) {
          $agenda.append(JST['calendars/agenda/new_day']({
            dayId: dayId,
            calEvent: calEvent
          }));
        }
        else {
          if (calEvent.allDay()) {
            $agenda
              .find("#" + dayId + " .all-day-events")
              .append(JST['calendars/agenda/all_day_event']({
                calEvent: calEvent
            }));
          }
          else {
            $agenda
              .find("#" + dayId + " .events")
              .append(JST['calendars/agenda/new_event']({
                calEvent: calEvent
            }));
          };
        };
      }
    });

    return $agenda;
  }
});