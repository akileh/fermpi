var View = require('./view'),
    _ = require('underscore'),
    lang = require('../lang'),
    template = require('../templates/settings.hbs'),
    ModeView = require('./mode'),
    SettingsModel = require('../models/settings'),
    BeerModel = require('../models/beer')

module.exports = View.extend({
    className: "row",
    events: {
        'click .js-temperature': 'changeTemperature',
        'click .js-beer-constant': 'modeBeer',
        'click .js-fridge-constant': 'modeFridge',
        'click .js-off': 'modeOff',
        'click .js-start-beer': 'startBeer',
        'click .js-pause-beer': 'pauseBeer',
        'click .js-resume-beer': 'resumeBeer',
        'click .js-stop-beer': 'stopBeer',
        'submit form': 'startBeer'
    },
    initialize: function (options) {
        _.bindAll(this, 'renderBeer', 'initBeer', 'renderBeer')
        this.renderLoading()
        this.options = options
        this.settings = new SettingsModel()
        var self = this
        this.listenToOnce(this.settings, 'sync', function () {
            self.render()
                .renderMode()
                .renderTemperature()
            self.listenTo(this.settings, 'change:mode', this.renderMode)
            self.listenTo(this.settings, 'change:temperature', this.renderTemperature)
            self.initBeer(this.settings.get('beer'))
        })
        this.listenTo(this.settings, 'error', this.renderError)
        this.settings.fetch()
    },
    initBeer: function (attributes) {
        attributes = attributes || {}
        if(this.beer)
            this.stopListening(this.beer)

        this.beer = new BeerModel(attributes)
        this.listenTo(this.beer, 'sync', this.renderBeer)
        this.listenTo(this.beer, 'error', this.renderError)
        this.beer.fetch()
    },
    render: function () {
        this.stopLoading()
        this.$el.html(template({
            lang: lang,
            name: lang.modes[this.settings.get('mode')],
            temperature: this.settings.get('temperature')
        }))
        this.$mode = this.$('.js-mode')
        this.$temperature = this.$('.js-temperature')
        this.$temperatures = this.$('.js-temperatures')
        this.$beer = this.$('.js-beer')
        this.$beerName = this.$('.js-beer-name')
        this.$startBeer = this.$('.js-start-beer')
        this.$pauseBeer = this.$('.js-pause-beer')
        this.$resumeBeer = this.$('.js-resume-beer')
        this.$stopBeer = this.$('.js-stop-beer')
        return this
    },
    renderMode: function () {
        this.$mode.text(lang.modes[this.settings.get('mode')])
        return this
    },
    renderTemperature: function () {
        if(this.settings.get('mode') === 'off') {
            this.$temperatures.addClass('hidden')
        }
        else {
            this.$temperatures.removeClass('hidden')
            this.$temperature.html('<b>' + this.settings.get('temperature') + '</b>' + lang.degree_symbol)
        }
        return this
    },
    renderBeer: function () {
        this.$beer.removeClass('hidden')
        this.$beerName.val(this.beer.has('name') ? this.beer.get('name') : '')
        if(this.beer.isNew()) {
            this.$beerName.removeAttr('disabled')
            this.$pauseBeer.addClass('hidden')
            this.$stopBeer.addClass('hidden')
            this.$resumeBeer.addClass('hidden')
            this.$startBeer.removeClass('hidden')
        }
        else {
            this.$beerName.attr('disabled', 'disabled')
            this.$startBeer.addClass('hidden')
            this.$stopBeer.removeClass('hidden')
            if(this.beer.get('paused')) {
                this.$pauseBeer.addClass('hidden')
                this.$resumeBeer.removeClass('hidden')
            }
            else {
                this.$resumeBeer.addClass('hidden')
                this.$pauseBeer.removeClass('hidden')
            }
        }
        return this
    },
    startBeer: function (e) {
        e.preventDefault()
        this.beer.save(
            {
                name: this.$beerName.val(),
                active: true
            },
            {
                wait: true,
                error: this.renderError
            }
        )
    },
    pauseBeer: function (e) {
        e.preventDefault()
        this.beer.save(
            {
                paused: true
            },
            {
                wait: true,
                error: this.renderError
            }
        )
    },
    resumeBeer: function (e) {
        e.preventDefault()
        this.beer.save(
            {
                paused: false
            },
            {
                wait: true,
                error: this.renderError
            }
        )
    },
    stopBeer: function (e) {
        e.preventDefault()
        var self = this
        this.beer.save(
            {
                active: false
            },
            {
                wait: true,
                success: function () {
                    self.initBeer()
                },
                error: this.renderError
            }
        )
    },
    changeTemperature: function () {
        this.mode(this.settings.get('mode'), this.settings.get('temperature'))
    },
    modeBeer: function (e) {
        e.preventDefault()
        this.mode('beer', this.settings.get('temperature'))
    },
    modeFridge: function (e) {
        e.preventDefault()
        this.mode('fridge', this.settings.get('temperature'))
    },
    mode: function (mode, temperature) {
        var view = new ModeView({
            mode: mode,
            temperature: temperature,
            name: lang.modes[mode]
        })
        this.listenToOnce(view, 'error', this.renderError)
        var self = this
        this.listenTo(view, 'save', function (temperature, options) {
            self.save(
                {
                    mode: mode,
                    temperature: temperature
                },
                options
            )
        })
    },
    modeOff: function (e) {
        e.preventDefault()
        this.save({
            mode: 'off'
        })
    },
    save: function (attributes, options) {
        var self = this
        this.settings.save(
            attributes,
            {
                wait: true,
                success: function () {
                    if(options && options.success)
                        options.success()
                },
                error: function(model, jqXHR) {
                    if(options && options.error)
                        options.error()

                    self.renderError(jqXHR)
                }
            }
        )
    }
})
