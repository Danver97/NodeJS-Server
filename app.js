var express = require("express");
var session = require('express-session');
var bodyParser = require("body-parser");
var path = require("path");
var mongo = require("mongojs");
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var passport = require('passport');
var LocalStrategy = require("passport-strategy");
var MongoDBStoreSession = require('connect-mongodb-session')(session);
var paypal = require('paypal-rest-sdk');

var users = require('./routes/user');
var guides = require('./routes/guide');

/*

//TLS/SSL

//ENCODE ALL UNTRUSTED DATA

//PARAMETER POLLUTION

//BLOCK CROSS SITE REQUEST (csrftoken)

//TEST FOR EVIL REGEXP

//HELMET
const helmet = require('helmet');

const app = express();

app.use(helmet());


// LIMITER
const redisClient = require('redis').createClient();

const app = express();

const limiter = require('express-limiter')(app, redisClient);

// Limit requests to 100 per hour per ip address.
limiter({
  lookup: ['connection.remoteAddress'],
  total: 100,
  expire: 1000 * 60 * 60
})
*/

//var urlMongo = "mongodb://localhost:27017/mydb";

mongoose.connect('mongodb://localhost/holiday');
var db = mongoose.connection;

var port = 3000;

var app = express();
var store = new MongoDBStoreSession({
    uri: 'mongodb://localhost:27017/holiday',
    databaseName: 'holiday',
    collection: 'users_sessions'
},function(error) {
    console.log(error);
});

store.on('error', function(error){
    assert.ifError(error);
    assert.ok(false);
});
//var db = mongo("holiday", ["users", "guides"]);

paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AeOq13N1xBR88Ae9TmdaAXobsC8NsuWSdLIR7NkVMPLtKMPyUfyXoGwM05Xr_URy20YKWrKKCTC-3Dof',
  'client_secret': 'ELElnEsq4Let1OSQXTNuJnS38yDukXCt2KDvXCC2-vTv6cypWxvhZvf1XlxOP2-Nwb-45pLm6nUaIaUp'
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(require('cookie-parser')());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "images")));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
    rolling: true,
    store: store,
    cookie: {
        //secure: true,
        maxAge: 1000*60*20
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

app.use('/users', users);
app.use('/guides', guides);


app.get("/", function(req, res){
    /*console.log("VAFFANCULO");
    //console.log(req.isAuthenticated());
    res.send("<h1>Hello world!</h1>");*/
    res.render("index", {images: testimage, user: req.user});
});

var testparagraph = ["p1",
                 "p2"];

var testimage = [{ name: "bali",
              url : "/viceroy.jpg"},
              { name: "opa",
              url : "/viceroy.jpg"}];

var testguide = { title: "Road To Bali",
              imgheadurl: "/img/maldives-720.jpg",
              imgheadalt: "alt",
              location: "Bali, Despaswar, Indonesia",
              bookable: false,
              countries: 2,
              sections: [{imgurl: "/img/maldives-720.jpg",
                          imgalt: "altsection",
                          head: "The best travel of your life!",
                          paragraph: "The best travel of your life..."}]
             };

app.get("/pace", function(req, res){
    res.render("index", {images: testimage});
});

app.get("/guide/:id", function(req, res){
    //mongo.find(req.params.id);
    res.render("guide_details", {guide: testguide });
    
});



app.listen(port, function(){
   console.log("Server started on port " + port);
});

function ensureAutenticated(req, res, next){
    if(req.isAuthenticated()){
        //console.log("Auth: ok!");
        console.log(req.user);
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

function Guide(title, rating, description, location){
    this.title = title;
    this.rating = 0;
    this.description = description;
    this.location = location;
    this.sections = [];
    this.countries = 1;
    this.days = 0;
    this.bookable = false;
    this.addSection = function(imgurl, imgalt, title, desc){
        this.sections.concat({imgurl: imgurl, imgalt: imgalt, head: title, paragraph: desc});
    }
    this.setImgHead = function(urlimghead, imgalt){
        this.imgheadurl = urlimghead;
        this.imgheadalt = imgalt;
    }
    
}
/*
function User(firstname, lastname, email, password){
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.password = password;
}*/