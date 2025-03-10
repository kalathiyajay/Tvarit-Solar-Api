const store = require('../models/store.models')
const User = require('../models/user.models')
const product = require('../models/product.models')
const purchase = require('../models/purchase.models')
const wareHouse = require('../models/warehouse.model')
const role = require('../models/role.models')

exports.createstore = async (req, res) => {
    try {
        let { multipleQty, warehouseId, recieveunitPrice, recieveQty, recieveQtyforstore, TotalQty, storeuploadFile, amountTotal, totalGstAmount, productName, taxableAmount, unitPrice, storedate, Invoicenumber, DriverContactNumber, total, Invoicedate, TransporterName, LRNumber, DriverName, VehicleNumber, EwayBillNumber, Frieght, Remark, purchase } = req.body;

        // console.log("req.body", req.body.multipleQty);

        // let checkstore = await store.findOne({ purchase })

        // if (checkstore) {
        //     return res.status(409).json({ status: 409, message: "Store Alredy Added" })
        // }

        if (!req.file) {
            return res.status(401).json({ status: 401, message: "Store Image File Required" })
        }

        let checkstore = await store.create({
            multipleQty,
            recieveQty,
            recieveQtyforstore,
            recieveunitPrice,
            total,
            productName,
            unitPrice,
            storeuploadFile: req.file.path,
            storedate,
            DriverContactNumber,
            Invoicenumber,
            Invoicedate,
            TransporterName,
            LRNumber,
            DriverName,
            VehicleNumber,
            EwayBillNumber,
            Frieght,
            purchase,
            Remark,
            amountTotal,
            totalGstAmount,
            taxableAmount,
            TotalQty, warehouseId
        });

        return res.status(201).json({ status: 201, message: "Store Created SuccessFully...", store: checkstore })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllstore = async (req, res) => {
    try {

        let page = parseInt(req.query.page)
        let pageSize = parseInt(req.query.pageSize)

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: "Page And PageSize Can't Be Less Than 1" })
        }

        let paginatedstore;

        paginatedstore = await store.find()

        let count = paginatedstore.length

        if (page && pageSize) {
            let startIndex = (page - 1) * pageSize;
            let lastIndex = (startIndex + pageSize)
            paginatedstore = await paginatedstore.slice(startIndex, lastIndex);
        }
        // console.log(paginatedstore);

        return res.status(200).json({ status: 200, store: count, message: "All Store Found SuccessFully...", store: paginatedstore })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}


