var paypal = require('paypal-rest-sdk');
var Payment = require('../models/payment');

module.exports.executePaymentJson = function(payerId, paymentDoc){
    return {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": paymentDoc.amount.currency,
                "total": paymentDoc.amount.total
            }
        }]
    };
}

module.exports.paymentItemJson = function(name, sku, price, currency, quantity){
    return {
        "name": name,
        "sku": sku,
        "price": price,
        "currency": currency || "USD",
        "quantity": quantity || 1
    };
}

module.exports.createPaymentJson = function(return_url, cancel_url, items, currency, description){
    var create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": return_url,
            "cancel_url": cancel_url
        },
        "transactions": [{
            "item_list": {
                "items": []
            },
            "amount": {
                "total": 0, //computed value (=guide.price)
                "currency": currency,
            },
            "description": description
        }]
    };
    var total = 0;
    items.forEach(function(item){
        if(item.currency != currency){
            //convert price
            total += item.price * item.quantity;
            item.currency = currency;
        }
        create_payment_json.item_list.items.push(item);
    });
    create_payment_json.transactions.amount.total = total;
    return create_payment_json;
}

module.exports.createPayment = function(create_payment_json, user, res){
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

module.exports.executePayment = function(paymentId, execute_payment_json, paymentDoc, res, redirectUrl){
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