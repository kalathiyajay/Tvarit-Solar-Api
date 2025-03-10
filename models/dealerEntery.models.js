const mongoose = require('mongoose');

const dealerSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    fillNo: {
        type: String,
    },
    ConsumerName: {
        type: String,
        required: true
    },
    country: {
        type: String,
        require: true
    },
    state: {
        type: String,
        require: true
    },
    district: {
        type: String,
        require: true
    },
    City_Village: {
        type: String,
        require: true
    },
    MarketingType: {
        type: String,
        enum: ["Commercial", "Residential"],
        require: true,
    },
    SystemSize: {
        type: String,
    },
    SolarModule: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
    },
    SolarInverter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
    },
    MultipleDetails: [
        {
            inputField: {
                type: String,
            },
            dealerImage: {
                type: String,
            }
        }
    ],
    PhoneNumber: {
        type: String,
        require: true
    },
    amount: {
        type: Number,
        require: true
    },
    status: {
        type: String,
        enum: ["Pending", "Completed"],
        default: "Pending"
    },
    isDisabled: {
        type: Boolean,
        default: false
    },
    dealerCommission: {
        type: String,
    },

    dealerCommissionStatus: {
        type: String,
        default: "Pending"
    },

    dealerPaymentStatus: {
        type: String,
        default: "Pending"
    },

    commisionCreatedAt: {
        type: Date
    },

    submitDate: {
        type: Date
    },
    
    requestStatus: {
        type: String,
        default: "Pending"
    },
    boxStatus: {
        type: String,
        default: "Enabled"
    },
    PaymentDetails: [{
        PaymentSRNo: {
            type: String
        },
        PaymentDate: {
            type: String
        },
        PaymentMode: {
            type: String,
            enum: ["Cash in Account", "Cash", "Cheque", "Net Banking", "UPI"],
        },
        PaymentAmount: {
            type: String
        },
        PaymentRefNO: {
            type: String
        },
        UploadPaymentSlip: {
            type: String,
        },
        PaymentRemarks: {
            type: String,
        }
    }]
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('dealer', dealerSchema);                
