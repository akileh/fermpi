console.log('foo')

var $ = require('jquery'),
    attachFastClick = require('fastclick'),
    Router = require('./router')

    console.log('bar')

require('bootstrap')
window.lang = require('./lang')

$(function () {
    attachFastClick(document.body)
    new Router()
})
