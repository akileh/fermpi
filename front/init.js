var $ = require('jquery'),
    attachFastClick = require('fastclick'),
    Router = require('./router')

require('bootstrap')
window.lang = require('./lang')

$(function () {
    attachFastClick(document.body)
    new Router()
})
