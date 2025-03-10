const mongoose = require('mongoose');

const dispatchSuggestionSchema = mongoose.Schema({
    ProjectName: {
        type: String,
        require: true
    },
    DispatchDetails: [{
        DispatchCatogory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            require: true
        },
        DispatchSubCatogory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'subCategory',
            require: true
        },
        DispatchProductName: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product',
            require: true
        },
        DispatchDiscription: {
            type: String,
            require: true
        },
        DispatchUnit: {
            type: String,
            require: true,
        },
        DispatchQty: {
            type: String,
            require: true,
        }
    }],
}, {
    timestamps: true,
    versionKey: false
});


module.exports = mongoose.model('DispatchSuggestion', dispatchSuggestionSchema);