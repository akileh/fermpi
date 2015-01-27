var async = require('async'),
    logger = require('../logger'),
    serialport = require('serialport'),
    SerialPort = serialport.SerialPort,
    findDevice = require('./findDevice'),
    nconf = require('nconf')

serialport.on('error', error)

var sp,
    portOpen = false,
    connecting,
    confDevice = nconf.get('device')

process.on('message', function (message) {
    if(message.command === 'request' && portOpen) {
        logger.debug('writing: ' + message.data)
        sp.write(message.data)
    }
    else if(message.command === 'connect') {
        connect()
    }
    else if(message.command === 'exit') {
        process.exit(0)
    }
})

function connect() {
    if(portOpen)
        return

    var device
    async.series(
        [
            function (callback) {
                if(confDevice !== 'auto') {
                    device = confDevice
                    callback()
                }
                else {
                    findDevice(function (err, foundDevice) {
                        if(err) return callback(err)
                        device = foundDevice
                        callback()
                    })
                }
            },
            function (callback) {
                callback()
                if(connecting)
                    return

                if(sp && sp.close) {
                    try {
                        logger.debug('closing old connection')
                        sp.close()
                    } catch(e) {
                        logger.error(e)
                    }
                }

                logger.debug('connecting to arduino ' + device + '...')
                connecting = true
                sp = new SerialPort(device, {
                    baudrate: 57600,
                    parser: serialport.parsers.readline("\n")
                })
                sp.on('open', function (err) {
                    if(err)
                        return error(err)

                    setTimeout(function () {
                        send({ type: 'status', connected: true })
                    }, 5000)

                    portOpen = true
                    sp.on('data', function (data) {
                        logger.debug('data!')
                        parseData(data, dataCallback)
                    })
                    sp.on('error', error)
                })
            }
        ],
        function (err) {
            if(err) {
                logger.error(err)
                setTimeout(connect, 3000)
            }
        }
    )
}

function parseData(data, callback) {
    var err,
        json
    try {
        json = JSON.parse(data.substr(2, data.length-2))
    }
    catch (e) {
        err = e
        logger.error('error parsing json, message was: ' + data.substr(0, 2) + '\n' + 'data was:\n' + data.substr(2, data.length-2).toString())
    }

    if(!err)
        callback(null, json, data.substr(0, 1))
}

function dataCallback(err, data, messageType) {
    if(err) {
        logger.error(err)
        error(err)
    }
    else {
        send({
            type: 'data',
            err: err,
            data: data,
            messageType: messageType
        })
    }
}

function send(args) {
    try {
        process.send(args)
    }
    catch(e) {
        logger.error(e)
    }
}

function error(err) {
    send({ type: 'status', connected: false })
    logger.debug('arduino error')
    portOpen = false
    connecting = false
    logger.error(err)
    // try to connect randomly between 1 to 3 seconds
    setTimeout(connect, parseInt((Math.random()*1+2)*1000, 10))
    send({ type: 'bouncer' })
}
