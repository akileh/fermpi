var app = require('../../app'),
    arduino = require('../arduino')

app.get('/api/variables', function (req, res, next) {
    arduino.request(arduino.help.commands.controlVariables, function (err, data) {
        if(err) return next(err)
        res.json(data)
    })
})
