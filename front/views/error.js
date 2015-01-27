var Backbone = require('backbone'),
    lang = require('../lang'),
    template = require('../templates/error.hbs')

module.exports = Backbone.View.extend({
    initialize: function (options) {
        var error
        try {
            var json = JSON.parse(options.jqXHR.responseText)
            if(json.error === 'arduino')
                error = lang.error_arduino
            else
                error = lang.error_general
        } catch(e) {
            error = lang.error_timeout
        }
        this.$el.html(template({ error: error }))
        return this
    }
})
