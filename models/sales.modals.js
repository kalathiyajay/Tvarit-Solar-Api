const mongoose = require('mongoose')

const salesSchema = mongoose.Schema({
    QuotationNo: {
        type: String,
    },
    bomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bom'
    },
    Date: {
        type: String,
    },
    customerName: {
        type: String,
    },
    location: {
        type: String,
    },
    TypesOfProject: {
        type: String,
        enum: ["Residential Individual", "Residential Comman Meter", "Commercial with Large BOM", "Commercial with Small BOM"],
    },
    systemSize: {
        type: String,
    },
    SalesDetails: [{
        salescategory: {
            // type: mongoose.Schema.Types.ObjectId,
            // ref: 'Category',
            type: String,
        },
        salessubcategory: {
            // type: mongoose.Schema.Types.ObjectId,
            // ref: 'subCategory',
            type: String,
        },
        salesproduct: {
            // type: mongoose.Schema.Types.ObjectId,
            // ref: 'product',
            type: String,
        },
        salesmake: {
            type: String,
        },
        salesspecifiaction: {
            type: String,
        },
    }],
    Amount1: {
        type: String,
    },
    Amount2: {
        type: String,
    },
    Amount3: {
        type: String,
    },
    Amount4: {
        type: String,
    },
    Amount5: {
        type: String,
    },
    Amount6: {
        type: String,
    },
    terms: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TermsAndConditions'
    }],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('Sales', salesSchema);