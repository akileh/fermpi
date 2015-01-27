var Backbone = require('backbone'),
    _ = require('underscore')

module.exports = Backbone.Collection.extend({
    initialize: function (models, options) {
        this.options = options
    },
    setOptions: function (options) {
        this.options = options
    },
    url: function () {
        var url = this.baseUrl

        if(this.options) {
            url += '?'
            _.each(this.options, function (value, key) {
                url += (key + '=' + value + '&')
            })
        }

        return url
    }
})
