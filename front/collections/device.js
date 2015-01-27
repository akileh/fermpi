var Collection = require('./collection'),
    DeviceModel = require('../models/device')

module.exports = Collection.extend({
    baseUrl: '/api/device',
    model: DeviceModel
})
