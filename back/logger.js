var winston = require('winston'),
    nconf = require('nconf')

require('./configuration')
var logPath = __dirname + '/../log/'

var transports = [
    new winston.transports.File({
        name: 'file.error',
        level: 'error',
        filename: logPath + 'error'
    })
]

if(nconf.get('debug')) {
    transports.push(
        new winston.transports.File({
            name: 'file.debug',
            level: 'debug',
            filename: logPath + 'debug'
        })
    )
}

var logger = new (winston.Logger)({
    transports: transports
})

module.exports = {
    error: function (err) {
        console.error('\nerror: ' + (err.stack ? err.stack : err))
        logger.error(err.stack ? JSON.stringify(err.stack, null, 4) : err)
    },
    info: function (msg) {
        console.info('info: ' + msg)
        logger.info.apply(this, arguments)
    },
    debug: function (msg) {
        if(nconf.get('debug')) {
            console.info('debug: ' + msg)
            logger.debug.apply(this, arguments)
        }
    }
}
