const mongoose = require('mongoose');

const accountSchema = mongoose.Schema({
    Dealer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "dealer",
    },
    matketId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "commercialMarketing",
    },
    AccountDetails: [{
        AccountDate: {
            type: String
        },
        AccountAmount: {
            type: String
        },
        AccountRemarks: {
            type: String
        },
        dealerEnteryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "dealer.PaymentDetails",
        }
    }],
    TotalAccountAmount: {
        type: String
    },
    AmountMarket: {
        type: String
    },
    pendingAmount: {
        type: String
    },
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('Account', accountSchema);