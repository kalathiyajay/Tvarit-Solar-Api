const mongoose = require('mongoose');

const technicianSchema = mongoose.Schema({
    assignId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'assignInstaller',
    },
    liasoningId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Liasoning',
    },
    TechnicianDate: {
        type: String,
    },
    MultipleImages: [{
        technicianField: {
            type: String,
        },
        technicianImage: {
            type: String,
        }
    }],
    Amount: {
        type: String,
    },
    Remark: {
        type: String,
    },
    requestStatus: {
        type: String,
        default: "Pending"
    },
    PaymentCreatedAt: {
        type: Date
    },
    submitDate: {
        type: Date,
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('technician', technicianSchema);                
