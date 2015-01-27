var app = require('../../app'),
    arduino = require('../arduino')

app.get('/api/lcd', function (req, res, next) {
    arduino.request(arduino.help.commands.lcd, function (err, data) {
        if(err) return next(err)
        res.json(data)
    })
})

