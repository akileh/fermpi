var Backbone = require('backbone')

module.exports = Backbone.Model.extend({
    url: '/api/settings',
    isNew: function () {
        return false
    }
})