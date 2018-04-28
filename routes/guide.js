var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var paypal = require('paypal-rest-sdk');
var multer = require('multer');

var storage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, './uploads/')
    },
    filename: function(req, file, callback){
        callback(null, file.originalname);
    }
})

var upload = multer({storage: storage});

var Guide = require('../models/guide');
var Payment = require('../models/payment');

router.get("/get/:id", function(req, res){
    Guide.find({_id: mongoose.Types.ObjectId(req.params.id)}, function(err, guide){
        if(err) throw err;
        if(guide)
            res.render("guide_details", {guide: guide });
    });
});

router.get("/get/:id/buy", ensureAutenticated, function(req, res){ //should be post
    Guide.findById(req.params.id, function(err, guide){
        if(err) throw err;
        if(guide){
            var user = req.user;
            var create_payment_json = {
                "intent": "sale",
                "payer": {
                    "payment_method": "paypal"
                },
                "redirect_urls": {
                    "return_url": "http://localhost:3000/guides/buy/success",
                    "cancel_url": "http://localhost:3000/guides/buy/cancel"
                },
                "transactions": [{
                    "item_list": {
                        "items": [{
                            "name": guide.title,
                            "sku": "item",
                            "price": guide.price,
                            "currency": guide.currency,
                            "quantity": 1
                        }]
                    },
                    "amount": {
                        "total": guide.price, //computed value (=guide.price)
                        "currency": guide.currency,
                    },
                    "description": guide.description
                }]
            };
            paypal.payment.create(create_payment_json, function (error, payment) {
                if (error) {
                    console.log(error.response);
                    /*console.log(error.response.details);
                    console.log(JSON.stringify(create_payment_json));//*/
                    throw error;
                } else {
                    var paymentDoc = new Payment({
                        paymentId: payment.id,
                        user: user.id,
                        amount: {
                            total: payment.transactions[0].amount.total,
                            currency: payment.transactions[0].amount.currency
                        }
                    });
                    paymentDoc.save();
                    //console.log(payment);
                    for(let i=0; i<payment.links.length; i++){
                        if(payment.links[i].rel === "approval_url"){
                            res.redirect(payment.links[i].href);
                        }
                    }
                }
            });
        }
    });
});

router.get("/insert", function(req, res){
    var guide = new Guide({
        authors: ["aaa"],
        title: "title", 
        description: "Desc",
        price: 25,
        currency: "USD",
        imgheadurl: "testguide.imgheadurl"});
    guide.save(function(err, user){
		if(err) throw err;
        console.log(user);
    });
    console.log("record saved");//*/
});

router.get("/buy/success", function(req, res){
    var payerId = req.query.PayerID;
    var paymentId = req.query.paymentId;
    
    Payment.findOne({paymentId: paymentId}, function(err, paymentDoc){
        if(err){
            console.log(err);
            throw err;
        }
        if(paymentDoc){
            var execute_payment_json = {
                "payer_id": payerId,
                "transactions": [{
                    "amount": {
                        "currency": paymentDoc.amount.currency,
                        "total": paymentDoc.amount.total
                    }
                }]
            };
            paypal.payment.execute(paymentId, execute_payment_json, function(error, payment){
                if(error) {
                    Payment.executed(paymentDoc);
                    console.log(error.response);
                    console.log(error.response.details.toString());
                    throw error;
                } else {
                    Payment.executedAndConfirmed(paymentDoc);
                    //console.log(JSON.stringify(payment));
                    res.redirect("/");
                }
            });
        }
    });
    
});

router.get("/buy/cancel", function(req, res){
    console.log("Cancel");
    res.write("Cancel.");
});

router.get("/create", ensureAutenticated, function(req, res){
    //console.log("GETTTT");
    res.render("createguide");
});

var fieldUpload = upload.fields([{ name: 'headimg', maxCount: 1 }, { name: 'sectionimg', maxCount: 8 }]);

router.post("/create", ensureAutenticated, fieldUpload, function(req, res){
    if(!req.body.title || !req.body.price || !req.body.currency || !req.body.countries || !req.body.sections){
        res.redirect("/create");
    }
    /*console.log(JSON.stringify(req.files));
    console.log(JSON.stringify(req.body));*/
    var countries = JSON.parse(req.body.countries);
    var sections = JSON.parse(req.body.sections);
    var guideSections = [];
    sections.forEach(function(s){
        var path = "";
        for(var i = 0; i<req.files.length; i++){
            if(req.files[i].filename == s.imgname)
                path = req.files[i].filename;
        }
        guideSections.push(Guide.getSection(s.title, s.description, path));
    });
    var guide = new Guide({
        authors: req.user._id,
        title: req.body.title,
        imgheadurl: req.files.headimg[0].path,
        description: req.body.description,
        locations: countries,
        sections: guideSections,
        price: req.body.price,
        currency: req.body.currency
    });
    guide.save();
    //redirect: res.redirect("/");
    
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

module.exports = router;