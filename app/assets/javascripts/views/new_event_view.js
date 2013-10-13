GCalClone.Views.NewEventView = Backbone.View.extend({

    render: function() {
        $(this.el).dialog({
            modal: true,
            title: 'New Event',
            buttons: {'Cancel': this.close}
        });

        return this;
    },

    close: function() {
        $(this.el).dialog('close');
    }
});