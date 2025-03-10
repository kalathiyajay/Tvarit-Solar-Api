const mongoose = require('mongoose');

const dailyPriceSchema = mongoose.Schema({
    kw: {
        type: Number,
        require: true
    },
    primary: {
        type: Number,
        require: true
    },
    secondary: {
        type: Number,
        require: true
    }
}, {
    timestamps: true,
    versionKey: false
});


module.exports = mongoose.model('dailyPrice', dailyPriceSchema);