var Backbone = require('backbone')

module.exports = Backbone.Model.extend({
    url: function () {
        return '/api/profile' + (this.has('id') ? '/' + this.get('id') : '')
    }
})
