var Collection = require('./collection'),
    BeerModel = require('../models/beer')

module.exports = Collection.extend({
    baseUrl: '/api/beer',
    model: BeerModel
})
