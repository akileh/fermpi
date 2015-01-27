var app = require('../../app'),
    fs = require('fs'),
    crypto = require('crypto'),
    nconf = require('nconf'),
    Handlebars = require('handlebars')

var template = Handlebars.compile(fs.readFileSync(__dirname + '/../index.hbs').toString()),
    cachebust

if(nconf.get('NODE_ENV') !== 'development') {
    cachebust = {
        js: crypto.createHash('md5').update(fs.readFileSync(__dirname + '/../../public/dist/fermpi.min.js')).digest('hex').substr(0, 16),
        css: crypto.createHash('md5').update(fs.readFileSync(__dirname + '/../../public/dist/fermpi.min.css')).digest('hex').substr(0, 16)
    }
}

app.all('*', function (req, res, next) {
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')
    res.header('Expires', 'Fri, 31 Dec 1998 12:00:00 GMT')

    res.send(template({
        name: nconf.get('name'),
        app: JSON.stringify({
            name: nconf.get('name')
        }),
        jsSrc: '/dist/fermpi.' + (process.env.NODE_ENV === 'development' ? 'debug.js' : 'min.' + cachebust.js + '.js'),
        cssSrc: '/dist/fermpi.min.' + (process.env.NODE_ENV === 'development' ? 'css' : cachebust.css + '.css')
    }))
})
