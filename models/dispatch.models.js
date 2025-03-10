const mongoose = require('mongoose');

const dispatchSchema = mongoose.Schema({
    fillNo: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    contachNo: {
        type: String,
        require: true
    },
    Kw: {
        type: String,
        require: true
    },
    location: {
        type: String,
        require: true
    },
    consumerNo: {
        type: String,
        require: true
    },
    dealer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "dealer",
        require: true
    },
    date: {
        type: String,
        require: true
    },
    wareHouseMetirial: {
        type: String,
        require: true
    },
    wareHouseStrucure: {
        type: String,
        require: true
    },
    solarModule: {
        type: String,
        require: true
    },
    inverterMake: {
        type: String,
        require: true
    },
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('dispatch', dispatchSchema)