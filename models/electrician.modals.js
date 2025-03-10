const mongoose = require('mongoose');

const electricianSchema = mongoose.Schema({
    assignId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'assignInstaller',
    },
    liasoningId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Liasoning',
    },
    ElectricianDate: {
        type: String,
    },
    // PanelInverterSerialNo: {
    //     type: String,
    // },
    MultipleImages: [{
        electricianField: {
            type: String,
        },
        electricianImage: {
            type: String,
        }
    }],
    electricianDetails: [{
        electricianCatogory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
        },
        electricianSubCatogory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'subCategory',
        },
        electricianProductName: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product',
        },
        electricianQty: {
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

module.exports = mongoose.model('electrician', electricianSchema);                
