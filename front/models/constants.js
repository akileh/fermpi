var Backbone = require('backbone')

module.exports = Backbone.Model.extend({
    url: '/api/constants',
    isNew: function () {
        return false
    }
})
