var View = require('./view'),
    _ = require('underscore'),
    async = require('async'),
    lang = require('../lang'),
    template = require('../templates/variables.hbs'),
    VariablesModel = require('../models/variables'),
    ConstantsModel = require('../models/constants'),
    SettingsModel= require('../models/settings')

module.exports = View.extend({
    initialize: function () {
        _.bindAll(this, 'render')
        this.renderLoading()
        this.variables = new VariablesModel()
        this.constants = new ConstantsModel()
        this.settings = new SettingsModel()

        var self = this
        async.parallel(
            [
                function (callback) {
                    self.variables.fetch({
                        success: function () {
                            callback()
                        },
                        error: function () {
                            callback(new Error())
                        }
                    })
                },
                function (callback) {
                    self.constants.fetch({
                        success: function () {
                            callback()
                        },
                        error: function () {
                            callback(new Error())
                        }
                    })
                },
                function (callback) {
                    self.settings.fetch({
                        success: function () {
                            callback()
                        },
                        error: function () {
                            callback(new Error())
                        }
                    })
                }
            ],
            this.render
        )
    },
    render: function (err) {
        this.stopLoading()
        if(err)
            return this.renderError()

        var params = _.extend(
            { lang: lang },
            this.variables.toJSON(),
            this.constants.toJSON(),
            this.settings.toJSON()
        )

        params.pid = (params.p + params.i + params.d).toFixed(3)
        params.beerSetting = this.settings.get('mode') === 'beer' ? this.settings.get('temperature') : '-'
        params.fridgeSetting = params.beerSetting !== '-' ? (params.beerSetting + (params.p + params.i + params.d)).toFixed(2) : '-'

        this.$el.html(template(params))
    }
})
