const mongoose = require('mongoose')

const termsAndConditionSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    TermsType: {
        type: String,
        enum: ["Sales", "Purchase"],
        require: true,
    },
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('TermsAndConditions', termsAndConditionSchema);