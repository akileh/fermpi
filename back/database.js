var logger = require('./logger'),
    Sequelize = require('sequelize'),
    sequelize = new Sequelize('database', 'root', null, {
        dialect: 'sqlite',
        storage: __dirname + '/../data/database.sqlite',
        logging: false,
        define: {
            timestamps: false
        }
    })

var Temperature = sequelize.define('Temperature',
    {
        timestamp: {
            type: Sequelize.BIGINT,
            allowNull: false,
        },
        beerTemperature: Sequelize.FLOAT,
        fridgeTemperature: Sequelize.FLOAT,
        roomTemperature: Sequelize.FLOAT
    },
    {
        instanceMethods: {
            toJSON: function () {
                return {
                    timestamp: this.timestamp,
                    beer: this.beerTemperature,
                    fridge: this.fridgeTemperature,
                    room: this.roomTemperature
                }
            }
        }
    }
)

var Beer = sequelize.define('Beer', {
    active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            max: 256
        }
    },
    paused: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
})

Beer.hasMany(Temperature, { as: 'temperatures', foreignKey: 'beerId' })

var Profile = sequelize.define('Profile', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

var Frame = sequelize.define('Frame',
    {
        temperature: {
            type: Sequelize.FLOAT,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        time: {
            type: Sequelize.BIGINT,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        type: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                isIn: [['hours', 'days']]
            }
        },
        profileId: {
            type: Sequelize.INTEGER,
            references: 'Profiles',
            referencesKey: 'id'
        }
    },
    {
        instanceMethods: {
            toJSON: function () {
                return {
                    temperature: this.temperature,
                    time: this.time,
                    type: this.type
                }
            }
        }
    }
)

Profile.hasMany(Frame, { as: 'frames', foreignKey: 'profileId' })
Frame.belongsTo(Profile, { as: 'profile', foreignKey: 'profileId' })

sequelize
    .sync({ force: false })
    .complete(function (err) {
        if(err) return logger.error(err)
    })

module.exports = {
    Temperature: Temperature,
    Beer: Beer,
    Profile: Profile,
    Frame: Frame,
    sequelize: sequelize
}
