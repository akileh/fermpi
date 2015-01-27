var app = require('../../app'),
    async = require('async'),
    _ = require('underscore'),
    arduino = require('../arduino')

app.get('/api/device', function (req, res, next) {
    var command,
        options

    if(req.query.installed && req.query.installed !== 'false') {
        command = arduino.help.commands.installedDevices
        if(req.query.values)
            options = {r:1}
        else
            options = {}
    }
    else {
        command = arduino.help.commands.availableDevices
        if(req.query.values)
            options = {u:-1,v:1}
        else 
            options = {u:-1}
    }

    arduino.request(command, options, function (err, devices) {
        if(err) return next(err)
        res.json(devices)
    })
})

app.put('/api/device', function (req, res, next) {
    var options = {
        slot: req.body.slot,
        // chamber is always one
        chamber: 1,
        // beer is only one for beer temperature sensor
        beer: req.body.func === 'beerTemperature' ? 1 : 0,
        func: req.body.func,
        hardwareType: req.body.hardwareType,
        pin: req.body.pin,
        address: req.body.address
    }

    async.series(
        [
            function (callback) {
                if(req.body.slot !== -1)
                    callback()
                else
                    findAvailableSlot(function (err, slot) {
                        if(err) return callback(err)
                        if(typeof slot === 'undefined') return callback(new Error('available slot not found'))
                        options.slot = slot
                        callback()
                    })
            },
            function (callback) {
                updateDevice(options, callback)
            }
        ],
        function (err, result) {
            if(err) return next(err)
            res.json(result)
        }
    )
})

function findAvailableSlot(callback) {
    arduino.request(arduino.help.commands.installedDevices, {}, function (err, data) {
        if(err) return callback(err)
        var reserved = _.pluck(data, 'slot')

        for(var i=0; i<data.length+1; i++) {
            if(!_.contains(reserved, i))
                return callback(null, i)
        }

        callback()
    })
}

function updateDevice(options, callback) {
    arduino.parse.devices(options, function (err, devices) {
        arduino.request(arduino.help.commands.applyDevice, devices, function (err, data) {
            if(err) return callback(err)
            callback(null, data)
        })
    })
}
