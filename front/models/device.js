var Backbone = require('backbone')

module.exports = Backbone.Model.extend({
    url: '/api/device/',
    isNew: function () {
        return false
    }
})
