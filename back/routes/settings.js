var app = require('../../app'),
    _ = require('underscore'),
    db = require('../database'),
    arduino = require('../arduino')

app.get('/api/settings', function (req, res, next) {
    arduino.request(arduino.help.commands.controlSettings, function (err, data) {
        if(err) return next(err)
        db.Beer.find({ where: {active: true }})
            .success(function (beer) {
                res.json(_.extend(
                    data,
                    {
                        beer: beer ? beer.toJSON() : {}
                    }
                ))
            })
    })
})

app.put('/api/settings', function (req, res, next) {
    var options = {
        mode: arduino.map.settings.mode[req.body.mode]
    }

    if(!options.mode)
        return next(new Error('invalid mode'))

    if(options.mode === 'b')
        options.beerSet = req.body.temperature
    else if(options.mode === 'f')
        options.fridgeSet = req.body.temperature

    arduino.request(
        arduino.help.commands.setParameters,
        options,
        function (err, settings) {
            if(err) return next(err)
            res.json(settings)
        }
    )
})
