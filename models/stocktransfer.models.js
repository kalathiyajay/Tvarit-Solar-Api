const mongoose = require('mongoose');

const stocktransferSchema = mongoose.Schema({
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        require: true
    },
    subCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subcategory",
        require: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        require: true
    },
    description: {
        type: String,
        require: true
    },
    unitofMeasurement: {
        type: String,
        require: true
    },
    quantity: {
        type: String,
        require: true
    },
    debitWarehouseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "warehouse",
        require: true
    },
    creditWarehouseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "warehouse",
        require: true
    },
    pupose: {
        type: String,
        require: true
    },
    modeofTransport: {
        type: String,
        require: true
    },
}, {
    timestamps: true,
    versionKey: false
});


module.exports = mongoose.model('stocktransfer', stocktransferSchema);