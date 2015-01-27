var _ = require('underscore'),
    arduino = require('./arduino'),
    map = require('./map'),
    parse = require('./parse'),
    help = require('./help'),
    reprogram = require('./reprogram')

module.exports = _.extend(arduino, {
    map: map,
    parse: parse,
    help: help,
    reprogram: reprogram
})
