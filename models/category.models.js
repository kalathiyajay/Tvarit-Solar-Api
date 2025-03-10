const mongoose = require('mongoose');

const categoryesSchema = mongoose.Schema({
    categoryName: {
        type: String,
        require: true
    },
}, {
    timestamps: true,
    versionKey: false
});


module.exports = mongoose.model('Category', categoryesSchema);