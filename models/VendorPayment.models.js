const mongoose = require('mongoose');

const VendorPaymentSchema = mongoose.Schema({
    VendorpurchaseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Purchase'
    },
    VendorPendingAmount: {
        type: String
    },
    VendorTotalAmount: {
        type: String
    },
    StoreAmount: {
        type: String
    },
    VendorPaymentDetails: [{
        VendorPaymentDate: {
            type: String
        },
        VendorPaymentAmount: {
            type: String
        },
        VendorPaymentTDS: {
            type: String
        },
        VendorPaymentTotal: {
            type: String
        },
        VendorPaymentRemark: {
            type: String
        },
    }],
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('VendorPayment', VendorPaymentSchema);


