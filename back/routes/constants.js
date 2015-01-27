var app = require('../../app'),
    _ = require('underscore'),
    arduino = require('../arduino')

app.get('/api/constants', function (req, res, next) {
    arduino.request(arduino.help.commands.controlConstants, function (err, data) {
        if(err) return next(err)
        res.json(data)
    })
})

// TODO arduino crashes if all values are changed at the same time
app.put('/api/constants', function (req, res, next) {
    var constants = _.pick(req.body, arduino.map.controlConstants)

    arduino.request(arduino.help.commands.controlConstants, function (err, data) {
        if(err) return next(err)
        arduino.request(arduino.help.commands.setParameters, getChangedConstants(data, constants), function (err, data) {
            arduino.request(arduino.help.commands.controlConstants, function (err, data) {
                res.json(data)
            })
        })
    })
})

function getChangedConstants(oldConstants, newConstants) {
    var constants = {}
    _.each(newConstants, function (value, key) {
        if(oldConstants[key] !== value)
            constants[key] = value
    })

    return constants
}
