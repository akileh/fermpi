module.exports = {
    settings: {
        mode: {
            b: 'beer',
            f: 'fridge',
            o: 'off',
            // reverse
            beer: 'b',
            fridge: 'f',
            off: 'o',
        }
    },
    data: {
        beerSetting: 'BeerSet',
        beerTemperature: 'BeerTemp',
        fridgeSetting: 'FridgeSet',
        fridgeTemperature: 'FridgeTemp',
        roomTemperature: 'RoomTemp',
        // reverse
        BeerSet: 'beerSetting',
        BeerTemp: 'beerTemperature',
        FridgeSet: 'fridgeSetting',
        FridgeTemp: 'fridgeTemperature',
        RoomTemp: 'roomTemperature'
        // TODO BeerAdd, FridgeAdd
    },
    controlConstants: [
        'tempFormat',
        'tempSetMin',
        'tempSetMax',
        'pidMax',
        'Kp',
        'Ki',
        'Kd',
        'iMaxErr',
        'idleRangeH',
        'idleRangeL',
        'heatTargetH',
        'heatTargetL',
        'coolTargetH',
        'coolTargetL',
        'maxHeatTimeForEst',
        'maxCoolTimeForEst',
        'fridgeFastFilt',
        'fridgeSlowFilt',
        'fridgeSlopeFilt',
        'beerFastFilt',
        'beerSlowFilt',
        'beerSlopeFilt',
        'lah',
        'hs'
    ],
    version: {
        boards: {
            l: 'leonardo',
            s: 'standard',
            m: 'mega'
        },
        shields: {
            1: 'revA',
            2: 'revC'
        }
    },
    device: {
        i: {
            name: 'slot'
        },
        c: {
            name: 'chamber'
        },
        b: {
            name: 'beer'
        },
        h: {
            name: 'hardwareType',
            values: {
                0: 'none',
                1: 'digitalPin',
                2: 'temperatureSensor',
                3: 'DS2413'
            }
        },
        t: {
            name: 'type',
            values: { 
                0: 'none',
                1: 'temperature',
                2: 'switchSensor',
                3: 'switchActuator'
            }
        },
        x: {
            name: 'inverted',
            values: {
                0: 'uninverted',
                1: 'inverted'
            }
        },
        p: {
            name: 'pin'
        },
        a: {
            name: 'address'
        },
        v: {
            name: 'value'
        },
        f: {
            name: 'func',
            values: {
                0: 'none',
                1: 'door',
                2: 'heater',
                3: 'cooler',
                4: 'light',
                5: 'fridgeTemperature',
                6: 'roomTemperature',
                7: 'fan',
                9: 'beerTemperature'
            }
        },
        // reverse
        // TODO reverse programmatically
        slot: {
            name: 'i'
        },
        chamber: {
            name: 'c'
        },
        beer: {
            name: 'b'
        },
        hardwareType: {
            name: 'h',
            values: {
                none: 0,
                digitalPin: 1,
                temperatureSensor: 2,
                DS2413: 3
            }
        },
        type: {
            name: 't',
            values: { 
                none: 0,
                temperature: 1,
                switchSensor: 2,
                switchActuator: 3
            }
        },
        inverted: {
            name: 'x',
            values: {
                uninverted: 0,
                inverted: 1
            }
        },
        pin: {
            name: 'p'
        },
        address: {
            name: 'a'
        },
        value: {
            name: 'v'
        },
        func: {
            name: 'f',
            values: {
                none: 0,
                door: 1,
                heater: 2,
                cooler: 3,
                light: 4,
                fridgeTemperature: 5,
                roomTemperature: 6,
                fan: 7,
                beerTemperature: 9
            }
        }
    }
}
