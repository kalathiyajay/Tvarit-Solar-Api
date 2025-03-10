const mongoose = require('mongoose');

const fabricatorSchema = mongoose.Schema({
    assignId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'assignInstaller',
    },
    liasoningId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Liasoning',
    },
    FabricatorDate: {
        type: String,
    },
    MultipleImages: [{
        fabricatorField: {
            type: String,
        },
        fabricatorImage: {
            type: String,
        }
    }],
    fabricatorDetails: [{
        fabricatorCatogory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
        },
        fabricatorSubCatogory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'subCategory',
        },
        fabricatorProductName: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product',
        },
        fabricatorQty: {
            type: String,
        },
    }],
    SystemSize: {
        type: String,
    },
    RateKw: {
        type: String,
    },
    TotalAmount: {
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

module.exports = mongoose.model('fabricator', fabricatorSchema);                
