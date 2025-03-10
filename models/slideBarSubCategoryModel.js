const mongoose = require('mongoose')

const slideBarSubCategorySchema = mongoose.Schema({
    slideBarCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'slideBarCategory',
        required: true
    },
    slideBarSubCategoryName: {
        type: String,
        require: true
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('SlideBarSubCategory', slideBarSubCategorySchema)