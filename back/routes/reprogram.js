var app = require('../../app'),
    arduino = require('../arduino')

app.post('/reprogram', function (req, res, next) {
    arduino.reprogram(req.body.filename, function (err, data) {
        if(err) return next(err)
        res.json(data)
    })
})
