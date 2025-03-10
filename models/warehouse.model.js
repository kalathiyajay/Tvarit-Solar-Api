const mongoose = require('mongoose');

const wareHouseSchema = mongoose.Schema({
    wareHouseCode: {
        type: String,
        require: true
    },
    wareHouseName: {
        type: String,
        require: true
    },
    contactPersonName: {
        type: String,
        require: true
    },
    contactNumber: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    address: {
        type: String,
        require: true
    },
    pincode: {
        type: Number,
        require: true
    },
    state: {
        type: String,
        require: true
    },
    city: {
        type: String,
        require: true
    },
    country: {
        type: String,
        require: true
    },
    district: {
        type: String,
        require: true
    }
}, {
    timestamps: true,
    versionKey: false
});


module.exports = mongoose.model('wareHouse', wareHouseSchema);