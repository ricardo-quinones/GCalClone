window.GCalClone = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function() {
    GCalClone.currentUser = new GCalClone.Models.User({id: CURRENT_USER_ID});

    GCalClone.currentUser.fetch({
      success: function (users) {
       new GCalClone.Routers.CalendarRouter(users);
       Backbone.history.start();
      },
      error: function () { console.log('errors'); }
    });
  }
};

$(document).ready(function(){
  GCalClone.initialize();
});

var originalSync = Backbone.sync;
Backbone.sync = function(method, model, options) {
    if (method === 'patch') options.type = 'PUT';
    return originalSync(method, model, options);
};