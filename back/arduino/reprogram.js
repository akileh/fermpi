var async = require('async'),
    _ = require('underscore'),
    path = require('path'),
    arduino = require('./arduino'),
    serialport = require('serialport'),
    SerialPort = serialport.SerialPort,
    findDevice = require('./findDevice'),
    logger = require('../logger'),
    shell = require('shelljs'),
    nconf = require('nconf')

require('../configuration')

module.exports = function (filename, options, callback) {
    if(typeof options === 'function') {
        callback = options
        options = {}
    }

    options = _.extend({
        reconnect: true,
        silent: true
    }, options)

    if(!filename)
        return callback(new Error('missing filename'))

    var device
    async.series([
        function disconnect(callback) {
            arduino.disconnect(true, callback)
        },
        function findArduino(callback) {
            if(nconf.get('device') !== 'auto') {
                device = nconf.get('port')
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
        function reset(callback) {
            serialport.on('error', callback)
            var sp = new SerialPort(device, {
                baudrate: 1200,
                parser: serialport.parsers.readline("\n")
            })
            sp.on('open', function (err) {
                sp.on('error', callback)
                setTimeout(function () {
                    sp.close()
                    setTimeout(function () {
                        callback()
                    }, 2000)
                }, 1000)
            })
        },
        function reprogram(callback) {
            shell.exec(
                'avrdude -v -v -v -v -F -e -p atmega32u4 -c avr109 -P ' + device + ' -b 57600 -D -U flash:w:' + path.resolve(__dirname + '/../../upload/' + filename),
                {
                    silent: options.silent
                },
                function (code, output) {
                    if(!options.silent)
                        logger.debug({code: code, output: output })

                    setTimeout(function () {
                        callback(null, {code: code, output: output})
                    }, 3000)
                }
            )
        }
    ], function (err, results) {
        if(options.reconnect)
            arduino.forceConnect()

        callback(err, results[3])
    })
}
