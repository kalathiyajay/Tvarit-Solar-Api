const mongoose = require('mongoose');

const purchaseInvoiceSchema = mongoose.Schema({
    // filledSteps: {
    //     type: [String], // or [Number], depending on what type of data you're storing
    //     default: []
    // },
    SrNo: {
        type: String,
        require: true
    },
    PurchaseDate: {
        type: String,
        require: true
    },
    multipledata: [{
        productName: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product'
        },
        description: {
            type: String,
            require: true
        },
        HSHCode: {
            type: String,
            require: true
        },
        Qty: {
            type: String,
            require: true
        },
        unitPrice: {
            type: String,
            require: true,
        },
        total: {
            type: Number,
            require: true
        },
        gst: {
            type: Number,
            require: true
        },
        gstAmount: {
            type: Number,
            require: true
        }
    }],
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'vendor'
    },
    werehouse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'wareHouse'
    },
    taxableAmount: {
        type: Number,
        require: true
    },
    totalGstAmount: {
        type: Number,
        require: true
    },
    amountTotal: {
        type: Number,
        require: true
    },
    terms: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TermsAndConditions'
    }]
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('Purchase', purchaseInvoiceSchema)