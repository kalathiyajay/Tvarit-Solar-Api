const mongoose = require('mongoose');

const liasoningSchema = mongoose.Schema({
    marketId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "commercialMarketing",
    },
    fillNo: {
        type: String,
        // require: true
    },
    filledSteps: {
        type: [String], // or [Number], depending on what type of data you're storing
        default: []
    },
    fileDate: {
        type: String,
        // require: true
    },
    fileNo: {
        type: String,
        // require: true
    },
    FQPayment: {
        type: String,
        // require: true
    },
    AmountL: {
        type: Number,
        // require: true
    },
    AmountDate: {
        type: String,
        // require: true
    },
    SerialNumber: {
        type: String,
        // require: true
    },
    SerialNumberDate: {
        type: String,
        // require: true
    },
    Dealer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "dealer",
        require: true
    },
    PhoneNumber: {
        type: String,
        require: true
    },
    CheckBox1: {
        type: Boolean,
        // require: true
    },
    CheckBox2: {
        type: Boolean,
        // require: true
    },
    CheckBox3: {
        type: Boolean,
        // require: true
    },
    CheckBox4: {
        type: Boolean,
        // require: true
    },
    CheckBox5: {
        type: Boolean,
        // require: true
    },
    CheckBox1date: {
        type: String,
        // require: true
    },
    CheckBox2date: {
        type: String,
        // require: true
    },
    CheckBox3date: {
        type: String,
        // require: true
    },
    CheckBox4date: {
        type: String,
        // require: true
    },
    CheckBox5date: {
        type: String,
        // require: true
    },
    Query1: {
        type: String,
        // require: true
    },
    Query2: {
        type: String,
        // require: true
    },
    Query3: {
        type: String,
        // require: true
    },
    Query4: {
        type: String,
        // require: true
    },
    Query5: {
        type: String,
        // require: true
    },
    User_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    status: {
        type: String,
        enum: ["Disabled", "Enabled"],
        default: "Disabled"
    },
    applicationStatus: {
        type: String,
        enum: [
            'APPLICATION PENDING',
            'APPLICATION SUBMITTED',
            'FQ STATUS',
            'FQ PAID',
            'SITE DETAILS',
            'NET METER DOCUMENT UPLOAD',
            'NET METER DOCUMENT QUERIER',
            'NET METER INSTALL',
            'SUBSIDY CLAIM PROCESS',
            'SUBSIDY RECEIVED STATUS'
        ],
        default: 'APPLICATION PENDING'
    },
    submissionTime: {
        type: Date,
    },
    targetStatusChangeTime: {
        type: Date,
    },
    subSidyCalaimSetDate: {
        type: Date,
    },
    subSidyCalaimStatusChangeTime: {
        type: Date,
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('Liasoning', liasoningSchema); 