exports.getAllstoreItems = async (req, res) => {
    // try {
    //     let page = parseInt(req.query.page);
    //     let pageSize = parseInt(req.query.pageSize);

    //     if (page < 1 || pageSize < 1) {
    //         return res.status(400).json({ status: 400, message: "Page and PageSize can't be less than 1" });
    //     }

    //     let status = false

    //     let getRoleId = await role.findById(req.user.role)
    //     console.log(getRoleId);

    //     if (getRoleId.roleName === 'Super Admin') {
    //         status = true
    //     }

    //     let paginatedStore = await store.aggregate([
    //         {
    //             $lookup: {
    //                 from: "warehouses",
    //                 localField: "warehouseId",
    //                 foreignField: "_id",
    //                 as: "warehouseData"
    //             }
    //         },
    //         { $unwind: "$warehouseData" },
    //         { $unwind: "$multipleQty" },
    //         {
    //             $lookup: {
    //                 from: "storetransfers",
    //                 let: { productId: "$multipleQty.productName", warehouseId: "$warehouseData._id" },
    //                 pipeline: [
    //                     {
    //                         $match: {
    //                             $expr: {
    //                                 $and: [
    //                                     { $eq: ["$productId", "$$productId"] },
    //                                     {
    //                                         $or: [
    //                                             { $eq: ["$debitWarehouse", "$$warehouseId"] },
    //                                             { $eq: ["$creditWarehouse", "$$warehouseId"] }
    //                                         ]
    //                                     }
    //                                 ]
    //                             }
    //                         }
    //                     }
    //                 ],
    //                 as: "storeTransfers"
    //             }
    //         },
    //         {
    //             $addFields: {
    //                 transferQty: {
    //                     $reduce: {
    //                         input: "$storeTransfers",
    //                         initialValue: 0,
    //                         in: {
    //                             $cond: [
    //                                 { $eq: ["$$this.debitWarehouse", "$warehouseData._id"] },
    //                                 { $subtract: ["$$value", { $toDouble: "$$this.qty" }] },
    //                                 { $add: ["$$value", { $toDouble: "$$this.qty" }] }
    //                             ]
    //                         }
    //                     }
    //                 }
    //             }
    //         },
    //         {
    //             $group: {
    //                 _id: {
    //                     productName: "$multipleQty.productName",
    //                     storeId: "$_id",
    //                     warehouseId: "$warehouseData._id"
    //                 },
    //                 totalRecieveQty: {
    //                     $sum: {
    //                         $add: [
    //                             { $toDouble: "$multipleQty.recieveQty" },
    //                             "$transferQty"
    //                         ]
    //                     }
    //                 },
    //                 minUnitPrice: { $min: { $toDouble: "$multipleQty.recieveunitPrice" } },
    //                 maxUnitPrice: { $max: { $toDouble: "$multipleQty.recieveunitPrice" } },
    //                 totalUnitPrice: {
    //                     $sum: {
    //                         $multiply: [
    //                             { $toDouble: { $ifNull: ["$multipleQty.recieveQty", 0] } },
    //                             { $toDouble: { $ifNull: ["$multipleQty.recieveunitPrice", 0] } }
    //                         ]
    //                     }
    //                 },
    //                 totalGSTAmount: {
    //                     $sum: {
    //                         $multiply: [
    //                             { $toDouble: { $ifNull: ["$multipleQty.recieveQty", 0] } },
    //                             { $toDouble: { $ifNull: ["$multipleQty.recieveunitPrice", 0] } },
    //                             { $divide: [{ $toDouble: { $ifNull: ["$multipleQty.GSTAmount", 0] } }, 100] }
    //                         ]
    //                     }
    //                 },
    //                 storeData: { $first: "$$ROOT" }
    //             }
    //         },
    //         {
    //             $group: {
    //                 _id: "$_id.productName",
    //                 stores: {
    //                     $push: {
    //                         storeId: "$_id.storeId",
    //                         warehouseId: "$_id.warehouseId",
    //                         totalRecieveQty: "$totalRecieveQty",
    //                         minUnitPrice: "$minUnitPrice",
    //                         maxUnitPrice: "$maxUnitPrice",
    //                         totalUnitPrice: "$totalUnitPrice",
    //                         totalGSTAmount: "$totalGSTAmount",
    //                         storeData: "$storeData"
    //                     }
    //                 },
    //                 totalRecieveQty: { $sum: "$totalRecieveQty" },
    //                 minUnitPrice: { $min: "$minUnitPrice" },
    //                 maxUnitPrice: { $max: "$maxUnitPrice" },
    //                 totalUnitPrice: { $sum: "$totalUnitPrice" },
    //                 totalGSTAmount: { $sum: "$totalGSTAmount" }
    //             }
    //         },
    //         {
    //             $lookup: {
    //                 from: "products",
    //                 localField: "_id",
    //                 foreignField: "_id",
    //                 as: "productDetails"
    //             }
    //         },
    //         {
    //             $unwind: "$productDetails"
    //         },
    //         {
    //             $lookup: {
    //                 from: "categories",
    //                 localField: "productDetails.mainCategory",
    //                 foreignField: "_id",
    //                 as: "categoryDetails"
    //             }
    //         },
    //         {
    //             $unwind: { path: "$categoryDetails", preserveNullAndEmptyArrays: true }
    //         },
    //         {
    //             $lookup: {
    //                 from: "subcategories",
    //                 localField: "productDetails.subCategory",
    //                 foreignField: "_id",
    //                 as: "subCategoryDetails"
    //             }
    //         },
    //         {
    //             $unwind: { path: "$subCategoryDetails", preserveNullAndEmptyArrays: true }
    //         },
    //         {
    //             $addFields: {
    //                 productName: "$productDetails.productName",
    //                 Desacription: "$productDetails.Desacription",
    //                 unitOfMeasurement: "$productDetails.unitOfMeasurement",
    //                 categoryId: "$productDetails.categoryId",
    //                 categoryName: "$categoryDetails.categoryName",
    //                 subCategoryId: "$productDetails.subCategoryId",
    //                 subCategoryName: "$subCategoryDetails.subCategoryName",
    //             }
    //         },
    //         {
    //             $addFields: {
    //                 productId: "$_id",
    //                 avgUnitPrice: {
    //                     $cond: [
    //                         { $eq: ["$totalRecieveQty", 0] },
    //                         0,
    //                         { $divide: ["$totalUnitPrice", "$totalRecieveQty"] }
    //                     ]
    //                 },
    //                 finalAmount: { $add: ["$totalUnitPrice", "$totalGSTAmount"] },
    //                 storeDetails: {
    //                     $map: {
    //                         input: "$stores",
    //                         as: "store",
    //                         in: {
    //                             storeId: "$$store.storeId",
    //                             warehouseId: "$$store.warehouseId",
    //                             totalRecieveQty: "$$store.totalRecieveQty",
    //                             storedate: "$$store.storeData.storedate",
    //                             Invoicenumber: "$$store.storeData.Invoicenumber",
    //                             Invoicedate: "$$store.storeData.Invoicedate",
    //                             TransporterName: "$$store.storeData.TransporterName",
    //                             LRNumber: "$$store.storeData.LRNumber",
    //                             DriverName: "$$store.storeData.DriverName",
    //                             DriverContactNumber: "$$store.storeData.DriverContactNumber",
    //                             VehicleNumber: "$$store.storeData.VehicleNumber",
    //                             EwayBillNumber: "$$store.storeData.EwayBillNumber",
    //                             Frieght: "$$store.storeData.Frieght",
    //                             Remark: "$$store.storeData.Remark",
    //                             storeuploadFile: "$$store.storeData.storeuploadFile",
    //                             purchase: "$$store.storeData.purchase",
    //                             amountTotal: "$$store.storeData.amountTotal",
    //                             taxableAmount: "$$store.storeData.taxableAmount",
    //                         }
    //                     }
    //                 }
    //             }
    //         },
    //         {
    //             $project: {
    //                 _id: 0,
    //                 productId: 1,
    //                 productName: 1,
    //                 Desacription: 1,
    //                 unitOfMeasurement: 1,
    //                 categoryId: 1,
    //                 categoryName: 1,
    //                 subCategoryId: 1,
    //                 subCategoryName: 1,
    //                 totalRecieveQty: 1,
    //                 minUnitPrice: 1,
    //                 maxUnitPrice: 1,
    //                 avgUnitPrice: 1,
    //                 totalUnitPrice: 1,
    //                 totalGSTAmount: 1,
    //                 finalAmount: 1,
    //                 storeDetails: 1
    //             }
    //         }
    //     ]);

    //     const count = paginatedStore.length;

    //     if (page && pageSize) {
    //         const startIndex = (page - 1) * pageSize;
    //         const lastIndex = startIndex + pageSize;
    //         paginatedStore = paginatedStore.slice(startIndex, lastIndex);
    //     }

    //     return res.status(200).json({ status: 200, totalStore: count, message: "All Store Found Successfully...", store: paginatedStore, status });

    // } catch (error) {
    //     console.log(error)
    //     return res.status(500).json({ status: 500, message: error.message });
    // }
    try {
        let page = parseInt(req.query.page);
        let pageSize = parseInt(req.query.pageSize);

        if (page < 1 || pageSize < 1) {
            return res.status(400).json({ status: 400, message: "Page and PageSize can't be less than 1" });
        }

        let paginatedStore = await store.aggregate([
            {
                $lookup: {
                    from: "warehouses",
                    localField: "warehouseId",
                    foreignField: "_id",
                    as: "warehouseData"
                }
            },
            { $unwind: "$warehouseData" },
            { $unwind: "$multipleQty" },
            {
                $lookup: {
                    from: "storetransfers",
                    let: { productId: "$multipleQty.productName", warehouseId: "$warehouseData._id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$productId", "$$productId"] },
                                        {
                                            $or: [
                                                { $eq: ["$debitWarehouse", "$$warehouseId"] },
                                                { $eq: ["$creditWarehouse", "$$warehouseId"] }
                                            ]
                                        }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "storeTransfers"
                }
            },
            {
                $addFields: {
                    transferQty: {
                        $reduce: {
                            input: "$storeTransfers",
                            initialValue: 0,
                            in: {
                                $cond: [
                                    { $eq: ["$$this.debitWarehouse", "$warehouseData._id"] },
                                    { $subtract: ["$$value", { $toDouble: "$$this.qty" }] },
                                    { $add: ["$$value", { $toDouble: "$$this.qty" }] }
                                ]
                            }
                        }
                    }
                }
            },
            {
                $group: {
                    _id: {
                        productName: "$multipleQty.productName",
                        storeId: "$_id",
                        warehouseId: "$warehouseData._id"
                    },
                    lastUnitPrice: { $last: "$multipleQty.unitPrice" },
                    lastRecieveUnitPrice: { $last: "$multipleQty.recieveunitPrice" },
                    totalRecieveQty: {
                        $sum: {
                            $add: [
                                { $toDouble: "$multipleQty.recieveQty" },
                                "$transferQty"
                            ]
                        }
                    },
                    minUnitPrice: { $min: { $toDouble: "$multipleQty.recieveunitPrice" } },
                    maxUnitPrice: { $max: { $toDouble: "$multipleQty.recieveunitPrice" } },
                    totalUnitPrice: {
                        $sum: {
                            $multiply: [
                                { $toDouble: { $ifNull: ["$multipleQty.recieveQty", 0] } },
                                { $toDouble: { $ifNull: ["$multipleQty.recieveunitPrice", 0] } }
                            ]
                        }
                    },
                    totalGSTAmount: {
                        $sum: {
                            $multiply: [
                                { $toDouble: { $ifNull: ["$multipleQty.recieveQty", 0] } },
                                { $toDouble: { $ifNull: ["$multipleQty.recieveunitPrice", 0] } },
                                { $divide: [{ $toDouble: { $ifNull: ["$multipleQty.GSTAmount", 0] } }, 100] }
                            ]
                        }
                    },
                    storeData: { $last: "$$ROOT" }
                }
            },
            {
                $group: {
                    _id: "$_id.productName",
                    lastUnitPrice: { $last: "$lastUnitPrice" },
                    lastRecieveUnitPrice: { $last: "$lastRecieveUnitPrice" },
                    stores: {
                        $push: {
                            storeId: "$_id.storeId",
                            warehouseId: "$_id.warehouseId",
                            totalRecieveQty: "$totalRecieveQty",
                            minUnitPrice: "$minUnitPrice",
                            maxUnitPrice: "$maxUnitPrice",
                            totalUnitPrice: "$totalUnitPrice",
                            totalGSTAmount: "$totalGSTAmount",
                            storeData: "$storeData"
                        }
                    },
                    totalRecieveQty: { $sum: "$totalRecieveQty" },
                    minUnitPrice: { $min: "$minUnitPrice" },
                    maxUnitPrice: { $max: "$maxUnitPrice" },
                    totalUnitPrice: { $sum: "$totalUnitPrice" },
                    totalGSTAmount: { $sum: "$totalGSTAmount" }
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            { $unwind: "$productDetails" },
            {
                $lookup: {
                    from: "categories",
                    localField: "productDetails.mainCategory",
                    foreignField: "_id",
                    as: "categoryDetails"
                }
            },
            {
                $unwind: {
                    path: "$categoryDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "subcategories",
                    localField: "productDetails.subCategory",
                    foreignField: "_id",
                    as: "subCategoryDetails"
                }
            },
            {
                $unwind: {
                    path: "$subCategoryDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 0,
                    productId: "$_id",
                    productName: "$productDetails.productName",
                    Desacription: "$productDetails.Desacription",
                    unitOfMeasurement: "$productDetails.unitOfMeasurement",
                    categoryId: "$productDetails.categoryId",
                    categoryName: "$categoryDetails.categoryName",
                    subCategoryId: "$productDetails.subCategoryId",
                    subCategoryName: "$subCategoryDetails.subCategoryName",
                    lastUnitPrice: 1,
                    lastRecieveUnitPrice: 1,
                    totalRecieveQty: 1,
                    minUnitPrice: 1,
                    maxUnitPrice: 1,
                    avgUnitPrice: {
                        $cond: [
                            { $eq: ["$totalRecieveQty", 0] },
                            0,
                            { $divide: ["$totalUnitPrice", "$totalRecieveQty"] }
                        ]
                    },
                    totalUnitPrice: 1,
                    totalGSTAmount: 1,
                    finalAmount: { $add: ["$totalUnitPrice", "$totalGSTAmount"] },
                    storeDetails: {
                        $map: {
                            input: "$stores",
                            as: "store",
                            in: {
                                storeId: "$$store.storeId",
                                warehouseId: "$$store.warehouseId",
                                totalRecieveQty: "$$store.totalRecieveQty",
                                storedate: "$$store.storeData.storedate",
                                Invoicenumber: "$$store.storeData.Invoicenumber",
                                Invoicedate: "$$store.storeData.Invoicedate",
                                TransporterName: "$$store.storeData.TransporterName",
                                LRNumber: "$$store.storeData.LRNumber",
                                DriverName: "$$store.storeData.DriverName",
                                DriverContactNumber: "$$store.storeData.DriverContactNumber",
                                VehicleNumber: "$$store.storeData.VehicleNumber",
                                EwayBillNumber: "$$store.storeData.EwayBillNumber",
                                Frieght: "$$store.storeData.Frieght",
                                Remark: "$$store.storeData.Remark",
                                storeuploadFile: "$$store.storeData.storeuploadFile",
                                purchase: "$$store.storeData.purchase",
                                amountTotal: "$$store.storeData.amountTotal",
                                taxableAmount: "$$store.storeData.taxableAmount"
                            }
                        }
                    }
                }
            }
        ]);

        const count = paginatedStore.length;

        if (page && pageSize) {
            const startIndex = (page - 1) * pageSize;
            const lastIndex = startIndex + pageSize;
            paginatedStore = paginatedStore.slice(startIndex, lastIndex);
        }

        return res.status(200).json({
            status: 200,
            totalStore: count,
            message: "All Store Found Successfully...",
            store: paginatedStore
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
}

exports.getstoreById = async (req, res) => {
    try {
        let id = req.params.id

        let checkStoreId = await store.findById(id)

        if (!checkStoreId) {
            return res.status(404).json({ status: 404, message: "Store Not Found" })
        }

        return res.status(200).json({ status: 200, message: "Store Found SuccessFully...", store: checkStoreId });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.updatestoreById = async (req, res) => {
    try {
        let id = req.params.id
        let checkStoreId = await store.findById(id)
        // console.log("req.body", req.body);


        if (!checkStoreId) {
            return res.status(404).json({ status: 404, message: "Store Not Found" })
        }

        if (req.file) {
            req.body.storeuploadFile = req.file.path
        }

        checkStoreId = await store.findByIdAndUpdate(id, { ...req.body }, { new: true });

        return res.status(200).json({ status: 200, message: "Store Updated SuccessFully...", store: checkStoreId })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.deletestoreById = async (req, res) => {
    try {
        let id = req.params.id

        let checkStoreId = await store.findById(id)

        if (!checkStoreId) {
            return res.status(404).json({ status: 404, message: "Store Not Found" });
        }

        await store.findByIdAndDelete(id);

        return res.status(200).json({ status: 200, message: "Store Remove SuccessFully..." })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}


exports.getWarhouseData = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ status: 404, message: "User not found" });
        }

        const userEmail = user.email;

        let page = parseInt(req.query.page);
        let pageSize = parseInt(req.query.pageSize);

        if (page < 1 || pageSize < 1) {
            return res.status(400).json({ status: 400, message: "Page and PageSize can't be less than 1" });
        }

        let paginatedStore = await store.aggregate([
            {
                $lookup: {
                    from: "warehouses",
                    localField: "warehouseId",
                    foreignField: "_id",
                    as: "warehouseData"
                }
            },
            { $unwind: "$warehouseData" },
            { $match: { "warehouseData.email": userEmail } },
            { $unwind: "$multipleQty" },
            {
                $lookup: {
                    from: "storetransfers",
                    let: { productId: "$multipleQty.productName", warehouseId: "$warehouseData._id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$productId", "$$productId"] },
                                        {
                                            $or: [
                                                { $eq: ["$debitWarehouse", "$$warehouseId"] },
                                                { $eq: ["$creditWarehouse", "$$warehouseId"] }
                                            ]
                                        }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "storeTransfers"
                }
            },
            {
                $addFields: {
                    transferQty: {
                        $reduce: {
                            input: "$storeTransfers",
                            initialValue: 0,
                            in: {
                                $cond: [
                                    { $eq: ["$$this.debitWarehouse", "$warehouseData._id"] },
                                    { $subtract: ["$$value", { $toDouble: "$$this.qty" }] },
                                    { $add: ["$$value", { $toDouble: "$$this.qty" }] }
                                ]
                            }
                        }
                    }
                }
            },
            {
                $group: {
                    _id: {
                        productName: "$multipleQty.productName",
                        storeId: "$_id",
                        warehouseId: "$warehouseData._id"
                    },
                    totalRecieveQty: {
                        $sum: {
                            $add: [
                                { $toDouble: "$multipleQty.recieveQty" },
                                "$transferQty"
                            ]
                        }
                    },
                    minUnitPrice: { $min: { $toDouble: "$multipleQty.recieveunitPrice" } },
                    maxUnitPrice: { $max: { $toDouble: "$multipleQty.recieveunitPrice" } },
                    totalUnitPrice: {
                        $sum: {
                            $multiply: [
                                { $toDouble: { $ifNull: ["$multipleQty.recieveQty", 0] } },
                                { $toDouble: { $ifNull: ["$multipleQty.recieveunitPrice", 0] } }
                            ]
                        }
                    },
                    totalGSTAmount: {
                        $sum: {
                            $multiply: [
                                { $toDouble: { $ifNull: ["$multipleQty.recieveQty", 0] } },
                                { $toDouble: { $ifNull: ["$multipleQty.recieveunitPrice", 0] } },
                                { $divide: [{ $toDouble: { $ifNull: ["$multipleQty.GSTAmount", 0] } }, 100] }
                            ]
                        }
                    },
                    storeData: { $first: "$$ROOT" }
                }
            },
            {
                $group: {
                    _id: "$_id.productName",
                    stores: {
                        $push: {
                            storeId: "$_id.storeId",
                            warehouseId: "$_id.warehouseId",
                            totalRecieveQty: "$totalRecieveQty",
                            minUnitPrice: "$minUnitPrice",
                            maxUnitPrice: "$maxUnitPrice",
                            totalUnitPrice: "$totalUnitPrice",
                            totalGSTAmount: "$totalGSTAmount",
                            storeData: "$storeData"
                        }
                    },
                    totalRecieveQty: { $sum: "$totalRecieveQty" },
                    minUnitPrice: { $min: "$minUnitPrice" },
                    maxUnitPrice: { $max: "$maxUnitPrice" },
                    totalUnitPrice: { $sum: "$totalUnitPrice" },
                    totalGSTAmount: { $sum: "$totalGSTAmount" }
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            {
                $unwind: "$productDetails"
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "productDetails.mainCategory",
                    foreignField: "_id",
                    as: "categoryDetails"
                }
            },
            {
                $unwind: { path: "$categoryDetails", preserveNullAndEmptyArrays: true }
            },
            {
                $lookup: {
                    from: "subcategories",
                    localField: "productDetails.subCategory",
                    foreignField: "_id",
                    as: "subCategoryDetails"
                }
            },
            {
                $unwind: { path: "$subCategoryDetails", preserveNullAndEmptyArrays: true }
            },
            {
                $addFields: {
                    productName: "$productDetails.productName",
                    unitOfMeasurement: "$productDetails.unitOfMeasurement",
                    categoryId: "$productDetails.categoryId",
                    categoryName: "$categoryDetails.categoryName",
                    subCategoryId: "$productDetails.subCategoryId",
                    subCategoryName: "$subCategoryDetails.subCategoryName",
                }
            },
            {
                $addFields: {
                    productId: "$_id",
                    avgUnitPrice: {
                        $cond: [
                            { $eq: ["$totalRecieveQty", 0] },
                            0,
                            { $divide: ["$totalUnitPrice", "$totalRecieveQty"] }
                        ]
                    },
                    finalAmount: { $add: ["$totalUnitPrice", "$totalGSTAmount"] },
                    storeDetails: {
                        $map: {
                            input: "$stores",
                            as: "store",
                            in: {
                                storeId: "$$store.storeId",
                                warehouseId: "$$store.warehouseId",
                                totalRecieveQty: "$$store.totalRecieveQty",
                                storedate: "$$store.storeData.storedate",
                                Invoicenumber: "$$store.storeData.Invoicenumber",
                                Invoicedate: "$$store.storeData.Invoicedate",
                                TransporterName: "$$store.storeData.TransporterName",
                                LRNumber: "$$store.storeData.LRNumber",
                                DriverName: "$$store.storeData.DriverName",
                                DriverContactNumber: "$$store.storeData.DriverContactNumber",
                                VehicleNumber: "$$store.storeData.VehicleNumber",
                                EwayBillNumber: "$$store.storeData.EwayBillNumber",
                                Frieght: "$$store.storeData.Frieght",
                                Remark: "$$store.storeData.Remark",
                                storeuploadFile: "$$store.storeData.storeuploadFile",
                                purchase: "$$store.storeData.purchase",
                                amountTotal: "$$store.storeData.amountTotal",
                                taxableAmount: "$$store.storeData.taxableAmount",
                                purchaseDetails: {
                                    SrNo: "$$store.storeData.purchaseData.SrNo",
                                    PurchaseDate: "$$store.storeData.purchaseData.PurchaseDate",
                                    taxableAmount: "$$store.storeData.purchaseData.taxableAmount",
                                    totalGstAmount: "$$store.storeData.purchaseData.totalGstAmount",
                                    amountTotal: "$$store.storeData.purchaseData.amountTotal"
                                },
                                warehouseDetails: {
                                    name: "$$store.storeData.warehouseData.name",
                                    email: "$$store.storeData.warehouseData.email",
                                    address: "$$store.storeData.warehouseData.address",
                                    city: "$$store.storeData.warehouseData.city",
                                    state: "$$store.storeData.warehouseData.state",
                                    country: "$$store.storeData.warehouseData.country",
                                    pincode: "$$store.storeData.warehouseData.pincode"
                                }
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    productId: 1,
                    productName: 1,
                    unitOfMeasurement: 1,
                    categoryId: 1,
                    categoryName: 1,
                    subCategoryId: 1,
                    subCategoryName: 1,
                    totalRecieveQty: 1,
                    minUnitPrice: 1,
                    maxUnitPrice: 1,
                    avgUnitPrice: 1,
                    totalUnitPrice: 1,
                    totalGSTAmount: 1,
                    finalAmount: 1,
                    storeDetails: 1
                }
            }
        ]);

        const count = paginatedStore.length;

        if (page && pageSize) {
            const startIndex = (page - 1) * pageSize;
            const lastIndex = startIndex + pageSize;
            paginatedStore = paginatedStore.slice(startIndex, lastIndex);
        }

        return res.status(200).json({ status: 200, totalStore: count, message: "All Store Found Successfully...", store: paginatedStore });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message });
    }

};

exports.transferStore = async (req, res) => {
    try {
        const { categoryId, subCategoryId, description, unitofMeasurement, purpose, modeofTransport, productId, quantity, debitWarehouseId, creditWarehouseId } = req.body;

        const debitStores = await store.find({
            'multipleQty.productName': productId,
            warehouseId: debitWarehouseId,
        }).sort({ createdAt: -1 });

        if (!debitStores || debitStores.length === 0) {
            return res.status(404).json({ status: 404, message: 'Product Not Found In Debit Warehouse' });
        }

        let totalAvailableQuantity = 0;
        debitStores.forEach(debitStore => {
            debitStore.multipleQty.forEach(item => {
                if (item.productName.toString() === productId) {
                    totalAvailableQuantity += (item.recieveQty || 0);
                }
            });
        });

        if (totalAvailableQuantity < quantity) {
            return res.status(404).json({ status: 404, message: 'Insufficient Quantity In Debit Warehouse', });
        }

        let remainingQuantityToTransfer = quantity;
        let totalWeightedAmount = 0;
        let transferDetails = [];
        let debitStoreUpdates = [];

        for (let debitStore of debitStores) {
            let storeUpdate = {
                storeId: debitStore._id,
                multipleQty: [...debitStore.multipleQty],
                shouldDelete: false
            };

            for (let i = 0; i < storeUpdate.multipleQty.length; i++) {
                const item = storeUpdate.multipleQty[i];

                if (item.productName.toString() === productId && remainingQuantityToTransfer > 0) {
                    const availableQuantity = item.recieveQty || 0;

                    if (availableQuantity <= 0) continue;

                    let quantityToTakeFromThis = Math.min(remainingQuantityToTransfer, availableQuantity);
                    let transferRatio = quantityToTakeFromThis / availableQuantity;

                    let portionAmount = quantityToTakeFromThis * (item.recieveunitPrice || item.unitPrice);
                    totalWeightedAmount += portionAmount;

                    transferDetails.push({
                        quantity: quantityToTakeFromThis,
                        unitPrice: item.unitPrice,
                        recieveunitPrice: item.recieveunitPrice || item.unitPrice,
                        total: (item.total || 0) * transferRatio,
                        GSTAmount: (item.GSTAmount || 0)
                    });

                    if (quantityToTakeFromThis === availableQuantity) {
                        storeUpdate.multipleQty.splice(i, 1);
                        i--;
                    } else {
                        item.recieveQty -= quantityToTakeFromThis;
                        item.total = (item.total || 0) * (1 - transferRatio);
                        item.GSTAmount = (item.GSTAmount || 0);
                    }

                    remainingQuantityToTransfer -= quantityToTakeFromThis;
                }
            }

            if (storeUpdate.multipleQty.length === 0) {
                storeUpdate.shouldDelete = true;
            }
            debitStoreUpdates.push(storeUpdate);
        }

        const weightedAveragePrice = totalWeightedAmount / quantity;

        // Prepare new store data
        const newStoreData = {
            multipleQty: [{
                productName: productId,
                TotalQty: quantity,
                recieveQty: quantity,
                total: totalWeightedAmount,
                unitPrice: transferDetails[0].unitPrice,
                recieveunitPrice: weightedAveragePrice,
                GSTAmount: transferDetails[0].GSTAmount
            }],
            warehouseId: creditWarehouseId,
        };

        const newCreditStore = new store(newStoreData);
        await newCreditStore.save();

        for (const update of debitStoreUpdates) {
            if (update.shouldDelete) {
                await store.deleteOne({ _id: update.storeId });
            } else {
                await store.updateOne({ _id: update.storeId }, { $set: { multipleQty: update.multipleQty } });
            }
        }

        return res.status(200).json({ status: 200, message: 'Store transfer successfully...' });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
};

exports.getstoreProduct = async (req, res) => {
    try {
        let allProductsData = await product.aggregate([
            {
                $lookup: {
                    from: 'categories',
                    localField: 'mainCategory',
                    foreignField: '_id',
                    as: 'mainCategoryData'
                }
            },
            {
                $lookup: {
                    from: 'subcategories',
                    localField: 'subCategory',
                    foreignField: '_id',
                    as: 'subCategoryData'
                }
            }
        ]);

        if (!allProductsData) {
            return res.status(404).json({ status: 404, message: "Product Not Found" })
        }

        return res.status(200).json({ status: 200, message: "All Product Data Found SuccessFully...", products: allProductsData })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getstorepurchase = async (req, res) => {
    try {
        const userId = req.user.id;

        const getUserData = await User.findById(userId);
        if (!getUserData) {
            return res.status(404).json({ status: 404, message: "User not found" });
        }
        console.log("getUser", getUserData);

        const userEmail = getUserData.email;

        let getRoleData = await role.findById(req.user.role)

        let matchStage = [];
        if (getRoleData.roleName !== 'Super Admin') {
            const userWarehouse = await wareHouse.findOne({ email: userEmail });
            console.log("userWarehouse", userWarehouse);

            if (userWarehouse) {
                matchStage.push({ $match: { werehouse: userWarehouse._id } });
            }
        }

        let allpurchaseData = await purchase.aggregate([
            ...matchStage,
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

        if (!allpurchaseData) {
            return res.status(404).json({ status: 404, message: "purchase Not Found" })
        }

        return res.status(200).json({ status: 200, TotalPurchase: allpurchaseData.length, message: "All purchase Found SuccessFully...", purchase: allpurchaseData })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getstorewarehouse = async (req, res) => {
    try {
        let allwarehouse = await wareHouse.find()

        if (!allwarehouse) {
            return res.status(404).json({ status: 404, message: "warehouse Not Found" })
        }

        return res.status(200).json({ status: 200, TotalwareHouse: allwarehouse.length, message: "All warehouse Found SuccessFully...", wareHouse: allwarehouse })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getstoreUsers = async (req, res) => {
    try {
        let allusers = await User.aggregate([
            {
                $lookup: {
                    from: 'roles',
                    localField: 'role',
                    foreignField: '_id',
                    as: 'roleData'
                }
            }
        ])

        if (!allusers) {
            return res.status(404).json({ status: 404, message: "User Not Found" })
        }

        return res.status(200).json({ status: 200, TotalwareHouse: allusers.length, message: "All User Found SuccessFully...", users: allusers })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}