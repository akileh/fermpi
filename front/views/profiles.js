var Backbone = require('backbone'),
    $ = require('jquery'),
    View = require('./view'),
    lang = require('../lang'),
    template = require('../templates/profiles.hbs'),
    ProfileCollection = require('../collections/profile'),
    ProfileView = require('./profilesItem')

module.exports = View.extend({
    events: {
        'click .js-new-profile': 'newProfile'
    },
    initialize: function () {
        this.renderLoading()
        this.profiles = new ProfileCollection()
        this.listenTo(this.profiles, 'sync', this.render)
        this.profiles.fetch()
    },
    render: function () {
        this.stopLoading()
        this.$el.html(template({
            lang: lang
        }))

        var fragment = document.createDocumentFragment()
        this.profiles.each(function (profile) {
            var view = new ProfileView({ profile: profile })
            fragment.appendChild(view.el)
        })
        this.$('.js-profiles').html(fragment)
    },
    newProfile: function (e) {
        e.preventDefault()
        Backbone.history.navigate($(e.target).attr('href'), {
            trigger: true
        })
    }
})
