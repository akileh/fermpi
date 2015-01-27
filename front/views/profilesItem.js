var Backbone = require('backbone'),
    View = require('./view'),
    _ = require('underscore'),
    lang = require('../lang'),
    template = require('../templates/profilesItem.hbs')

module.exports = View.extend({
    tagName: 'a',
    className: 'list-group-item',
    events: {
        'click .js-delete': 'delete',
        'click': 'profilePage'
    },
    initialize: function (options) {
        this.profile = options.profile
        this.listenTo(this.profile, 'destroy', this.remove)
        this.$el.attr('href', '/profiles/' + this.profile.id)
        this.$el.html(template(_.extend(
            { lang: lang },
            this.profile.toJSON()
        )))
    },
    profilePage: function (e) {
        e.preventDefault()
        Backbone.history.navigate('/profile/' + this.profile.get('id'), {
            trigger: true
        })
    },
    delete: function (e) {
        e.stopPropagation()
        e.preventDefault()
        this.profile.destroy()
    }
})
