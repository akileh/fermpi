var Backbone = require('backbone'),
    $ = require('jquery'),
    lang = require('../lang'),
    template = require('../templates/nav.hbs')

module.exports = Backbone.View.extend({
    events: {
        'click .js-nav': 'navigate'
    },
    initialize: function (options) {
        this.$el.html(template({
            name: window.app.name,
            lang: lang
        }))
        this.$navLis = this.$('.js-li')
        this.setActivePage()
        this.listenTo(options.router, 'route', this.setActivePage)
        return this
    },
    setActivePage: function () {
        var pathname = window.location.pathname
        this.$navLis.removeClass('active')
        this.$('.js-nav').each(function (index, value) {
            var $this = $(this)
            var href = $this.attr('href')
            if(href === '/') {
                if(pathname === '/')
                    $this.parent().addClass('active')
            }
            else {
                if(href && pathname.match(new RegExp('^' + href.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')))) {
                    $this.parent().addClass('active')
                }
            }
        })
    },
    navigate: function (e) {
        e.preventDefault()
        this.$('.navbar-collapse').removeClass('in')
        Backbone.history.navigate($(e.target).attr('href'), {
            trigger: true,
            replace: false
        })
    }
})

