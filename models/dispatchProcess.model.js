const mongoose = require('mongoose');

const dispatchProcessSchema = mongoose.Schema({
    marketId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'commercialmarketings'
    },
    PendingPayment: {
        type: String,
    },
    ProcessData: [{
        generatedNumber: {
            type: String,
        },
        bulkId: {
            type: String,
        },
        PurposeofDispatch: {
            type: String,
            enum: ["Customer Material", "Return Material"],
        },
        DispatchSuggestionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'DispatchSuggestion',
        },
        DispatchDate: {
            type: String,
        },
        DispatchDetails: [{
            DispatchCatogory: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Category',
            },
            DispatchSubCatogory: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'subCategory',
            },
            DispatchProductName: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product',
            },
            DispatchKitId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'KitProduct',
                default: null
            },
            DispatchDiscription: {
                type: String,
            },
            DispatchUnit: {
                type: String,
            },
            DispatchQty: {
                type: String,
            },
        }],
        DebitCreditWarehouseName: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'wareHouse',
        },
        DispatchModelTransport: {
            type: String,
        },
        DispatchRemarks: {
            type: String,
        },
        createProcessDate: {
            type: Date,
            default: Date.now
        },
    }],

}, {
    timestamps: true,
    versionKey: false
});


module.exports = mongoose.model('DispatchProcess', dispatchProcessSchema);