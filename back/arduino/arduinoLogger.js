var db = require('../database'),
    arduino = require('./arduino'),
    nconf = require('nconf'),
    logger = require('../logger')

if(nconf.get('logTemperatures')) {
    setTimeout(function () {
        setInterval(log, nconf.get('logTemperaturesInterval')*1000)
    }, 5000)
}

function log() {
    logger.debug('arduinoLog')

    db.Beer.find({ where: { active: true } })
        .error(function (err) {
            logger.error(err)
        })
        .success(function (beer) {
            arduino.request(arduino.help.commands.data, function (err, data) {
                logger.debug('arduinoLog answer', data)
                if(err) return logger.error(err)

                db.Temperature.create({
                    timestamp: Date.now(),
                    beerTemperature: data.beerTemperature || null,
                    fridgeTemperature: data.fridgeTemperature || null,
                    roomTemperature: data.roomTemperature || null,
                    beerId: beer ? beer.id : undefined
                })
            })
        })
}
