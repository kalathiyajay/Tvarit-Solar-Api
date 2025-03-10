const mongoose = require('mongoose');

const technicalSchema = mongoose.Schema({
    fillNo: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    contact: {
        type: String,
        require: true
    },
    kw: {
        type: String,
        require: true
    },
    dealer: {
        type: String,
        require: true
    },
    pendingPayment: {
        type: String,
        require: true
    },
    fabiricator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        require: true
    },
    electircoian: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        require: true
    },
    solarSize: {
        type: Number,
        require: true
    },
}, {
    timestamps: true,
    versionKey: false
});


module.exports = mongoose.model('technical', technicalSchema);