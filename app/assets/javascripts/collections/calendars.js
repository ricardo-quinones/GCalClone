GCalClone.Collections.Calendars = Backbone.Collection.extend({
  model: GCalClone.Models.Calendar,
  url: '/calendars'
});
