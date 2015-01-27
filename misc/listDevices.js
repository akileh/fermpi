var _ = require('underscore'),
    serialport = require('serialport'),
    SerialPort = serialport.SerialPort,
    findDevice = require(__dirname + '/../back/arduino/findDevice')

serialport.list(function (err, ports) {
    if(err) return callback(err)

    console.log(ports)

    var device
    _.each(ports, function (port) {
        if((port.manufacturer && port.manufacturer.match(/(arduino|ft232)/i)) || (port.pnpId && port.pnpId.match(/(arduino|ft232)/i)))
           device = port.comName
    })

    console.log('')
    if(!device)
        console.log(new Error('device not found'))
    else
        console.log(device)
})
