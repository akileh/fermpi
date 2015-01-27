var app = require('../../app'),
    async = require('async'),
    db = require('../database')

app.get('/api/beer', function (req, res, next) {
    db.Beer.findAll()
        .error(next)
        .success(function (beers) {
            res.json(beers)
        })
})

app.post('/api/beer', function (req, res, next) {
    db.Beer.create({
            name: req.body.name,
            active: true
        })
        .error(next)
        .success(function (beer) {
            res.json(beer)
        })
})

app.put('/api/beer', function (req, res, next) {
    async.auto(
        {
            findBeer: function (callback) {
                db.Beer.find(req.body.id)
                    .error(callback)
                    .success(function (beer) {
                        if(!beer)
                            return callback(new Error('beer not found'))
                        callback(null, beer)
                    })
            },
            updateOtherBeers: ['findBeer', function (callback, results) {
                // if changing from inactive to active, deactivate all other beers
                if(!results.findBeer.active && req.body.active) {
                    db.Beer
                        .update(
                            { active: false },
                            ['id != ' + req.body.id]
                        )
                        .error(callback)
                        .success(function () {
                            callback()
                        })
                }
                else {
                    callback()
                }
            }],
            updateBeer: ['findBeer', function (callback, results) {
                results.findBeer
                    .updateAttributes( {
                        paused: req.body.paused,
                        active: req.body.active
                    })
                    .error(next)
                    .success(function (beer) {
                        callback(null, beer)
                    })
            }]
        },
        function (err, results) {
            if(err) return next(err)
            res.json(results.updateBeer)
        }
    )
})
