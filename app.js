var express = require('express'),
    compression = require('compression'),
    app = module.exports = express(),
    server = app.server = require('http').createServer(app),
    multer = require('multer'),
    bodyParser = require('body-parser'),
    basicAuth = require('basic-auth'),
    nconf = require('nconf'),
    logger = require('./back/logger'),
    ArduinoError = require('./back/arduino').error

require('./back/configuration')
require('./back/database')

// cachebust rewrite
app.use(function (req, res, next) {
    var match = req.url.match(/\.([a-z0-9]{16}\.)(js|css)/)
    if(match && match[1])
        req.url = req.url.replace(match[1], '')

    next()
})

// basic auth
var auth = nconf.get('auth')
if(auth && auth.enabled) {
    app.use(function (req, res, next) {
        res.header('WWW-Authenticate', 'Basic realm=' + nconf.get('name'))
        var authResp = basicAuth(req)
        if(authResp && authResp.name === auth.name && authResp.pass === auth.pass)
            return next()
        else
            res.send(401)
    })
}

app.use(compression({
    level: 1
}))
app.use(multer({
    dest: __dirname + '/upload',
    rename: function (fieldname, filename) {
        return filename
    },
    limits: {
        fields: 1,
        files: 1
    }
}))
app.use(express.static(__dirname + '/public', { maxAge: 2678400000 }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// kill child on exit/restart
var arduino = require('./back/arduino')
process.once('SIGUSR2', killChild)
process.on('exit', killChild)
process.on('SIGINT', killChild)
process.on('SIGTERM', killChild)

process.once('uncaughtException', function (err) {
    logger.error(err)
    killChild()
})

function killChild() {
    arduino.disconnect(function () {
        process.kill(process.pid, 'SIGUSR2')
    })
}

require(__dirname + '/back/routes')
require('./back/socketio')
require('./back/arduino/arduinoLogger')
var logger = require('./back/logger')

app.use(function(err, req, res, next){
    logger.error(err)
    if(err instanceof ArduinoError)
        res.status(500).json({ error: 'arduino', stack: err.stack })
    else
        res.status(500).json({ message: err, stack: err.stack })
})

server.listen(nconf.get('port'))
