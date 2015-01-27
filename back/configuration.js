var nconf = require('nconf')

nconf
    .argv()
    .env()
    .add('user', { type: 'file', file: __dirname + '/../config/user.json' })
    .add('default', { type: 'file', file: __dirname + '/../config/default.json' })
