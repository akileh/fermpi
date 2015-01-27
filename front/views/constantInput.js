var View = require('./view'),
    lang = require('../lang'),
    template = require('../templates/constantInput.hbs')

module.exports = View.extend({
    events: {
        'keyup input': 'saveEnter',
        'submit': 'submit',
        'click .js-save': 'save'
    },
    initialize: function (options) {
        this.constants = options.constants
        this.constant = options.constant
        this.render()
    },
    render: function () {
        this.$el.html(template({
            lang: lang,
            name: lang.constant[this.constant],
            value: this.constants.get(this.constant)
        }))
        this.$value = this.$('.js-value')
    },
    submit: function (e) {
        e.preventDefault()
    },
    saveEnter: function (e) {
        e.preventDefault()
        if(e.keyCode === 13) {
            this.save()
        }
    },
    save: function () {
        this.constants.set(this.constant, this.$value.val())
        this.constants.save({}, { wait: true })
    }
})
