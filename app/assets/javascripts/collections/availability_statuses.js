GCalClone.Collections.AvailabilityStatuses = Backbone.Collection.extend({
  model: GCalClone.Models.AvailabilityStatus,
  url: '/availability_statuses'
});