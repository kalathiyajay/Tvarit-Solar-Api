const mongoose = require('mongoose');

const marketing = mongoose.Schema({
    fillNo: {
        type: String,
    },
    contactPeosonName: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    address: {
        type: String,
    },
    city: {
        type: String,
    },
    district: {
        type: String,
    },
    marketingType: {
        type: String,
        enum: ['CommercialMarketing', 'ResidentialMarketing'],
    },
    pincode: {
        type: Number,
    },
    latitude: {
        type: String,
    },
    amount: {
        type: Number,
    },
    gst: {
        type: Number,
    },
    totalAmount: {
        type: Number,
    },
    bank: {
        type: String,
    },
    consumerNameAsPerLightBill: {
        type: String,
    },
    date: {
        type: String,
    },
    dealerCommission: {
        type: Number,
    },
    consumerNumber: {
        type: Number,
    },
    conectionLoad: {
        type: Number,
    },
    tarrif: {
        type: Number,
    },
    averageMonthlyBill: {
        type: Number,
    },
    gstNumber: {
        type: Number,
    },
    panNumber: {
        type: Number,
    },
    udhyamRegistration: {
        type: Number,
    },
    consumerName: {
        type: String,
    },
    longitude: {
        type: String,
    },
    primaryAccount: {
        type: String,
        require: true
    },
    solarAmount: {
        type: Number,
        require: true
    },
    cashAmount: {
        type: Number,
        require: true
    },
    dealer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "dealer",
        require: true
    },
    dealerPolicy: {
        type: String,
        require: true
    },
    solarModuleMake: {
        type: String,
        require: true
    },
    solarModulWp: {
        type: String,
        require: true
    },
    solarModuleNos: {
        type: String,
        require: true
    },
    systmSizeKw: {
        type: String,
        require: true
    },
    inventrySize: {
        type: String,
        require: true
    }
}, {
    timestamps: true,
});
module.exports = mongoose.model('Marketing',marketing);