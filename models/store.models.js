const mongoose = require('mongoose');

const storeSchema = mongoose.Schema({
    multipleQty: [{
        TotalQty: {
            type: Number,
        },
        recieveQtyforstore: {
            type: Number,
        },
        recieveQty: {
            type: Number,
        },
        total: {
            type: Number,
        },
        productName: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product'
        },
        unitPrice: {
            type: Number,
        },
        recieveunitPrice: {
            type: Number,
        },
        GSTAmount: {
            type: Number,
        },
        dispatchDetailId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'DispatchProcess.DispatchDetails'
        }
    }],
    warehouseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'purchase'
    },
    storedate: {
        type: String,
    },
    Invoicenumber: {
        type: String,
    },
    Invoicedate: {
        type: String,
    },
    TransporterName: {
        type: String,
    },
    LRNumber: {
        type: String,
    },
    DriverName: {
        type: String,
    },
    DriverContactNumber: {
        type: String,
    },
    VehicleNumber: {
        type: String,
    },
    EwayBillNumber: {
        type: String,
    },
    Frieght: {
        type: String,
    },
    Remark: {
        type: String,
    },
    storeuploadFile: {
        type: String,
    },
    purchase: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Purchase'
    },
    taxableAmount: {
        type: String,
    },
    totalGstAmount: {
        type: String,
    },
    amountTotal: {
        type: String,
    },
}, {
    timestamps: true,
    versionKey: false
});


module.exports = mongoose.model('store', storeSchema);