var Backbone = require('backbone'),
    $ = require('jquery'),
    NavView = require('./views/nav'),
    StatusView = require('./views/status'),
    SettingsView = require('./views/settings'),
    DevicesView = require('./views/devices'),
    ProfilesView = require('./views/profiles'),
    NewProfileView = require('./views/newProfile'),
    ChartView = require('./views/chart'),
    ConstantsView = require('./views/constants'),
    VariablesView= require('./views/variables'),
    ArduinoView = require('./views/arduino')

module.exports = Backbone.Router.extend({
    routes: {
        '': 'status',
        'status': 'status',
        'settings': 'settings',
        'devices': 'devices',
        'devices/:page': 'devices',
        'profiles': 'profiles',
        'profile/:id': 'profile',
        'new-profile': 'newProfile',
        'chart': 'chart',
        'chart/:from/:to': 'chart',
        'advanced': 'advanced',
        'algorithm': 'algorithm',
        'arduino': 'arduino',
        '*notFound': 'error'
    },
    initialize: function () {
        this.$container = $('.container')
        Backbone.history.start({ pushState: true })
    },
    status: function () {
        this.render(new StatusView())
    },
    settings: function () {
        this.render(new SettingsView())
    },
    devices: function (page) {
        this.render(new DevicesView({ page: page }))
    },
    profiles: function () {
        this.render(new ProfilesView())
    },
    profile: function (id) {
        this.render(new NewProfileView({ id: id }))
    },
    newProfile: function () {
        this.render(new NewProfileView())
    },
    chart: function (from, to) {
        this.render(new ChartView({
            from: from,
            to: to
        }))
    },
    advanced: function () {
        this.render(new ConstantsView())
    },
    algorithm: function () {
        this.render(new VariablesView())
    },
    arduino: function () {
        this.render(new ArduinoView())
    },
    error: function () {
        this.render('<h2>404</h4>')
    },
    render: function (view) {
        if(!this.navRendered) {
            this.navRendered = true
            $('body').prepend(new NavView({ router: this }).$el)
        }

        if(this.view && this.view.remove)
            this.view.remove()

        this.view = view
        this.$container.html(view.$el ? view.$el : view)
    }
})

