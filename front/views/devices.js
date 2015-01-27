var Backbone = require('backbone'),
    View = require('./view'),
    DeviceCollection = require('../collections/device'),
    DeviceView = require('./device'),
    lang = require('../lang'),
    template = require('../templates/devices.hbs')

module.exports = View.extend({
    className: 'row',
    events: {
        'click .js-installed': 'showInstalled',
        'click .js-available': 'showAvailable'
    },
    initialize: function (options) {
        options = options || {}
        if(options.page === 'available')
            this.showAvailable()
        else
            this.showInstalled()
        return this
    },
    render: function () {
        this.stopLoading()
        this.$el.html(template({ lang: lang }))
        this.$installed = this.$('.js-installed')
        this.$available = this.$('.js-available')
        this.$devices = this.$('.js-devices')
    },
    showInstalled: function (e) {
        if(e) e.preventDefault()
        this.setActiveTab('installed')
    },
    showAvailable: function (e) {
        if(e) e.preventDefault()
        this.setActiveTab('available')
    },
    setActiveTab: function (tab) {
        this.renderLoading()

        var installed = tab === 'installed'
        Backbone.history.navigate('/devices/' + tab, {
            trigger: false,
            replace: true
        })

        this.devices = new DeviceCollection({}, {
            installed: installed,
            values: true
        })
        this.listenToOnce(this.devices, 'reset', function () {
            this.renderDevices(installed)
        })
        this.listenToOnce(this.devices, 'error', this.renderError)
        this.devices.fetch({ reset: true })
    },
    renderDevices: function (installed) {
        this.render()
        this.$installed.toggleClass('active', installed)
        this.$available.toggleClass('active', !installed)

        if(this.devices.length === 0) {
            this.$devices.html('<h2 class="text-center">' + (installed ? lang.no_installed_devices : lang.no_available_devices) + '</h2>')
        }
        else {
            var fragment = document.createDocumentFragment()
            this.devices.each(function (device) {
                var view = new DeviceView({
                    device: device,
                    installed: installed
                })
                fragment.appendChild(view.el)
            })
            this.$devices.html(fragment)
        }
    }
})
