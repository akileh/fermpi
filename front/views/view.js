var Backbone = require('backbone'),
    _ = require('underscore'),
    ErrorView = require('./error'),
    LoadingView = require('./loading')

module.exports = Backbone.View.extend({
    initialize: function () {
        _.bindAll(this, 'renderError')
    },
    renderError: function (resp, jqXHR) {
        this.stopLoading()
        this.$el.html(new ErrorView({ jqXHR: jqXHR }).el)
    },
    renderLoading: function () {
        if(!this.loading)
            this.loading = new LoadingView()

        this.$el.html(this.loading.start().el)
    },
    stopLoading: function () {
        if(this.loading)
            this.loading.stop()
    }
})
