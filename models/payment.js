var mongoose = require('mongoose');

var PaymentSchema = mongoose.Schema({
    paymentId: {
        type: String,
        required: true
    },
    executed: {
        type: Boolean,
        default: false,
        required: true
    },
    confirmed: {
        type: Boolean,
        default: false,
        required: true
    },
    /*payerId: {
        type: String,
        required: true
    },*/
    user: {
        type: String,
        required: true
    },
    amount: {
        total: {
            type: String,
            required: true
        },
        currency: {
            type: String,
            required: true
        }
    },
    /*item_list: {
        
    },*/
    created: {
        type: Date,
        default: Date.now,
        required: true
    }
});

var Payment = module.exports = mongoose.model('Payment', PaymentSchema);

module.exports.executed = function(paymentDoc, callback){
    paymentDoc.set({executed: true});
    paymentDoc.save(callback);
}

module.exports.executedAndConfirmed = function(paymentDoc, callback){
    paymentDoc.set({executed: true, confirmed: true});
    paymentDoc.save(callback);
}