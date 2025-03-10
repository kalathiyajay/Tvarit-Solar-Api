const mongoose = require('mongoose');

const DealerPaymentSchema = mongoose.Schema({
    DealerPaymentInvoiceNo: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    dealermonth: {
        type: String
    },
    status: {
        type: String
    },
    DealerPaymentDetails: [{
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
        DealerPaymentDate: {
            type: String
        },
        DealerPaymentAmount: {
            type: Number
        },
        DealerPaymentTDS: {
            type: Number
        },
        DealerPaymentTotal: {
            type: Number
        },
    }],
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('DealerPayment', DealerPaymentSchema);


