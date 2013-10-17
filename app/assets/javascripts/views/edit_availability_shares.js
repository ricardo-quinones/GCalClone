GCalClone.Views.EditAvailabilityShares = Backbone.View.extend({

  initialize: function () {
    this.emails = this.collection.toJSON();
  },

  template: JST['availability_shares/edit'],

  events: {
    'click #update-availability-shares': 'update',
    "click #availability-add-person": "addEmail",
    "keypress #availability-email-input": "addEmail",
    "click .remove-share": "removeEmail"
  },

  render: function () {
    var self = this;

    self.$el.html(self.template({
      availabilityShares: this.collection
    }));

    this.buildExistingShares();

    return self;
  },

  update: function (event) {
    var self = this;
    event.preventDefault();

    var shares = {
      availability_shares: this.emails
    }

    self.collection.create(shares, {
      success: function (response) {
        self.collection.set(response.attributes.availability_shares);
        self.$el.dialog("close");
      },
      error: function (response) {
        console.log(response);
      }
    });

  },

  buildExistingShares: function () {
    var self = this;

    _(this.emails).each(function (emailHash) {
      $buildExistingShare = JST["availability_shares/build_email"]({
        email: emailHash.email
      });

      $("#listed-availability-shares").append($buildExistingShare);
    });
  },

  addEmail: function (event) {
    if (event.which === 1 || event.which === 13) {
      event.preventDefault();

      var email = $(event.target.form).serializeJSON().email;

      this.emails.push({email: email});

      $buildNewShare = JST["availability_shares/build_email"]({
        email: email
      });

      $("#listed-availability-shares").append($buildNewShare);
      $("#availability-email-input").val("");
    }
  },

  removeEmail: function (event) {
    event.preventDefault();
    var email = $(event.target).data("email");
    this.emails = _(this.emails).filter(function (emailHash) {
      return emailHash.email !==  email;
    });
    $(event.target).parent().parent().remove();
  }
});