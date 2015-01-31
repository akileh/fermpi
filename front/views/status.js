var Backbone = require('backbone'),
    _ = require('underscore'),
    lang = require('../lang'),
    template = require('../templates/status.hbs'),
    LoadingView = require('./loading'),
    lang = require('../lang'),
    io = require('socket.io-client')

module.exports = Backbone.View.extend({
    className: 'row',
    initialize: function () {
        _.bindAll(this, 'connecting', 'disconnected', 'connected', 'error', 'renderStatus')
        this.render()
        this.initUpdates()
    },
    render: function () {
        this.$el.html(template({ lang: lang }))
        this.$data = this.$('.js-data')
        this.$beer = this.$('.js-beer')
        this.$fridge = this.$('.js-fridge')
        this.$room = this.$('.js-room')
        this.$connectionStatus = this.$('.alert')
        this.$name = this.$('.js-name')
        this.$mode = this.$('.js-mode')
        this.$status = this.$('.js-status')
        this.$loading = this.$('.js-loading')
        this.loading = new LoadingView()
        this.$loading.html(this.loading.start().el)
    },
    initUpdates: function () {
        this.socket = io(window.location.protocol + '//' + window.location.host, { forceNew: true })
        var self = this
        this.socket.on('connect', function () {
            self.connected()
            self.socket.on('reconnect', self.connected)
            self.socket.on('connect_error', self.disconnected)
            self.socket.on('connect_failed', self.disconnected)
            self.socket.on('reconnect_failed', self.disconnected)
            self.socket.on('connect_timeout', self.disconnected)
            self.socket.on('disconnect', self.disconnected)
            self.socket.on('connecting', self.connecting)
            self.socket.removeListener('status').on('status', self.renderStatus)
            self.socket.removeListener('error').on('error', self.error)
        })
    },
    connecting: function () {
        this.setConnectionStatus('connecting')
    },
    disconnected: function () {
        this.setConnectionStatus('disconnected')
    },
    connected: function () {
        this.setConnectionStatus('connected')
    },
    error: function () {
        this.setConnectionStatus('error')
    },
    setConnectionStatus: function (connectionStatus, data) {
        this.$connectionStatus.text(lang.connectionStatus[connectionStatus])
        switch(connectionStatus) {
            case 'connecting':
                this.$connectionStatus.attr('class', 'alert alert-warning')
                break
            case 'connected':
                this.$connectionStatus.attr('class', 'alert alert-success')
                break
            case 'disconnected':
                this.$connectionStatus.attr('class', 'alert alert-danger')
                break
            case 'error':
                this.$connectionStatus.attr('class', 'alert alert-danger')
                break
        }

        if(connectionStatus !== 'connected') {
            this.$data.addClass('hidden')
            this.loading.start()
            this.$loading.removeClass('hidden')
        }
    },
    renderStatus: function (data) {
        this.loading.stop()
        this.$loading.addClass('hidden')
        this.$data.removeClass('hidden')
        this.$beer.text(data.beerTemperature || '-')
        this.$fridge.text(data.fridgeTemperature || '-')
        this.$room.text(data.roomTemperature || '-')

        var mode = lang.modes[data.mode]
        if(data.mode !== 'off')
            mode += ': ' + data.temperature + lang.degree_symbol
        this.$mode.text(mode)
        this.$name.text(data.beerName || '-')
        var status = lang.statusTypes[data.state]
        if(data.time)
           status += data.time
        this.$status.text(status)
    },
    remove: function () {
        if(this.socket)
            this.socket.disconnect()
        Backbone.View.prototype.remove.call(this)
    }
})
