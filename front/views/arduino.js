var View = require('./view'),
    $ = require('jquery'),
    _ = require('underscore'),
    lang = require('../lang'),
    template = require('../templates/arduino.hbs'),
    VersionModel = require('../models/version'),
    ErrorView = require('./error')

require('jquery-file-upload')

module.exports = View.extend({
    className: 'row',
    events: {
        'click .js-upload': 'upload',
        'click .js-file': 'file',
        'click .js-cancel': 'cancel',
        'click .js-reprogram': 'reprogram'
    },
    initialize: function () {
        _.bindAll(this, 'renderUpload', 'renderReprogram')
        this.renderLoading()
        this.version = new VersionModel()
        this.listenTo(this.version, 'sync', this.render)
        this.listenTo(this.version, 'error', this.renderArduinoError)
        this.version.fetch()
    },
    render: function () {
        this.stopLoading()
        this.$el.html(template({
            lang: lang,
            version: this.version.toJSON()
        }))
        this.$uploadContainer = this.$('.js-upload-container')
        this.$reprogramContainer = this.$('.js-reprogram-container')
        this.$file = this.$('.js-file')
        this.$filename = this.$('.js-filename')
        this.$upload = this.$('.js-upload')
        this.renderUpload()
    },
    upload: function (e) {
        this.$file.click()
    },
    renderUpload: function () {
        this.$reprogramContainer.addClass('hidden')
        this.$uploadContainer.removeClass('hidden')
        var self = this
        this.$file.fileupload({
            dataType: 'json',
            url: '/upload',
            replaceFileInput: false,
            done: function (e, data) {
                self.reprogram(data.files[0].name)
                self.$file.val('')
                //self.renderReprogram(data.files[0].name)
            }
        })
    },
    renderReprogram: function (filename) {
        //this.$upload.addClass('disabled')
        this.$reprogramContainer.removeClass('hidden')
        this.$filename.text(filename)
        this.filename = filename
    },
    cancel: function (e) {
        e.preventDefault()
    },
    reprogram: function (filename) {
        var self = this
        $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: '/reprogram',
            data: JSON.stringify({ filename: filename }),
            dataType: 'json',
            success: function () {
                // TODO notify success and reload window or fix jquery-file-upload button rerender...
                self.renderUpload()
            },
            error: function () {
                window.alert('error reprogrammin arduino')
                self.renderUpload()
            }
        })
    },
    renderArduinoError: function (resp, jqXHR) {
        this.render()
        this.$('.js-arduino').addClass('hidden')
        this.$('.js-error').removeClass('hidden').html(new ErrorView({ jqXHR: jqXHR }).$el)
    }
})
