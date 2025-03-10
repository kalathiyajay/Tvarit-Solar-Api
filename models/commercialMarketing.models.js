const mongoose = require('mongoose');
const { stringify } = require('uuid');

const commercialMarketingSchema = mongoose.Schema({
    fillNo: {
        type: String,
    },
    PhoneNumber: {
        type: String,
    },
    Address: {
        type: String,
    },
    country: {
        type: String,
    },
    state: {
        type: String,
    },
    district: {
        type: String,
    },
    City_Village: {
        type: String,
    },
    District_Location: {
        type: String,
    },
    Pincode: {
        type: String,
    },
    Latitude: {
        type: String,
    },
    Longitude: {
        type: String,
    },
    Amount: {
        type: String,
    },
    GST: {
        type: String,
    },
    TotalAmount: {
        type: String,
    },
    Date: {
        type: String,
    },
    Dealer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "dealer",
    },
    ProductName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
    },
    // DealerCommission: {
    //     type: String,
    // },
    ConsumerNumber: {
        type: String,
    },
    ConnectionLoad: {
        type: String,
    },
    Tarrif: {
        type: String,
    },
    AverageMonthlyBill: {
        type: String,
    },
    GSTNumber: {
        type: String,
    },
    PanNumber: {
        type: String,
    },
    MSME_UdyamREGISTRATION: {
        type: String,
    },
    ConsumerName: {
        type: String,
    },
    ContactPersonName: {
        type: String,
    },
    PrimaryAmount: {
        type: String,
    },
    CashAmount: {
        type: String,
    },
    CommissionPerKW: {
        type: String,
    },
    TotalCommission: {
        type: String,
    },
    SolarModuleMake: {
        type: String,
    },
    SolarModuleWp: {
        type: String,
    },
    SolarModuleNos: {
        type: String,
    },
    SystemSizeKw: {
        type: String,
    },
    InverterSize: {
        type: String,
    },
    DealerPolicy: {
        type: String,
    },
    MarketingType: {
        type: String,
        enum: ["Commercial", "Residential"],
    },
    Phase: {
        type: Number
    },
    feasibilityStatus: {
        type: String,
    },
    MultipleDetails: [{
        inputField: {
            type: String,
        },
        dealerImage: {
            type: String,
        }
    }],
    status: {
        type: String,
        enum: ["Pending", "Completed"],
        default: "Completed"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    InverterModuleWp: {
        type: String,
    },
    InverterModuleMake: {
        type: String,
    },
    InverterName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
    },
    amount: {
        type: String,
    },
    WarehouseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "wareHouse",
    },
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('commercialmarketings', commercialMarketingSchema); 