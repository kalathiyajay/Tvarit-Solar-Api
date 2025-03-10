const purchase = require('../models/purchase.models');
const srNoTracker = require('../models/srNoTrackerModles');
const user = require("../models/user.models")
const product = require('../models/product.models')
const vendor = require('../models/vendor.models')
const termsAndCondition = require('../models/termsAndCondition')
const wareHouse = require('../models/warehouse.model');


async function generatesrNo() {
    const currentDate = new Date();

    let financialYear;

    if (currentDate.getMonth() >= 3) {
        financialYear = `${currentDate.getFullYear()}-${(currentDate.getFullYear() + 1).toString().slice(-2)}`;
    } else {
        financialYear = `${currentDate.getFullYear() - 1}-${currentDate.getFullYear().toString().slice(-2)}`;
    }
    let tracker = await srNoTracker.findOne({ financialYear });

    if (!tracker) {

        tracker = new srNoTracker({
            prefix: 'TEL',
            lastSequenceNumber: 0,
            financialYear
        });
        await tracker.save();
    }

    let sequenceNumber = tracker.lastSequenceNumber + 1;

    if (sequenceNumber > 9999) {
        sequenceNumber = 1;
    }

    let formattedSequenceNumber = sequenceNumber.toString().padStart(4, '0');

    tracker.lastSequenceNumber = sequenceNumber;
    await tracker.save();

    return `${tracker.prefix}/${financialYear}/${formattedSequenceNumber}`;
}

