var app = require('../../app'),
    db = require('../database')

app.get('/api/log', function (req, res, next) {
    var where = {
        timestamp: {
            gte: req.query.from,
            lte: req.query.to
        }
    }

    if(req.query.beer && req.query.beer !== '-1')
        where.beerId = req.query.beer

    db.Temperature
        .findAll({
            where: where,
            order: 'timestamp ASC'
        })
        .complete(function (err, data) {
            if(err) return next(err)
            res.json(data)
        })
})
