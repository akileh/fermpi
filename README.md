# Fermpi
  Replacement for the Raspberry Pi part of [BrewPi](http://www.brewpi.com/).
  Needs lots of testing, but I've been running it myself for months.

## Dependencies
* [avrdude](http://savannah.nongnu.org/projects/avrdude/)
* [nodejs](http://nodejs.org/)

## Usage
    npm install --production
    npm start

## Configuration
Don't edit existing config files. Copy [config/user.json.sample](./config/user.json.sample) as **config/user.json** and edit that.
All defaults are found in [config/default.json](./config/default.json).

## Development
    // install npm modules
    npm install
    sudo npm install -g gulp

    // start server
    gulp server

    // and watch file changes and compile javascript
    gulp watchify

    // ...or do both
    gulp dev

    // build css
    gulp css

    // build production file
    gulp browserify

    // jshint
    gulp jshint

For build error notifications install [growl](https://www.npmjs.org/package/growl) dependencies

## Installation for Raspberry Pi

### dependencies

#### avrdude
    sudo apt-get install avrdude

#### nodejs
    wget http://node-arm.herokuapp.com/node_latest_armhf.deb
    sudo dpkg -i node_latest_armhf.deb
    sudo apt-get install git

### clone repo
    git clone https://github.com/fataki/fermpi

### Run FermPi as a service (upstart)
    // install upstart
    sudo apt-get --force-yes install upstart

    // restart
    sudo shutdown -r now

    // copy upstart config and start service
    sudo cp misc/upstart.conf /etc/init/fermpi.conf
    sudo initctl reload-configuration
    sudo start fermpi

    // control
    sudo start|stop|restart fermpi
