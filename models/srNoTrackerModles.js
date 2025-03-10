const mongoose = require('mongoose');

const srNoTrackerSchema = mongoose.Schema({
    prefix: {
        type: String,
        required: true
    },
    lastSequenceNumber: {
        type: Number,
        required: true
    },
    financialYear: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('srNoTracker', srNoTrackerSchema);
