const mongoose = require('mongoose');

const transportSchema = mongoose.Schema({
    transportNumber: {
        type: String,
        required: true
    },
    dateAndTime: {
        type: String,
        require: true
    },
    vehicalNumber: {
        type: String,
        require: true
    },
    cost: {
        type: Number,
        require: true
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('Transport', transportSchema);