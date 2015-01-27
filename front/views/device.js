var Backbone = require('backbone'),
    _ = require('underscore'),
    $ = require('jquery'),
    lang = require('../lang'),
    template = require('../templates/device.hbs')

module.exports = Backbone.View.extend({
    events: {
        'click .js-func': 'func',
        'click .js-save': 'save'
    },
    initialize: function (options) {
        this.device = options.device
        this.installed = options.installed
        this.render()
    },
    render: function () {
        var temperature
        if(this.device.get('pinType') === 'onewire')
            temperature = this.device.has('value') ? (this.device.get('value').toFixed(1)) + lang.degree_symbol : '-'

        this.$el.html(template({
            lang: lang,
            pinName: this.device.get('pinName'),
            funcName: lang.func[this.device.get('func')],
            funcs: _.pick(lang.func, this.device.get('funcs')),
            device: lang.pinType[this.device.get('pinType')],
            temperature: temperature
        }))
        this.$funcName = this.$('.js-func-name')
        this.$save = this.$('.js-save')
        return this
    },
    func: function (e) {
        e.preventDefault()
        var func = $(e.target).attr('data-value')
        this.device.set('func', func)
        this.$funcName.text(lang.func[func])
    },
    save: function () {
        var self = this
        this.device.save({}, {
            success: function (device) {
                if((self.installed && device.get('func') === 'none') || (!self.installed && device.get('func') !== 'none'))
                    self.remove()
            },
            error: this.renderError
        })
    }
})