exports.createNewPurchase = async (req, res) => {
    try {
        let { SrNo, vendor, PurchaseDate, werehouse, multipledata, productName, filledSteps, description, HSHCode, Qty, unitPrice, total, gst, gstAmount = 0, taxableAmount = 0, totalGstAmount = 0, amountTotal = 0, terms } = req.body;

        // let checkPurchasedata = await purchase.findOne({ SrNo:SrNo })

        // if (checkPurchasedata) {
        //     return res.status(401).json({ status: 401, message: "Purchase already exists" })
        // }

        // if (!SrNo) {
        //     SrNo = await generatesrNo();
        // }

        // let totalAmount = Qty * unitPrice

        // let gstTotalAmount = totalAmount * gst / 100

        // taxableAmount += totalAmount;
        // gstAmount += gstTotalAmount

        // totalGstAmount += gstTotalAmount;

        // amountTotal = taxableAmount + totalGstAmount

        let checkPurchasedata = await purchase.create({
            SrNo,
            vendor,
            PurchaseDate,
            werehouse,
            multipledata,
            productName,
            description,
            HSHCode,
            Qty,
            unitPrice,
            // total: totalAmount,
            total,
            gst,
            // gstAmount: gstTotalAmount,
            gstAmount,
            taxableAmount,
            totalGstAmount,
            amountTotal,
            filledSteps,
            terms
        });

        return res.status(201).json({ status: 201, message: "Purchase created successfully", purchase: checkPurchasedata })

    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.getAllPurchaseData = async (req, res) => {
    try {

        let page = parseInt(req.query.page);
        let pageSize = parseInt(req.query.pageSize)

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: "Page And PageSize Cann't Be Less than 1" })
        }

        let paginatedPurchase;
        // paginatedPurchase = await purchase.find();

        paginatedPurchase = await purchase.aggregate([
            {
                $lookup: {
                    from: 'stores',
                    localField: '_id',
                    foreignField: 'purchase',
                    as: 'purchaseDetails'
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'multipledata.productName',
                    foreignField: '_id',
                    as: 'productData'
                }
            },
            {
                $lookup: {
                    from: 'termsandconditions',
                    localField: 'terms',
                    foreignField: '_id',
                    as: 'termsDetails'
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

        let count = paginatedPurchase.length;

        // if (count === 0) {
        //     return res.status(404).json({ status: 404, message: "Purchase Data Not Found" })
        // }

        if (page && pageSize) {
            startIndex = (page - 1) * pageSize;
            lastIndex = (startIndex + pageSize);
            paginatedPurchase = paginatedPurchase.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, totalPurchase: count, message: "All Purchase Found SuccessFully", purchase: paginatedPurchase })

    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.getPurchaseById = async (req, res) => {
    try {
        let id = req.params.id;

        let checkPurchase = await purchase.findById(id);

        if (!checkPurchase) {
            return res.status(404).json({ status: 404, message: "Purchase Not Found." })
        }

        return res.status(200).json({ status: 200, message: "Purchase Found SuccessFully...", purchase: checkPurchase });

    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
        console.log(error);
    }
};


exports.updatePurchaseData = async (req, res) => {
    try {
        let id = req.params.id;

        let updatePurchase = await purchase.findById(id);

        if (!updatePurchase) {
            return res.status(404).json({ status: 404, message: "Purchase Not Found" })
        }

        let newQty = updatePurchase.Qty;
        let newUnitPrice = updatePurchase.unitPrice;
        let newGst = updatePurchase.gst;

        if (req.body.Qty !== undefined) {
            newQty = req.body.Qty;
        }
        if (req.body.unitPrice !== undefined) {
            newUnitPrice = req.body.unitPrice;
        }
        if (req.body.gst !== undefined) {
            newGst = req.body.gst;
        }

        // let newTotalAmount = newQty * newUnitPrice;
        // let newGstAmount = newTotalAmount * newGst / 100;
        // let newTotalGstAmount = newTotalAmount + newGstAmount;
        // let newTaxableAmount = newTotalAmount;

        // req.body.total = newTotalAmount;
        // req.body.gstAmount = newGstAmount;
        // req.body.taxableAmount = newTaxableAmount;
        // req.body.totalGstAmount = newGstAmount;
        // req.body.amountTotal = newTotalGstAmount

        updatePurchase = await purchase.findByIdAndUpdate(id, { ...req.body }, { new: true });

        return res.status(200).json({ status: 200, message: "Purchase Updated SuccessFully...", purchase: updatePurchase });

    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.deletePurchase = async (req, res) => {
    try {
        let id = req.params.id;

        let deletepurchase = await purchase.findById(id);

        if (!deletepurchase) {
            return res.status(404).json({ status: 404, message: "Purchasee Not Found" })
        }

        await purchase.findByIdAndDelete(id);

        return res.status(200).json({ status: 200, message: "Purchase Deleted SuccessFully..." });

    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
        console.log(error);
    }
}

exports.deletePurchaseDetailsById = async (req, res) => {
    try {
        let id = req.params.id;

        let purchaseDetailsId = await purchase.findOne({ "multipledata._id": id })

        if (!purchaseDetailsId) {
            return res.status(404).json({ status: 404, message: "Purchase Details Data Not Found" })
        }

        purchaseDetailsId = await purchase.findOneAndUpdate(
            { "multipledata._id": id },
            { $pull: { multipledata: { _id: id } } },
            { new: true }
        )

        return res.status(200).json({ status: 200, message: "Purchase Details Delete SuccessFully..." })

    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
        console.log(error);
    }
}


exports.getAllPurchaseWarehouse = async (req, res) => {
    try {
        let allWarehouse = await wareHouse.find();

        if (!allWarehouse) {
            return res.status(404).json({ status: 404, message: "User Not Found" })
        }

        return res.status(200).json({ status: 200, message: "All Warehouse User Found SuccessFully...", warehouses: allWarehouse })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllPurchaseProduct = async (req, res) => {
    try {
        // let allProducts = await product.aggregate([
        //     // {
        //     //     $project: {
        //     //         productName: 1
        //     //     }
        //     // }
        // ])

        let allProducts = await product.aggregate([
            {
                $lookup: {
                    from: 'categories',
                    localField: "mainCategory",
                    foreignField: "_id",
                    as: "mainCategoryData"
                }
            },
            {
                $lookup: {
                    from: 'subcategories',
                    localField: "subCategory",
                    foreignField: "_id",
                    as: "subCategoryData"
                }
            }
        ])

        if (!allProducts) {
            return res.status(404).json({ status: 404, message: "All Product Not Found" })
        }

        return res.status(200).json({ status: 200, message: "All Product Found SuccessFully...", products: allProducts })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllPurchaseVendor = async (req, res) => {
    try {
        let allVandor = await vendor.find({})

        if (!allVandor) {
            return res.status(404).json({ status: 404, message: "Vendor Not Found" })
        }

        return res.status(200).json({ status: 200, message: "All Vendor Found SuccessFully...", vendor: allVandor })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllTermsAndCondition = async (req, res) => {
    try {
        let allTerms = await termsAndCondition.find()

        if (!allTerms) {
            return res.status(404).json({ status: 404, message: "Terms And Condition Not Found" })
        }

        return res.status(200).json({ status: 200, message: "Terms And Condition Found SuccessFully...", terms: allTerms })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}
