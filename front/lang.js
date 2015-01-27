module.exports = {
    "error_timeout": "Error connecting to server",
    "error_arduino": "Error connecting to Arduino",
    "error_general": "Error",
    "modes": {
        "beer": "Beer constant",
        "fridge": "Fridge constant",
        "off": "Off"
    },
    "connectionStatus": {
        "connected": "Connected",
        "connecting": "Connecting...",
        "disconnected": "Disconnected",
        "error": "Error connecting to Arduino"
    },
    "profile_times": {
        "days": "Days",
        "hours": "Hours"
    },
    "change_temperature": "Change",
    "degree_symbol": "°",
    "name": "Name",
    "mode": "Mode",
    "beer": "Beer",
    "fridge": "Fridge",
    "room": "Room",
    "beer_temperature": "Beer temperature",
    "status": "Status",
    "change_mode": "Change mode",
    "save": "Save",
    "apply": "Apply",
    "set": "Set",
    "add": "Add",
    "cancel": "cancel",
    "not_a_number": "Not a number",
    "installed": "Installed",
    "available": "Available",
    "no_installed_devices": "No installed devices",
    "no_available_devices": "No available devices",
    "error_fetching_devices": "Error fetching devices",
    "temperature": "Temperature",
    "constants": "Constants",
    "celcius": "Celcius",
    "fahrenheit": "Fahrenheit",
    "beer_name": "Beer name",
    "start": "Start",
    "stop": "Stop",
    "resume": "Resume",
    "pause": "Pause",
    "information": "Information",
    "reprogram": "Reprogram",
    "upload": "Upload",
    "all_beers": "All beers",
    "new_profile": "New profile",
    "delete": "Delete",

    "statusTypes": {
        "cooling": "Cooling for ",
        "idling": "Idling for ",
        "doorOpen": "Door open",
        "waitToCool": "Waiting to cool for ",
        "unknown": "Unknown"
    },

    "pin": "Pin",
    "pinName": "Arduino Pin",
    "value": "Value",
    "pinType": {
        "act": "Switch actuator",
        "door": "Switch sensor",
        "free": "Free",
        "onewire": "Temperature sensor",
        "rotary": "Rotary",
        "spi": "Spi"
    },
    "funcName": "Function",
    "func": {
        "none": "None",
        "door": "Door",
        "heater": "Heater",
        "cooler": "Cooler",
        "light": "Light",
        "fan": "Fan",
        "fridgeTemperature": "Fridge",
        "roomTemperature": "Room",
        "beerTemperature": "Beer"
    },

    "constant": {
        "tempFormat": "Temperature format",
        "tempFormat_values": {
            "C": "Celcius",
            "F": "Fahrenheit"
        },
        "tempSetMin": "Minimum temperature",
        "tempSetMax": "Maximum temperature",
        "Kp": "PID: Kp",
        "Ki": "PID: Ki",
        "Kd": "PID: Kd",
        "pidMax": "PID: maximum",
        "iMaxErr": "Integrator: maximum temp error",
        "idleRangeH": "Temperature idle range top",
        "idleRangeL": "Temperature idle range bottom",
        "heatTargetH": "Heating target upper bound",
        "heatTargetL": "Heating target lower bound",
        "coolTargetH": "Cooling target upper bound",
        "coolTargetL": "Cooling target lower bound",
        "maxHeatTimeForEst": "Maximum time in seconds for heating overshoot estimator",
        "maxCoolTimeForEst": "Maximum time in seconds for cooling overshoot estimator",
        "fridgeFastFilt": "Fridge fast filter delay time",
        "fridgeFastFilt_values": {
            0: "9 seconds",
            1: "18 seconds",
            2: "39 seconds",
            3: "78 seconds",
            4: "159 seconds",
            5: "318 seconds",
            6: "639 seconds"
        },
        "fridgeSlowFilt": "Fridge slow filter delay time",
        "fridgeSlowFilt_values": {
            0: "9 seconds",
            1: "18 seconds",
            2: "39 seconds",
            3: "78 seconds",
            4: "159 seconds",
            5: "318 seconds",
            6: "639 seconds"
        },
        "fridgeSlopeFilt": "Fridge slope filter delay time",
        "fridgeSlopeFilt_values": {
            0: "27 seconds",
            1: "54 seconds",
            2: "2 minutes",
            3: "4 minutes",
            4: "8 minutes",
            5: "16 minutes",
            6: "32 minutes"
        },
        "beerFastFilt": "Beer fast filter delay time",
        "beerFastFilt_values": {
            0: "9 seconds",
            1: "18 seconds",
            2: "39 seconds",
            3: "78 seconds",
            4: "159 seconds",
            5: "318 seconds",
            6: "639 seconds"
        },
        "beerSlowFilt": "Beer slow filter delay time",
        "beerSlowFilt_values": {
            0: "9 seconds",
            1: "18 seconds",
            2: "39 seconds",
            3: "78 seconds",
            4: "159 seconds",
            5: "318 seconds",
            6: "639 seconds"
        },
        "beerSlopeFilt": "Beer slope filter delay time",
        "beerSlopeFilt_values": {
            0: "27 seconds",
            1: "54 seconds",
            2: "2 minutes",
            3: "4 minutes",
            4: "8 minutes",
            5: "16 minutes",
            6: "32 minutes"
        },
        "lah": "Use light as heater",
        "lah_values": {
            0: "Yes",
            1: "No"
        },
        "hs": "Trigger rotary encoder at every",
        "hs_values": {
            0: "Full step",
            1: "Half step"
        }
    }
}
