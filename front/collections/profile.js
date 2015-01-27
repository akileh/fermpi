var Collection = require('./collection'),
    ProfileModel = require('../models/profile')

module.exports = Collection.extend({
    baseUrl: '/api/profile',
    model: ProfileModel
})
