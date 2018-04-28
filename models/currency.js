var mongoose = require('mongoose');

// User Schema
var CurrencySchema = mongoose.Schema({
	acronym: {
		type: String,
        unique: true,
        index: true
	},
	name: {
		type: String
	},
	symbol: {
		type: String
	}
});

var User = module.exports = mongoose.model('Currency', CurrencySchema);