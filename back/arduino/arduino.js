var logger = require('../logger'),
    help = require('./help'),
    fork = require('child_process').fork,
    parse = require('./parse')

function ArduinoError(message) {
    this.name = 'ArduinoError'
    this.message = message || "arduino error"
    this.status = 500
    Error.apply(this, arguments)
    Error.captureStackTrace(this, this.constructor)
}
ArduinoError.prototype = new Error()
ArduinoError.prototype.constructor = ArduinoError
exports.error = ArduinoError

module.exports.forceConnect = forceConnect
function forceConnect() {
    logger.debug('forceConnect')
    blocked = false
    connect()
}

var serial,
    arduinoConnected = false

function connect() {
    logger.debug('connect')

    if(blocked)
        return logger.debug('blocked, not connecting')

    if(!serial || !serial.connected) {
        serial = fork(__dirname + '/arduinoProcess')

        serial.on('error', function (err) {
            logger.error(err)
        })
        serial.on('exit', function () {
            logger.debug('child exited')
            if(!blocked)
                connect()
        })
        serial.on('message', callback)
        setTimeout(function () {
            send({ command: 'connect' })
        }, 500)
    }
}
module.exports.connect = connect
connect()

var blocked = false
module.exports.disconnect = disconnect
function disconnect(block, callback) {
    logger.debug('disconnect')

    if(typeof block === 'function') {
        callback = block
        block = false
    }

    if(block)
        blocked = true

    arduinoConnected = false
    if(serial)
        send({ command: 'exit' })
    setTimeout(function () {
        if(serial) {
            logger.debug('child still alive, killing...')
            serial.kill()
            serial = null
        }

        if(callback) callback()
    }, 1000)
}

var queue = []
module.exports.request = function request(messageType, data, callback) {
    if(typeof data === 'function') {
        callback = data
        data = null
    }

    if(!arduinoConnected)
        return callback(new ArduinoError('not connected to arduino'))

    logger.debug('requesting: ' + (messageType + (data ? JSON.stringify(data) : '')))

    queue.push({
        messageType: messageType,
        data: data,
        callback: callback,
        timestamp: Date.now()
    })

    bouncer()
}

var waiting = false
function bouncer() {
    logger.debug('bouncer')
    if(queue.length > 0 && !waiting) {
        logger.debug('bouncer write, queue.length = ' + queue.length)
        waiting = true
        var message = queue[0]
        clearFailTimeout()
        setFailTimeout()
        send({
            command: 'request',
            data: message.messageType + (message.data ? JSON.stringify(message.data) : '')
        })
    }
    else if(queue.length > 0) {
        setFailTimeout()
        logger.debug('waiting in queue (size = ' + queue.length + ')')
    }
    else {
        logger.debug('queue empty')
    }
}

function callback(message) {
    if(message.err) {
        logger.error(message.err)
    }
    else if(message.type === 'status') {
        arduinoConnected = message.connected
        logger.debug('status.connected = ' + message.connected)
    }
    else if(message.type === 'bouncer') {
        bouncer()
    }
    else if(message.type === 'error') {
        logger.error(message.err)
    }
    else if(message.type === 'data') {
        logger.debug('callback, queue size = ' + queue.length + ', messageType = ' + message.messageType)
        waiting = false
        for(var index=0; index<queue.length; index++) {
            var request = queue[index]
            if(help.answers[request.messageType] === message.messageType) {
                logger.debug('found item in queue to answer to\n---')
                queue.splice(index, 1)
                if(message.err) {
                    request.callback(new ArduinoError(message.err))
                }
                else {
                    if(parse[message.messageType])
                        parse[message.messageType](message.data, request.callback)
                    else
                        request.callback(null, message.data)
                }
                bouncer()
                break
            }
        }
        logger.debug('callback ended, queue size = ' + queue.length)
    }
    else {
        logger.debug('unknown message from arduinoProcess', message)
    }
}

// clear request older than three secods every second
setInterval(function () {
    var toRemove = []
    for(var i=0; i < queue.length; i++) {
        if(queue[i].timestamp < Date.now() - 3000)
            toRemove.push(i)
    }
    // reverse to not fuck up the array while removing from it
    toRemove.reverse().forEach(function (i) {
        logger.debug('removing request ' + i)
        queue[i].callback(new ArduinoError('timeout error'))
        queue.splice(i, 1)
    })
}, 1000)

// fail all messages after n seconds if no answer
var failTimeout
function setFailTimeout() {
    if(failTimeout)
        return

    logger.debug('setFailTimeout')
    failTimeout = setTimeout(function () {
        logger.debug('failTimeout')
        failTimeout = null
        waiting = false
        disconnect(connect)
    }, 15000)
}

function clearFailTimeout() {
    logger.debug('clearFailtimeout')
    clearTimeout(failTimeout)
    failTimeout = null
}

function send(message) {
    if(serial && serial.connected)
        serial.send(message)
}
