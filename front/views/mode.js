var Backbone = require('backbone'),
    $ = require('jquery'),
    lang = require('../lang'),
    template = require('../templates/mode.hbs')

module.exports = Backbone.View.extend({
    events: {
        'click .js-minus': 'minus',
        'click .js-plus': 'plus',
        'click .js-save': 'save',
        'click .js-cancel': 'cancel',
        'input input': 'change'
    },
    initialize: function (options) {
        this.$el = $(template({
            lang: lang,
            title: options.name,
            temperature: options.temperature || 10
        }))
        $('.modals').append(this.$el)

        this.$value = this.$('.js-value')
        this.$formGroup = this.$('.form-group')
        this.$save = this.$('.js-save')
        this.$cancel = this.$('.js-cancel')
        this.$error = this.$('.js-error')

        this.$el.modal({ backdrop: false })
    },
    minus: function () {
        this.$value.val((parseFloat(this.$value.val()) - 0.1).toFixed(1))
    },
    plus: function () {
        this.$value.val((parseFloat(this.$value.val()) + 0.1).toFixed(1))
    },
    save: function (e) {
        e.preventDefault()
        if(this.$save.attr('disabled') === 'disabled')
            return

        var self = this
        this.setButtonsStates(false)
        this.trigger('save', this.$value.val(), {
            success: function () {
                self.remove()
            },
            error: function () {
                self.remove()
            }
        })
    },
    change: function () {
        var isNumber = !isNaN(parseFloat(this.$value.val()).toFixed(1))
        this.$formGroup.toggleClass('has-error', !isNumber)
        this.$error.toggleClass('hidden', isNumber)
        this.setButtonsStates(true)
    },
    setButtonsStates: function (state) {
        if(state) {
            this.$save.removeAttr('disabled')
            this.$cancel.removeAttr('disabled')
        } else {
            this.$save.attr('disabled', 'disabled')
            this.$cancel.attr('disabled', 'disabled')
        }
    },
    cancel: function (e) {
        e.preventDefault()
        this.remove()
    }
})
