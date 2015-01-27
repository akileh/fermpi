var app = require('../../app'),
    db = require('../database'),
    async = require('async')

app.get('/api/profile', function (req, res, next) {
    db.Profile.findAll({
            include: [{ model: db.Frame, as: 'frames' }]
        })
        .error(next)
        .success(function (profiles) {
            res.json(profiles)
        })
})

app.get('/api/profile/:id', function (req, res, next) {
    db.Profile
        .find( {
            where: { id: req.params.id },
            include: [{ model: db.Frame, as: 'frames' }]
        })
        .error(next)
        .success(function (profile) {
            if(!profile) return next(new Error('profile not found'))
            res.json(profile)
        })
})


app.delete('/api/profile/:id', function (req, res, next) {
    db.Frame
        .destroy({ profileId: req.params.id })
        .error(next)
        .success(function () {
            db.Profile.destroy({ id: req.params.id })
            res.json({ success: true })
        })
})

app.post('/api/profile', createOrUpdate)
app.put('/api/profile/:id', createOrUpdate)

function createOrUpdate(req, res, next) {
    if(!Array.isArray(req.body.frames))
        return next(new Error('frames is not an array'))

    async.auto(
        {
            getProfile: [function (callback) {
                if(req.params.id)
                    findProfile(req.params.id, callback)
                else
                    createProfile(req.body.name, callback)
            }],
            createFrames: ['getProfile', function (callback, results) {
                createFrames(req.body, results.getProfile, callback)
            }]
        },
        function (err, results) {
            if(err) return next(err)
            res.json(results.getProfile)
        }
    )
}

function createProfile(name, callback) {
    db.Profile
        .create({
            name: name
        })
        .error(callback)
        .success(function (profile) {
            callback(null, profile)
        })
}

function createFrames(body, profile, callback) {
    var frames = []
    async.eachSeries(
        body.frames,
        function (f, callback) {
            var frame = db.Frame.build({
                temperature: f.temperature,
                time: f.time,
                type: f.type,
                profileId: profile.id
            })
            frame
                .save()
                .error(callback)
                .success(function (frame) {
                    frames.push(frame)
                    callback()
                })
        },
        function (err) {
            // remove all created frames
            if(err) {
                async.each(
                    frames,
                    function (frame) {
                        frame.destroy()
                    },
                    function () {
                        callback(err)
                    }
                )
            }
            // replace old frames
            else {
                profile
                    .setFrames(frames)
                    .error(callback)
                    .success(function () {
                        callback()
                    })
            }
        }
    )
}

function findProfile(id, callback) {
    db.Profile
        .find({
            where: { id: id },
            include: [{ model: db.Frame, as: 'frames' }]
        })
        .error(callback)
        .success(function (profile) {
            if(!profile) return callback(new Error('profile not found'))
            callback(null, profile)
        })
}
