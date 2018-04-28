var mongoose = require('mongoose');

var GuideSchema = mongoose.Schema({
    
    authors: {
        //type: [mongoose.Types.ObjectId],
        type: [String],
        required: true
    },
    title: {
		type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imgheadurl: {
		type: String,
        required: true
    },
    imgheadalt: String,
    locations:[{
        country: String,
        cities: [{
            name: String,
            days: Number
        }]
    }],
    rating:{
        type: Number,
        index: true,
        min: 0,
        max: 5
    },
    price: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: "USD",
        required: true
    },
    bookable: Boolean,
    sections: [{
        imgurl: String,
        imgalt: String,
        title: String,
        description: String
    }],
    created: {
        type: Date,
        default: Date.now
    },
    lastupdate: {
        type: Date,
        default: Date.now
    },
    tags: [String]
    
});

var Guide = module.exports = mongoose.model('Guide', GuideSchema);

module.exports.getSection = function(title, description, imgurl){
    return {imgurl: imgurl, imgalt: "", title: title, description: description};
}