var View = require('./view'),
    _ = require('underscore'),
    ConstantsModel = require('../models/constants'),
    ConstantInputView = require('./constantInput'),
    ConstantDropdownView = require('./constantDropdown')

var dropdownItems = [
    'tempFormat',
    'beerFastFilt',
    'beerSlopeFilt',
    'beerSlopeFilt',
    'fridgeFastFilt',
    'fridgeSlowFilt',
    'fridgeSlopeFilt',
    'lah',
    'hs'
]

module.exports = View.extend({
    className: 'row',
    initialize: function (options) {
        this.renderLoading()
        this.constants = new ConstantsModel()
        this.listenTo(this.constants, 'sync', this.render)
        this.listenTo(this.constants, 'error', this.renderError)
        this.constants.fetch()
        return this
    },
    render: function () {
        this.stopLoading()
        this.$el.html('')
        var self = this

        var dropdownFragment = document.createDocumentFragment()
        _.each(dropdownItems, function (constant) {
            var view = new ConstantDropdownView({
                constants: self.constants,
                constant: constant
            })
            self.listenTo(view, 'save', self.save)
            dropdownFragment.appendChild(view.el)
        })
        this.$el.append(dropdownFragment)

        var inputFragment = document.createDocumentFragment()
        _.each(_.difference(_.keys(this.constants.toJSON()), dropdownItems), function (constant) {
            var view = new ConstantInputView({
                constants: self.constants,
                constant: constant
            })
            self.listenTo(view, 'save', self.save)
            inputFragment.appendChild(view.el)
        })
        this.$el.append(inputFragment)
    }
})
