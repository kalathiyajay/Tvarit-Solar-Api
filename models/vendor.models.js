const mongoose = require('mongoose');

const vendorSchema = mongoose.Schema({
    businessName: {
        type: String,
        require: true
    },
    officeAddress: {
        type: String,
        require: true
    },
    pincode: {
        type: Number,
        require: true
    },
    city: {
        type: String,
        require: true
    },
    state: {
        type: String,
        require: true
    },
    country: {
        type: String,
        require: true
    },
    district : {
        type: String,
        require:true
    },
    companyEmailId: {
        type: String,
        require: true,
        unique: true
    },
    contactPersonalDetails: [{
        contactPersonName: {
            type: String,
            require: true
        },
        designation: {
            type: String,
            require: true
        },
        department: {
            type: String,
            require: true
        },
        contactNumber: {
            type: String,
            require: true
        },
        emailId: {
            type: String,
            require: true,
            unique: true
        }
    }],
    registrationType: {
        type: String,
        enum: ["Registered", "UnRegistered"],
        require: true
    },
    gstNumber: {
        type: String,
        require: true
    },
    panNumber: {
        type: String,
        require: true
    },
    UdyamRegistration: {
        type: String,
        require: true
    },
    vendorType:{
        type:String,
        enum:["Government","Supplier","Transportar","Bank"]
    },
    bankDetails: [{
        bankName: {
            type: String,
            require: true
        },
        branchName: {
            type: String,
            require: true
        },
        accountNumber: {
            type: Number,
            require: true
        },
        accountType: {
            type: String,
            enum: ["Current", "Saving", "CashCredit"],
            require: true
        },
        IFSCCode: {
            type: String,
            require: true
        }
    }]
}, {
    timestamps: true,
    versionKey: false
});


module.exports = mongoose.model('vendor', vendorSchema);