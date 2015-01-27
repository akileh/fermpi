var Backbone = require('backbone'),
    _ = require('underscore'),
    $ = require('jquery'),
    View = require('./view'),
    lang = require('../lang'),
    template = require('../templates/newProfile.hbs'),
    ProfileModel = require('../models/profile'),
    FrameView = require('../views/newProfileItem')

module.exports = View.extend({
    events: {
        'change .js-name': 'name',
        'click .js-add': 'add',
        'click .js-save': 'save'
    },
    initialize: function (options) {
        _.bindAll(this, 'error')
        options = options || {}
        this.profile = new ProfileModel({ id: options.id })
        this.listenTo(this.profile, 'sync', this.sync)
        this.listenTo(this.profile, 'error', this.renderError)

        if(this.profile.isNew()) {
            this.frames = new Backbone.Collection({ time: '', temperature: '' })
            this.render()
        }
        else {
            this.profile.fetch()
        }
    },
    sync: function () {
        this.frames = new Backbone.Collection(this.profile.get('frames'))
        this.render()
    },
    render: function () {
        this.$el.html(template({
            lang: lang,
            name: this.profile.get('name')
        }))
        this.$frames = this.$('.js-frames')
        this.$name = this.$('.js-name')
        var fragment = document.createDocumentFragment()
        this.frames.each(function (frame) {
            var view = new FrameView({ frame: frame })
            fragment.appendChild(view.el)
        })
        this.$frames.html(fragment)
    },
    name: function (e) {
        this.profile.set('name', $(e.target).val())
    },
    add: function (e) {
        e.preventDefault()
        var frame = new Backbone.Model()
        this.frames.add(frame)
        this.$frames.append(new FrameView({ frame: frame }).el)
    },
    error: function () {
        this.renderError()
    },
    save: function (e) {
        e.preventDefault()
        var self = this
        this.profile.save(
            {
                name: this.$name.val(),
                frames: this.frames.toJSON()
            },
            {
                wait: true,
                success: function () {
                    Backbone.history.navigate('/profiles', { trigger: true })
                },
                error: self.error
            }
        )
    }
})
