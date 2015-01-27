var View = require('./view'),
    $ = require('jquery'),
    lang = require('../lang'),
    template = require('../templates/constantDropdown.hbs')

module.exports = View.extend({
    className: 'row',
    events: {
        'click .js-item': 'item',
        'click .js-save': 'saveButton',
    },
    initialize: function (options) {
        this.constants = options.constants
        this.constant = options.constant
        this.value = this.constants.get(this.constant)
        this.render()
    },
    render: function () {
        this.$el.html(template({
            lang: lang,
            name: lang.constant[this.constant],
            valueName: lang.constant[this.constant + '_values'][this.value],
            values: lang.constant[this.constant + '_values']
        }))
        this.$selected = this.$('.js-selected')
    },
    item: function (e) {
        e.preventDefault()
        this.value = $(e.target).attr('data-value')
        this.$selected.text(lang.constant[this.constant + '_values'][this.value])
    },
    saveButton: function (e) {
        e.preventDefault()
        this.constants.set(this.constant, this.value)
        this.constants.save({}, { wait: true })
    }
})
