var app = require('../../app'),
    path = require('path'),
    fs = require('fs')

app.post('/upload', function (req, res, next) {
    var file = req.files['files[]']
    console.log(file)
    if(!file)
        return next(new Error('no file found'))

    res.send({ filename: file.name })
})
