var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var interval;
var interval_switch;
var urlencodeParser = bodyParser.urlencoded({extended: false});

//Import 
Simulation = require('./models/simulate');
SuitSwitch = require('./models/suitswitch');

//Database connector
mongoose.connect('mongodb://localhost/spacesuit');

//EJS framework for website display
app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'));

//ROUTES
app.get('/',function(req, res){
    res.render('index');
});

//On start button, simulation starts
app.post('/', urlencodeParser, function(req, res){
    console.log("--------------Simulation started--------------")
    var time = Date.now(); 
    interval = setInterval(Simulation.suitTelemetry.bind(null, time),1000);
    interval_switch = setInterval(SuitSwitch.SuitSwitch,1000);
    res.render('contact',{qs: ""});
});

//Returns all simulated data from the database
app.get('/api/suit', function(req, res){      
        Simulation.getSuitTelemetry(function (err, data) {
            if (err) {
                throw err;
                console.log(err);
            }
            res.json(data);
        });
});

app.get('/api/suit/recent', function(req, res){      
    Simulation.getSuitTelemetryByDate(function (err, data) {
        if (err) {
            throw err;
            console.log(err);
        }
        res.json(data);
    });
});

app.get('/api/suitswitch', function(req, res){      
    SuitSwitch.getSuitSwitch(function (err, data) {
        if (err) {
            throw err;
            console.log(err);
        }
        res.json(data);
    });
});

app.get('/api/suitswitch/recent', function(req, res){      
    SuitSwitch.getSuitSwitchByDate(function (err, data) {
        if (err) {
            throw err;
            console.log(err);
        }
        res.json(data);
    });
});

app.get('/contact',function(req, res){
    res.render('contact',{qs: req.query});
});

app.post('/contact', urlencodeParser, function(req, res){
    //console.log(req.body);
    console.log('--------------Simulation stopped--------------');
    clearInterval(interval);
    clearInterval(interval_switch);
    res.render('contact-success',{data: req.body});
});

/* app.get('/profile/:name', function(req, res){
    var data = {age:29, job: 'Astronaut', hobbies: ['eating', 'fighting', 'fishing']};
    res.render('profile', {person: req.params.name, data:data});
}) */

app.listen(3000);
console.log('Server is running on port 3000...');