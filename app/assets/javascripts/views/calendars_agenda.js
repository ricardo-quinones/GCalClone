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
      var dayId = calEvent.dayId()

      // dayId doesn't exist
      if ($agenda.find("#" + dayId).length == 0) {
        $agenda.append(JST['calendars/agenda/new_day']({
          dayId: dayId,
          calEvent: calEvent
        }));
      }

      // dayId exists
      else {
        $agenda.find("#" + dayId).append(JST['calendars/agenda/new_event']({
          calEvent: calEvent
        }));
      };
    });

    return $agenda;
  }
});