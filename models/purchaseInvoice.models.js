const mongoose = require('mongoose');

const purchaseInvoiceSchema = mongoose.Schema({
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'vendor',
        require: true
    },
    date: {
        type: String,
        require: true
    },
    srNo: {
        type: String,
        require: true
    },
    itemCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        require: true
    },
    itemSubCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subCategory',
        require: true
    },
    totalAmount: {
        type: Number,
        require: true
    },
    wareHouse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'wareHouse',
        require: true
    },
    amount: {
        type: Number,
        require: true
    },
    uplodFile: {
        type: String,
        require: true
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('PurchaseInvoice', purchaseInvoiceSchema)