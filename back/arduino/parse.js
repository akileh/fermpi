var _ = require('underscore'),
    arduino = require('./arduino'),
    help = require('./help'),
    map = require('./map'),
    pins = require('./pins')

// data
module.exports.T = function (data, callback) {
    var parsed = {}
    _.each(data, function (value, key) {
        if(map.data[key])
            parsed[map.data[key]] = value
    })

    callback(null, parsed)
}

// controlSettings
module.exports.S = function (data, callback) {
    var parsed = {
        mode: map.settings.mode[data.mode]
    }
    if(parsed.mode === 'beer')
        parsed.temperature = data.beerSet
    else if(parsed.mode === 'fridge')
        parsed.temperature = data.fridgeSet
    else
        parsed.temperature = null

    parsed.coolEst = data.coolEst
    parsed.heatEst = data.heatEst

    callback(null, parsed)
}

// lcd
module.exports.L = function (data, callback) {
    var state = (Array.isArray(data) && data.length > 3) ? data[3] : null,
        timeMatch = state.match(/([0-9].*)/),
        time = timeMatch && timeMatch[1] ? timeMatch[1].replace(/h([0-9])/, 'h $1').replace(/m([0-9])/, 'm $1') + 's' : null,
        rawState = state

    if(state.match(/idling/i))
        state = 'idling'
    else if(state.match(/cooling/i))
        state = 'cooling'
    else if(state.match(/door\sopen/i))
        state = 'doorOpen'
    else if(state.match(/wait\sto\scool/i))
        state = 'waitToCool'
    else
        state = 'unknown'

    callback(null, {
        state: state,
        time: time,
        rawState: rawState
    })
}

// version
module.exports.N = function (data, callback) {
    callback(null, {
        version: data.v,
        build: data.n,
        simulator: data.y,
        board: map.version.boards[data.b],
        shield: map.version.shields[data.s],
        log: data.l,
        commit: data.c
    })
}

module.exports.d = devices
module.exports.h = devices
module.exports.U = devices
module.exports.devices = devices
function devices(data, callback) {
    arduino.request(help.commands.version, function (err, version) {
        if(err) return 
        var single
        if(!Array.isArray(data)) {
            single = true
            data = [data]
        }

        // sort temperature sensors to top
        data = _.sortBy(data, function (d) {
            return arduino.map.device.h.values[d.h]
        }).reverse()

        var devices =  _.map(data, function (device) {
            var parsed = {}
            _.each(device, function (value, key) {
                if(!map.device[key])
                    return

                parsed[map.device[key].name] = map.device[key].values ? map.device[key].values[value] : value
            })
            if(version && parsed.pin) {
                parsed.pinName = pins[version.board][version.shield][parsed.pin].text
                parsed.pinType = pins[version.board][version.shield][parsed.pin].type
                parsed.funcs = getFuncs(parsed.pinType, parsed.hardwareType)
            }
            return parsed
        })

        if(single) {
            callback(null, devices.length > 0 ? devices[0] : null)
        }
        else {
            callback(null, devices)
        }
    })
}

function getFuncs(pinType, hardwareType) {
    var actuatorFuncs = ['none', 'heater', 'cooler', 'light', 'fan'],
        doorFuncs = _.union(actuatorFuncs, ['door']),
        temperatureFuncs = ['none', 'fridgeTemperature', 'roomTemperature', 'beerTemperature']

    switch(pinType) {
        case 'act':
            return actuatorFuncs
        case 'free':
        case 'door':
            return doorFuncs
        case 'onewire':
            return (hardwareType === 'DS2413') ? actuatorFuncs : temperatureFuncs
        default:
            return []
    }
}
