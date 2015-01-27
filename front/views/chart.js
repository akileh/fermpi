var Backbone = require('backbone'),
    _ = require('underscore'),
    $ = require('jquery'),
    View = require('./view'),
    lang = require('../lang'),
    LogCollection = require('../collections/log'),
    BeerCollection = require('../collections/beer'),
    BeerModel = require('../models/beer'),
    template = require('../templates/chart.hbs'),
    LoadingView = require('./loading'),
    d3 = require('d3'),
    nv = require('nvd3'),
    moment = require('moment')

require('bootstrap-datepicker')

var datePickerOptions = {
    todayBtn: true,
    calendarWeeks: true,
    autoclose: true,
    todayHighlight: true
}

module.exports = View.extend({
    events: {
        'click .js-search': 'search',
        'click .js-beer-item': 'beer'
    },
    initialize: function (options) {
        _.bindAll(this, 'renderNvd3', 'renderChart')
        this.renderLoading()
        this.dates = new Backbone.Model({
            from: options.from ? moment(options.from, 'YYYY-MM-DD') : Date.now() - 1*24*60*60*1000,
            to: options.to ? moment(options.to, 'YYYY-MM-DD') : Date.now()
        })

        this.logs = new LogCollection()
        this.listenTo(this.logs, 'reset', this.renderChart)
        this.listenTo(this.logs, 'error', this.renderError)

        this.beers = new BeerCollection()
        this.listenToOnce(this.beers, 'reset', function () {
            // add extra model for all beers
            this.beers.unshift(new BeerModel({
                id: -1,
                name: lang.all_beers
            }))
            this.render()
                .search()
        })
        this.listenToOnce(this.beers, 'error', this.renderError)
        this.beers.fetch({ reset: true })
    },
    remove: function () {
        $(window).off('resize', this.resize);
        Backbone.View.prototype.remove.call(this)
    },
    render: function () {
        this.stopLoading()
        if(!this.resizeBinded) {
            this.resizeBinded = true
            this.resize = _.debounce(this.renderChart, 500)
            $(window).on('resize', this.resize)
        }

        this.beer = this.beers.at(0)
        this.$el.html(template({
            lang: lang,
            beers: this.beers.toJSON(),
            beer: this.beer.toJSON()
        }))

        this.$from = this.$('.js-from')
        this.$to = this.$('.js-to')
        this.$svg = this.$('svg')
        this.$chart = this.$('.js-chart')
        this.$from.text(moment(this.dates.get('from')).format('YYYY-MM-DD'))
        this.$to.text(moment(this.dates.get('to')).format('YYYY-MM-DD'))
        this.$beer = this.$('.js-beer')

        var self = this
        this.$from
            .datepicker(datePickerOptions)
            .datepicker('setUTCDate', new Date(this.dates.get('from')))
            .on('changeDate', function (date) {
                self.dates.set({ from: date.date.setHours(0, 0, 0) })
                self.$from.text(moment(self.dates.get('from')).format('YYYY-MM-DD'))
            })

        this.$to
            .datepicker(datePickerOptions)
            .datepicker('setUTCDate', new Date(self.dates.get('to')))
            .on('changeDate', function (date) {
                // set to end of selected date
                var to = new Date(date.date.getTime())
                self.dates.set('to', to.setHours(23, 59, 59)+1001)
                self.$to.text(moment(to).format('YYYY-MM-DD'))
            })

        this.$loading = this.$('.js-loading')
        this.loading = new LoadingView()
        this.$loading.html(this.loading.start().el)

        return this
    },
    beer: function (e) {
        e.preventDefault()
        this.beer = this.beers.get($(e.target).attr('data-value'))
        this.$beer.text(this.beer.get('name'))
        this.search()
    },
    search: function () {
        this.$svg.html('')
        this.$chart.html('')
        this.loading.start()
        this.$loading.removeClass('hidden')
        this.logs.setOptions({
            from: this.dates.get('from'),
            to: this.dates.get('to'),
            beer: this.beer.get('id')
        })
        Backbone.history.navigate('/chart/' + moment(this.dates.get('from')).format('YYYY-MM-DD') + '/' + moment(this.dates.get('to')).format('YYYY-MM-DD'), {
            trigger: false,
            replace: true
        })
        this.logs.fetch({ reset: true })
    },
    renderChart: function () {
        this.loading.stop()
        this.$loading.addClass('hidden')
        this.renderNvd3()
    },
    // D3 chart not in use right now
    /*
    renderD3: function () {
        this.$chart.html('')

        var targets = ['beer', 'fridge', 'room']
        var data = []
        _.each(targets, function (t) {
            data.push({ target: t, data: [] })
        })

        _.each(this.logs.toJSON(), function (d) {
            _.each(targets, function (t, i) {
                data[i].data.push({
                    timestamp: d.timestamp,
                    temperature: d[t]
                })
            })
        })

        var margin = {top: 30, right: 20, bottom: 30, left: 40},
            width = window.innerWidth - 200,
            height = window.innerHeight/2 + margin.top + margin.bottom

        var x = d3.scale.linear()
            .range([0, width])

        var y = d3.scale.linear()
            .range([height, 0])

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient('bottom')
            .tickValues(d3.time.day.range(this.dates.get('from'), this.dates.get('to')))
            .tickFormat(function (d) { return d3.time.format('%d.%m')(new Date(d)) })

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient('left')
            .tickFormat(function (d) { return d + lang.degree_symbol })

        var line = d3.svg.line()
            .x(function(d, i) { return x(d.timestamp) })
            .y(function(d, i) { return y(d.temperature) })

        var minX = d3.min(data, function (kv) { return d3.min(kv.data, function (d) { return d.timestamp; }) })
        var maxX = d3.max(data, function (kv) { return d3.max(kv.data, function (d) { return d.timestamp; }) })
        var minY = d3.min(data, function (kv) { return d3.min(kv.data, function (d) { return d.temperature; }) }) - 1
        var maxY = d3.max(data, function (kv) { return d3.max(kv.data, function (d) { return d.temperature; }) }) + 1

        x.domain([minX, maxX]);
        y.domain([minY, maxY]);

        var main = d3.select(this.$chart[0])
            .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + 2*margin.top + 2*margin.bottom)
            .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

        main.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis)
            .append('text')
                .attr('x', width/2)
                .attr('y', 1.2*margin.bottom)
                .style('text-anchor', 'middlmiddle')
                .text('Time')

        main.append('g')
            .attr('class', 'y axis')
            .call(yAxis)
            .append('text')
                .attr('y', -margin.top)
                .attr('dy', '1em')
                .style('text-anchor', 'middle')
                .text('Temperature')

        var target = main.selectAll('.target')
            .data(data)
            .enter()
            .append('g')
                .attr('class', 'target');

        target.append('path')
            .attr('class', 'line')
            .attr('d', function (d) {
                return line(d.data)
            })

        d3.select(this.$chart[0])
            .on('mousemove', function(){
                var mousex = d3.mouse(this);
                mousex = mousex[0] + 220 ;
                main.style('left', mousex + 'px' )
            })
            .on('mouseover', function(){ 
                console.log(d3.mouse(this))
                var mousex = d3.mouse(this);
                mousex = mousex[0] +220 ;
                main.style('left', mousex + 'px')
            })
    },
    */
    renderNvd3: function () {
        var data = [
            {
                key: 'beer',
                values: _.map(this.logs.toJSON(), function (item) {
                    return {
                        x: item.timestamp,
                        y: item.beer
                    }
                })
            },
            {
                key: 'fridge',
                values: _.map(this.logs.toJSON(), function (item) {
                    return {
                        x: item.timestamp,
                        y: item.fridge
                    }
                })
            },
            {
                key: 'room',
                values: _.map(this.logs.toJSON(), function (item) {
                    return {
                        x: item.timestamp,
                        y: item.room
                    }
                })
            }
        ]

        var self = this
        nv.addGraph(function () {
            var chart = nv.models.lineChart()
                .useInteractiveGuideline(true)

            chart.xAxis
                .axisLabel('Time')
                .tickValues(d3.time.day.range(self.dates.get('from'), self.dates.get('to')))
                .tickFormat(function (d) {
                    return d3.time.format('%d.%m %H:%M')(new Date(d))
                })

            chart.yAxis
                .axisLabel('Temperature')
                .tickFormat(function (d) {
                    return d3.format(',.1f')(d) + lang.degree_symbol
                })

            chart.interactiveLayer.tooltip
                .headerFormatter(function (d) {
                    return d
                })

            d3.select(self.$svg[0])
                .datum(data)
                .call(chart)

            nv.utils.windowResize(chart.update)
        })
    }
})
