const mongoose = require('mongoose');

const subCategoryesSchema = mongoose.Schema({
    categoryName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        require: true
    },
    subCategoryName: {
        type: String,
        require: true
    },
    unit: {
        type: String,
        require: true
    }
}, {
    timestamps: true,
    versionKey: false
});


module.exports = mongoose.model('subCategory', subCategoryesSchema);