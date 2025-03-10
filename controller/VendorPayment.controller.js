const vendorPayment = require('../models/VendorPayment.models');
const purchase = require('../models/purchase.models');

exports.createVendorPayment = async (req, res) => {
    try {
        let { VendorPaymentDetails, VendorpurchaseId, VendorPaymentDate, VendorPaymentAmount, VendorTotalAmount, VendorPendingAmount, VendorPaymentTDS, VendorPaymentTotal, VendorPaymentRemark, StoreAmount } = req.body;

        let checkVendorPayment = await vendorPayment.create({
            VendorpurchaseId,
            VendorPaymentDetails,
            VendorPaymentDate,
            VendorPaymentAmount,
            VendorPaymentTDS,
            VendorPaymentTotal,
            VendorPendingAmount,
            VendorTotalAmount,
            StoreAmount,
            VendorPaymentRemark
        });

        return res.json({ status: 201, message: "Vendor Payment Is Created SuccessFully..", vendorPayment: checkVendorPayment })
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.getAllVendorPayment = async (req, res) => {
    try {
        // let page = parseInt(req.query.page);
        // let pageSize = parseInt(req.query.pageSize);

        // if (page < 1 || pageSize < 1) {
        //     return res.json({ status: 400, message: "Page And PageSize Can't Be Less Then 1" })
        // }

        let paginatedVendorPayment;


        paginatedVendorPayment = await vendorPayment.aggregate([
            {
                $lookup: {
                    from: "stores",
                    localField: "VendorpurchaseId",
                    foreignField: "purchase",
                    as: "vendorPurchaseData"
                }
            }
        ])

        let count = paginatedVendorPayment.length;

        // if (page && pageSize) {
        //     startIndex = (page - 1) * pageSize;
        //     lastIndex = (startIndex + pageSize)
        //     paginatedVendorPayment = paginatedVendorPayment.slice(startIndex, lastIndex)
        // }

        return res.json({ status: 200, TotalVendorPayment: count, message: 'All Vendor Payment Found Successfully..', vendorPayment: paginatedVendorPayment })

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
}

exports.getVendorPaymentById = async (req, res) => {
    try {
        let id = req.params.id;
        let vendorPaymentById = await vendorPayment.findById(id);
        if (!vendorPaymentById) {
            return res.json({ status: 404, message: "Vendor Payment Not Found" })
        }
        res.json({ status: 200, message: "Get Vendor Payment Data Successfully...", credit: vendorPaymentById })
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
}

exports.updateVendorPayment = async (req, res) => {
    try {
        let id = req.params.id;

        let checkVendorPaymentId = await vendorPayment.findById(id);

        if (!checkVendorPaymentId) {
            return res.json({ status: 404, message: "Vendor Payment Not Found" })
        }

        checkVendorPaymentId = await vendorPayment.findByIdAndUpdate(id, { ...req.body }, { new: true });

        return res.json({ status: 200, message: "Vendor Payment Updated Successfully..", vendorPayment: checkVendorPaymentId })
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.deleteVendorPayment = async (req, res) => {
    try {
        let id = req.params.id;

        let checkVendorPaymentId = await vendorPayment.findById(id);

        if (!checkVendorPaymentId) {
            return res.json({ status: 404, message: "Vendor Payment Not Found" })
        }

        await vendorPayment.findByIdAndDelete(id);

        return res.json({ status: 200, message: "Vendor Payment Removed Successfully.." })
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
}

exports.getAllPaymentVendor = async (req, res) => {
    try {

        let paginatedVendorPayment;

        paginatedVendorPayment = await purchase.aggregate([
            {
                $lookup: {
                    from: "stores",
                    localField: "_id",
                    foreignField: "purchase",
                    as: "storeData"
                }
            },
            {
                $lookup: {
                    from: 'warehouses',
                    localField: 'werehouse',
                    foreignField: "_id",
                    as: 'wareHouseDetails'
                }
            },
            {
                $lookup: {
                    from: 'vendors',
                    localField: 'vendor',
                    foreignField: '_id',
                    as: 'vendorDetails'
                }
            },
            {
                $lookup: {
                    from: 'vendorpayments',
                    localField: '_id',
                    foreignField: 'VendorpurchaseId',
                    as: "venderPayments"
                }
            }


        ])

        let count = paginatedVendorPayment.length;


        return res.json({ status: 200, TotalVendorPayment: count, message: 'All Vendor Payment Found Successfully..', purchaseData: paginatedVendorPayment })

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
}