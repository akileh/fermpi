var server = require('../app').server,
    _ = require('underscore'),
    io = require('socket.io').listen(server),
    db = require('./database'),
    sio = require('socket.io'),
    arduino = require('./arduino'),
    logger = require('./logger')

var interval = 3000

var io = sio(server, {
    serveClient: false
});

var lastStatus,
    lastStatusTime

setInterval(function () {
    getStatus(function (err, status) {
        if(err) return logger.error(err)
        io.sockets.emit('status', status)
    })
}, interval)

io.on('connection', function (socket) {
    if(lastStatus && Date.now()-lastStatusTime < 2*interval)
        socket.emit('status', lastStatus)
})

function getStatus(callback) {
    arduino.request(arduino.help.commands.data, function (err, tempData) {
        if(err) return callback(err)
        arduino.request(arduino.help.commands.controlSettings, function (err, settingsData) {
            if(err) return callback(err)
            arduino.request(arduino.help.commands.lcd, function (err, lcdData) {
                if(err) return callback(err)
                db.Beer
                    .find({ where: {active: true }})
                    .success(function (beer) {
                        var status = _.extend(
                            tempData,
                            settingsData,
                            lcdData,
                            {
                                beerName: beer ? beer.name : null
                            }
                        )
                        lastStatus = status
                        lastStatus = Date.now()
                        callback(null, status)
                    })
            })
        })
    })
}
