const mongoose = require('mongoose')

const slideBarCategorySchema = mongoose.Schema({
    categoryName: {
        type: String,
        require: true
    },
    slideBarImage: {
        type: String,
        require: true
    },
    to: {
        type: String,
    },
    slideBarCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'slideBarCategory',
    },
    subsidebaradd: [{
        subcategoryimages: {
            type: String,
        },
        subcategoryName: {
            type: String,
        }
    }]
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('SlideBarCategory', slideBarCategorySchema)