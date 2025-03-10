const mongoose = require('mongoose');

const kitProductSchema = mongoose.Schema({
    KitName: {
        type: String,
        require: true
    },
    KitDetails: [{
        KitCatogory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            require: true
        },
        KitSubCatogory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'subCategory',
            require: true
        },
        KitProductName: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product',
            require: true
        },
        KitDiscription: {
            type: String,
            require: true
        },
        KitUnit: {
            type: String,
            require: true,
        },
        KitQty: {
            type: String,
            require: true,
        }
    }],
}, {
    timestamps: true,
    versionKey: false
});


module.exports = mongoose.model('KitProduct', kitProductSchema);