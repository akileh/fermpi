var Backbone = require('backbone'),
    Spinner = require('spin.js')

module.exports = Backbone.View.extend({
    initialize: function () {
        return this
    },
    start: function () {
        if(this.spinner)
            this.spinner.stop()

        this.spinner = new Spinner({
            lines: 11, // The number of lines to draw
            length: 0, // The length of each line
            width: 13, // The line thickness
            radius: 30, // The radius of the inner circle
            corners: 1, // Corner roundness (0..1)
            rotate: 0, // The rotation offset
            direction: 1, // 1: clockwise, -1: counterclockwise
            color: '#000', // #rgb or #rrggbb or array of colors
            speed: 1, // Rounds per second
            trail: 60, // Afterglow percentage
            shadow: false, // Whether to render a shadow
            hwaccel: true, // Whether to use hardware acceleration
            className: 'spinner', // The CSS class to assign to the spinner
            zIndex: 2e9, // The z-index (defaults to 2000000000)
            top: '50%', // Top position relative to parent
            left: '50%' // Left position relative to parent
        }).spin()
        this.$el.html(this.spinner.el)
        return this
    },
    stop: function () {
        if(this.spinner)
            this.spinner.stop()
        return this
    }
})
