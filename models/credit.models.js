const mongoose = require('mongoose');

const creditSchema = mongoose.Schema({
    srNo: {
        type: String,
        require: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        require: true
    },
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subCategory",
        require: true
    },
    description: {
        type: String,
        require: true
    },
    vender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "vender",
        require: true
    },
    date: {
        type: String,
        require: true
    },
    Kw: {
        type: String,
        require: true
    },
    address: {
        type: String,
        require: true
    },
    consumerNo: {
        type: String,
        require: true
    },
    dealer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "dealer",
        require: true
    },
    quantity: {
        type: Number,
        require: true
    },
    wareHouse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "wareHouse",
        require: true
    },
    amount: {
        type: Number,
        require: true
    },
    gst: {
        type: Number,
        require: true
    },
    totalAmount: {
        type: Number,
        require: true
    },
    unitPrice: {
        type: Number,
        require: true
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('credit', creditSchema);