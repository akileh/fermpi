var app = require('../../app'),
    arduino = require('../arduino')

app.get('/api/version', function (req, res, next) {
    arduino.request(arduino.help.commands.version, function (err, data) {
        if(err) return next(err)
        res.json(data)
    })
})
