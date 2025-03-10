const mongoose = require('mongoose');

const installerPaymentSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    type: {
        type: String,
    },
    // fileDetails: [{
    //     fileNo: {
    //         type: String,
    //     },
    //     amount: {
    //         type: String,
    //     }
    // }],
    monthPeriod: {
        type: String,
    },
    // PaymentDate: {
    //     type: String,
    // },
    // PaymentAmount: {
    //     type: Number,
    // },
    // PaymentTDS: {
    //     type: Number,
    // },
    // PaymentTotal: {
    //     type: Number,
    // },
    status: {
        type: String
    },
    fileDetails: [{
        fileNo: {
            type: String,
        },
        consumerName: {
            type: String,
        },
        systemSize: {
            type: String,
        },
        commissionPerKW: {
            type: String,
        },
        totalCommission: {
            type: String,
        },
        PaymentDate: {
            type: String
        },
        PaymentAmount: {
            type: Number
        },
        PaymentTDS: {
            type: Number
        },
        PaymentTotal: {
            type: Number
        },
    }],
}, {
    timestamps: true,
    versionKey: false
});


module.exports = mongoose.model('installerpayments', installerPaymentSchema);