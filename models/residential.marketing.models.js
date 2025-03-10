const mongoose = require('mongoose');

const residentialMarketingSchema = mongoose.Schema({
    // fillNo: {
    //     type: String,
    //     require: true
    // },
    // consumerName: {
    //     type: String,
    //     require: true
    // },
    // phoneNumber: {
    //     type: String,
    //     require: true
    // },
    // consumerNumber: {
    //     type: String,
    //     require: true
    // },
    // address: {
    //     type: String,
    //     require: true
    // },
    // city: {
    //     type: String,
    //     require: true
    // },
    // district: {
    //     type: String,
    //     require: true
    // },
    // pincode: {
    //     type: Number,
    //     require: true
    // },
    // latitude: {
    //     type: String,
    //     require: true
    // },
    // longitude: {
    //     type: String,
    //     require: true
    // },
    // marketingType: {
    //     type: String,
    //     require: true
    // },
    // primaryAccount: {
    //     type: String,
    //     require: true
    // },
    // date: {
    //     type: String,
    //     require: true
    // },
    // solarAmount: {
    //     type: Number,
    //     require: true
    // },
    // cashAmount: {
    //     type: Number,
    //     require: true
    // },
    // dealer: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "dealer",
    //     require: true
    // },
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
    versionKey: false
});

module.exports = mongoose.model('residentialMarketing', residentialMarketingSchema); 