var forever = require('forever-monitor')

new (forever.Monitor)('app.js', {
    env: {'NODE_ENV': 'production'}
}).start()

