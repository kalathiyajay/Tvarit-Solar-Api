const mongoose = require('mongoose');

const roleSchema = mongoose.Schema({
    roleName: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    permissions: {
        type: Array,
        require: true
    }
}, {
    timestamps: true,
    versionKey: false
});


module.exports = mongoose.model('Role', roleSchema);