var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var url = require('url');

var User = require('../models/user');


//User-info
/*router.get('/user', function(req, res){
    
});//*/

// Login
router.get('/login', ifLoggedNotLog, function(req, res){
	res.render('login', {username: req.query.username, error: req.query.error});
});

// Register
router.get('/signup', ifLoggedNotLog, function(req, res){
    var query = req.query;
    console.log(req.url + " " + query.firstname + " " + query.email);
	res.render('signup', {query: query});
});

// Register User
router.post('/signup', function(req, res){
    var body = req.body;

    validateForm(body, function(errors){
        var isEmpty = true;
        for (var prop in errors){
            if(errors.hasOwnProperty(prop)){
                isEmpty = false;
                break;
            }
        }
        if(!isEmpty){
            urlFormat = {
                /*protocol: 'https',
                hostname: 'example.com',*/
                pathname: '/users/signup',
                query: {
                    username: body.username,
                    firstname: body.firstname,
                    lastname: body.lastname,
                    email: body.email,                
                }
            };
            if(errors.eusername)
                urlFormat.query.eusername = errors.eusername;
            if(errors.efirstname)
                urlFormat.query.efirstname = errors.efirstname;
            if(errors.eemail)
                urlFormat.query.eemail = errors.eemail;
            if(errors.epassword)
                urlFormat.query.epassword = errors.epassword;
            if(errors.econfirmpassword)
                urlFormat.query.econfirmpassword = errors.econfirmpassword;
            res.redirect(url.format(urlFormat));
        } else {
            var newUser = new User({
                username: body.username,
                firstname: body.firstname,
                lastname: body.lastname,
                email: body.email,
                password: body.password
            });

            User.createUser(newUser, function(err, user){
                if(err){
                    console.log(JSON.stringify(err));
                    throw err;}
                console.log(user);
            });
            //req.flash('success_msg', 'You are registered and can now login');
            res.redirect('/users/login');
        }
    });
	/*if(validateForm(body)) {
		var newUser = new User({
			username: body.username,
			firstname: body.firstname,
            lastname: body.lastname,
			email: body.email,
			password: body.password
		});

		User.createUser(newUser, function(err, user){
			if(err){
                console.log(JSON.stringify(err));
                throw err;}
			console.log(user);
		});
		//req.flash('success_msg', 'You are registered and can now login');
		res.redirect('/users/login');
	} else {
        //url.format();
        urlFormat = {
            /*protocol: 'https',
            hostname: 'example.com',
            pathname: '/users/signup',
            query: {
                username: body.username,
                firstname: body.firstname,
                lastname: body.lastname,
                email: body.email,                
            }
        };
        if(body.username === ""){
            urlFormat.query.eusername = "required";
        } else {
            User.getUserByUsername(body.username, function(err, user){
                if(user)
                    urlFormat.query.eusername = "alreadytaken";
            });
        }
        /*var url = "/users/signup?firstname=" + body.firstname +
                    "&lastname=" + body.lastname + "&email=" + body.email;
        if(body.firstname === ""){
            //url += "&efirstname=required";
            urlFormat.query.efirstname = "required";
        }
        if(body.email === ""){
            //url += "&eemail=required";
            urlFormat.query.eemail = "required";
        } else if(!validateEmail(body.email)){
            //url += "&eemail=notvalid";
            urlFormat.query.eemail = "notvalid";
        } else {
            User.getUserByEmail(body.email, function(err, user){
                if(user)
                    urlFormat.query.eemail = "alreadytaken";
            });
        }
        if(body.password===""){
            //url += "&epassword=required";
            urlFormat.query.epassword = "required";
        } else if(!validatePassword(body.password)){
            //url += "&epassword=notvalid";
            urlFormat.query.epassword = "notvalid";
        }
        if(body.confirmpassword != body.password){
            //url += "&econfirmpassword=notmatch";
            urlFormat.query.econfirmpassword = "notmatch";
        }
        res.redirect(url.format(urlFormat));
    }*/
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.getUserByUsername(username, function(err, user){
            if(err) throw err;
            if(!user){
                return done(null, false, {message: 'Unknown User'});
            }
            
            User.comparePassword(password, user.password, function(err, isMatch){
                if(err) throw err;
                if(isMatch){
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Invalid password'});
                }
            });
        });
    }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login'/*, failureFlash: true*/}),
  function(req, res) {
    res.redirect('/');
  });

router.get('/logout', function(req, res){
	req.logout();
	res.redirect('/users/login');
});

function validateForm(body, callback){
    if(body.username == "")
        return false;
    var required = "required";
    var notvalid = "notvalid";
    var notmatch = "notmatch";
    var alreadyTaken = "alreadytaken";
    var errors = {}
    if(body.username === "")
        errors.eusername = required;
    if(body.firstname === "")
        errors.efirstname = required;
    if(body.password === ""){
        errors.epassword = required;
    } else if(!validatePassword(body.password)){
        errors.epassword = notvalid;
    }
    if(body.confirmpassword != body.password){
        errors.econfirmpassword = notmatch;
    }
    if(body.email === ""){
        errors.eemail = required;
    } else if(!validateEmail(body.email)){
        errors.eemail = notvalid;
    }
    if(errors.eusername == undefined){
        User.getUserByUsername(body.username, function(err, user){
            if(err) throw err;
            if(user)
                errors.eusername = alreadyTaken;
            if(errors.eemail == undefined){
                User.getUserByEmail(body.email, function(err, user){
                    if(err) throw err;
                    if(user)
                        errors.eemail = alreadyTaken;
                    callback(errors);
                });
            } else {
                callback(errors);
            }

        });
    } else if(errors.eemail == undefined) {
        User.getUserByEmail(body.username, function(err, user){
            if(err) throw err;
            if(user)
                errors.eemail = alreadyTaken;
            callback(errors);
        });
    }
    
}

function validateEmail(email){
    var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return reg.test(email);
}

function validatePassword(pw){
    //(?=.*[A-Z])
    var reg = /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/;
    return reg.test(pw);
}

function ifLoggedNotLog(req, res, next){
    if(req.isAuthenticated()){
        //console.log("Auth: ok!");
        console.log(req.user);
        res.redirect("/");
        return null;
	}
    return next();
}

module.exports = router;