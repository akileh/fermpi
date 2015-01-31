var $ = require('jquery'),
    View = require('./view'),
    lang = require('../lang'),
    template = require('../templates/newProfileItem.hbs')

module.exports = View.extend({
    events: {
        'click .js-delete': 'delete',
        'click .js-type-item': 'type',
        'change .js-temperature': 'temperature',
        'change .js-time': 'time'
    },
    initialize: function (options) {
        this.frame = options.frame
        if(!this.frame.has('type'))
            this.frame.set('type', 'days')
        this.render()
    },
    render: function () {
        this.$el.html(template({
            lang: lang,
            temperature: this.frame.get('temperature'),
            time: this.frame.get('time'),
            timeName: lang.profile_times[this.frame.get('type')],
            timeNames: lang.profile_times
        }))
        this.$type = this.$('.js-type')
    },
    temperature: function (e) {
        this.frame.set('temperature', $(e.target).val())
    },
    time: function (e) {
        this.frame.set('time', $(e.target).val())
    },
    type: function (e) {
        e.preventDefault()
        this.$type.text(lang.profile_times[$(e.target).attr('data-value')])
        this.frame.set('type', $(e.target).attr('data-value'))
    },
    delete: function (e) {
        e.preventDefault()
        this.frame.destroy()
        this.remove()
    }
})
