var _ = require('underscore'),
    serialport = require('serialport')

module.exports = function (callback) {
    serialport.list(function (err, ports) {
        if(err) return callback(err)

        var device
        _.each(ports, function (port) {
            if((port.manufacturer && port.manufacturer.match(/(arduino|ft232)/i)) || (port.pnpId && port.pnpId.match(/(arduino|ft232)/i)))
               device = port.comName
        })
        if(!device)
            callback(new Error('device not found'))
        else
            callback(null, device)
    })
}
