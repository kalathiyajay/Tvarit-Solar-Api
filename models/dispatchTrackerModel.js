const mongoose = require('mongoose');

const dispatchTrackerSchema = mongoose.Schema({
    prefix: {
        type: String,
        required: true
    },
    lastSequenceNumber: {
        type: Number,
        required: true
    },
    lastDispatchNumber: {
        type: Number,
        required: true,
        default: 0
    },
    financialYear: {
        type: String,
        required: true
    },
    dispatchType: {
        type: String,
        required: true,
        enum: ['Dispatch', 'Return']
    },
    dispatchProcessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DispatchProcess',
        required: false
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('DispatchTracker', dispatchTrackerSchema);