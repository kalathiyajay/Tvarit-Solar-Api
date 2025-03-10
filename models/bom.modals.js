const mongoose = require('mongoose')

const bomSchema = mongoose.Schema({
    Date: {
        type: String,
    },
    BOMName: {
        type: String,
    },
    bomsuggestion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bom',
    },
    TypesOfProject: {
        type: String,
        enum: ["Residential Individual", "Residential Comman Meter", "Commercial with Large BOM", "Commercial with Small BOM"],
    },
    systemSize: {
        type: String,
    },
    BomDetails: [{
        bomcategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
        },
        bomsubcategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'subCategory',
        },
        bomproduct: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product',
        },
        bomdescription: {
            type: String,
        },
        bomqty: {
            type: String,
        },
        bomlastprice: {
            type: String,
        },
        bomamount: {
            type: String,
        },
    }],
    Remarks1: {
        type: String,
    },
    Remarks2: {
        type: String,
    },
    Remarks3: {
        type: String,
    },
    Remarks4: {
        type: String,
    },
    Remarks5: {
        type: String,
    },
    Remarks6: {
        type: String,
    },
    SystemSize1: {
        type: String,
    },
    SystemSize2: {
        type: String,
    },
    SystemSize3: {
        type: String,
    },
    SystemSize5: {
        type: String,
    },
    SystemSize6: {
        type: String,
    },
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
    unitprice1: {
        type: String,
    },
    unitprice2: {
        type: String,
    },
    unitprice3: {
        type: String,
    },
    unitprice4: {
        type: String,
    },
    unitprice5: {
        type: String,
    },
    unitprice6: {
        type: String,
    },
    // terms: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'TermsAndConditions'
    // }],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
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
    subcidy: {
        type: String,
    },
    Total: {
        type: String,
    },
    PriceAfterSubcidy: {
        type: String,
    },
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('Bom', bomSchema);