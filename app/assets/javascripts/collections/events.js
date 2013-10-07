GCalClone.Collections.Events = Backbone.Collection.extend({
  model: GCalClone.Models.Event,
  url: '/events'
});