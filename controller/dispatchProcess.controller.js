const dispatchProcess = require('../models/dispatchProcess.model');
const Store = require('../models/store.models');
const DispatchTracker = require('../models/dispatchTrackerModel');
const category = require('../models/category.models')
const subCategory = require('../models/subCategory.models')
const product = require('../models/product.models')
const warehouse = require('../models/warehouse.model')
const suggestion = require('../models/dispatchsuggestion.models')
const kitproduct = require('../models/kitProduct.models')
const user = require("../models/user.models")
const wareHouse = require('../models/warehouse.model')
const role = require('../models/role.models')
const commercialMarket = require('../models/commercialMarketing.models')
const mongoose = require('mongoose')

async function generateDispatchNumber(purposeOfDispatch, dispatchProcessId = null, arrayIndex = 0, isFirstInArray = false, isUpdate = false) {
    try {
        const currentDate = new Date();
        const financialYear = currentDate.getMonth() >= 3
            ? `${currentDate.getFullYear()}-${(currentDate.getFullYear() + 1).toString().slice(-2)}`
            : `${currentDate.getFullYear() - 1}-${currentDate.getFullYear().toString().slice(-2)}`;

        const dispatchType = purposeOfDispatch === "Customer Material" ? "Dispatch" : "Return";

        const lockKey = `${dispatchProcessId}-${dispatchType}-${financialYear}`;
        if (global.dispatchLocks && global.dispatchLocks[lockKey]) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        global.dispatchLocks = global.dispatchLocks || {};
        global.dispatchLocks[lockKey] = true;

        try {
            if (dispatchType === "Return") {

                const dispatchTracker = await DispatchTracker.findOne({
                    financialYear,
                    dispatchType: "Dispatch",
                    dispatchProcessId
                });

                if (!dispatchTracker) {
                    throw new Error("No dispatch found for this return");
                }

                let returnTracker = await DispatchTracker.findOne({
                    financialYear,
                    dispatchType: "Return",
                    dispatchProcessId
                });

                if (!returnTracker) {
                    returnTracker = await DispatchTracker.create({
                        prefix: 'TEL',
                        lastSequenceNumber: dispatchTracker.lastSequenceNumber,
                        lastDispatchNumber: 0,
                        financialYear,
                        dispatchType: "Return",
                        dispatchProcessId
                    });
                }

                returnTracker.lastDispatchNumber += 1;
                await returnTracker.save();

                const formattedSequenceNumber = returnTracker.lastSequenceNumber.toString().padStart(4, '0');
                return `${returnTracker.prefix}/Return-${returnTracker.lastDispatchNumber}/${financialYear}/${formattedSequenceNumber}`;
            }


            let dispatchTracker = await DispatchTracker.findOne({
                financialYear,
                dispatchType: "Dispatch",
                dispatchProcessId
            });

            if (!dispatchTracker) {
                const latestTracker = await DispatchTracker.findOne({
                    financialYear,
                    dispatchType: "Dispatch"
                }).sort({ lastSequenceNumber: -1 });

                const newSequenceNumber = latestTracker ? latestTracker.lastSequenceNumber + 1 : 1;

                dispatchTracker = await DispatchTracker.create({
                    prefix: 'TEL',
                    lastSequenceNumber: newSequenceNumber,
                    lastDispatchNumber: 0,
                    financialYear,
                    dispatchType: "Dispatch",
                    dispatchProcessId
                });
            }

            dispatchTracker.lastDispatchNumber += 1;
            await dispatchTracker.save();

            const formattedSequenceNumber = dispatchTracker.lastSequenceNumber.toString().padStart(4, '0');
            return `${dispatchTracker.prefix}/Dispatch-${dispatchTracker.lastDispatchNumber}/${financialYear}/${formattedSequenceNumber}`;

        } finally {
            delete global.dispatchLocks[lockKey];
        }

    } catch (error) {
        console.error('Error generating dispatch number:', error);
        throw error;
    }
}

exports.createDispatchProcess = async (req, res) => {
    try {
        const { marketId, PendingPayment, ProcessData } = req.body;


        if (!marketId || !ProcessData || !Array.isArray(ProcessData)) {
            return res.status(400).json({
                status: 400,
                message: "Invalid request data. marketId and ProcessData array are required"
            });
        }

        for (const process of ProcessData) {
            if (!process.PurposeofDispatch ||
                !["Customer Material", "Return Material"].includes(process.PurposeofDispatch)) {
                return res.status(400).json({
                    status: 400,
                    message: "Invalid PurposeofDispatch. Must be either 'Customer Material' or 'Return Material'"
                });
            }

            if (!Array.isArray(process.DispatchDetails)) {
                return res.status(400).json({
                    status: 400,
                    message: "DispatchDetails must be an array"
                });
            }

            const isPurposeReturn = process.PurposeofDispatch === "Return Material";

            if (!isPurposeReturn) {
                for (const detail of process.DispatchDetails) {
                    if (detail.DispatchKitId === '') {
                        detail.DispatchKitId = null;
                    }
                    const { DispatchProductName, DispatchQty } = detail;

                    const storeEntries = await Store.find({
                        'multipleQty.productName': DispatchProductName,
                        warehouseId: process.DebitCreditWarehouseName,
                    }).sort({ createdAt: 1 });

                    const totalAvailableQty = storeEntries.reduce((total, entry) => {
                        return total + entry.multipleQty.reduce((sum, item) => {
                            return item.productName.toString() === DispatchProductName.toString() ?
                                sum + (item.recieveQty || 0) : sum;
                        }, 0);
                    }, 0);

                    if (totalAvailableQty < parseInt(DispatchQty)) {
                        return res.status(404).json({
                            status: 404,
                            message: 'Not enough quantity available',
                            productName: DispatchProductName,
                            availableQuantity: totalAvailableQty,
                            requestedQuantity: parseInt(DispatchQty),
                            warehouse: process.DebitCreditWarehouseName,
                            shortageAmount: parseInt(DispatchQty) - totalAvailableQty
                        });
                    }
                }
            }
        }

        const newDispatchProcess = await dispatchProcess.create({
            marketId,
            PendingPayment,
            ProcessData: []
        });

        const updatedProcessData = await Promise.all(ProcessData.map(async (process, index) => {
            const generatedNumber = await generateDispatchNumber(
                process.PurposeofDispatch,
                newDispatchProcess._id,
                index,
                index === 0
            );

            return {
                ...process,
                generatedNumber
            };
        }));

        newDispatchProcess.ProcessData = updatedProcessData;
        await newDispatchProcess.save();

        for (const process of ProcessData) {
            const isPurposeReturn = process.PurposeofDispatch === "Return Material";

            for (const detail of process.DispatchDetails) {
                const { DispatchProductName, DispatchQty } = detail;

                if (!isPurposeReturn) {
                    const storeEntries = await Store.find({
                        'multipleQty.productName': DispatchProductName,
                        warehouseId: process.DebitCreditWarehouseName,
                    }).sort({ createdAt: 1 });

                    let remainingQty = parseInt(DispatchQty);
                    let totalCost = 0;
                    let weightedCost = 0;

                    for (const entry of storeEntries) {
                        if (remainingQty <= 0) break;

                        const updatedMultipleQty = entry.multipleQty.map(item => {
                            if (item.productName.toString() === DispatchProductName.toString() &&
                                item.recieveQty > 0 && remainingQty > 0) {

                                const qtyToRemove = Math.min(remainingQty, item.recieveQty);
                                const costPerUnit = item.recieveunitPrice || 0;

                                const itemCost = qtyToRemove * costPerUnit;
                                totalCost += itemCost;
                                weightedCost += itemCost;
                                remainingQty -= qtyToRemove;

                                return {
                                    ...item.toObject(),
                                    recieveQty: item.recieveQty - qtyToRemove,
                                    total: (item.total || 0) - itemCost,
                                };
                            }
                            return item.toObject();
                        });

                        entry.multipleQty = updatedMultipleQty;
                        await entry.save();
                    }

                    const avgCost = weightedCost / parseInt(DispatchQty);
                    await Store.create({
                        multipleQty: [{
                            recieveQty: parseInt(DispatchQty),
                            total: totalCost,
                            productName: DispatchProductName,
                            recieveunitPrice: avgCost,
                        }]
                    });
                } else {
                    let existingWarehouseEntry = await Store.findOne({
                        warehouseId: process.DebitCreditWarehouseName,
                        'multipleQty.productName': DispatchProductName
                    });

                    if (existingWarehouseEntry) {
                        const productIndex = existingWarehouseEntry.multipleQty.findIndex(
                            item => item.productName.toString() === DispatchProductName.toString()
                        );

                        if (productIndex !== -1) {
                            existingWarehouseEntry.multipleQty[productIndex].recieveQty += parseInt(DispatchQty);
                            existingWarehouseEntry.multipleQty[productIndex].total +=
                                parseInt(DispatchQty) * (existingWarehouseEntry.multipleQty[productIndex].recieveunitPrice || 0);
                            existingWarehouseEntry.multipleQty[productIndex].lastUpdated = new Date();
                        } else {
                            existingWarehouseEntry.multipleQty.push({
                                recieveQty: parseInt(DispatchQty),
                                productName: DispatchProductName,
                            });
                        }
                        await existingWarehouseEntry.save();
                    } else {
                        await Store.create({
                            warehouseId: process.DebitCreditWarehouseName,
                            multipleQty: [{
                                recieveQty: parseInt(DispatchQty),
                                productName: DispatchProductName
                            }]
                        });
                    }
                }
            }
        }

        return res.json({
            status: 201,
            message: "Dispatch Process created successfully",
            dispatchProcess: newDispatchProcess
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            message: error.message
        });
    }

}

exports.getAllDispatchProcess = async (req, res) => {
    // try {

    //      let paginatedDispatchProcess = await dispatchProcess.find();

    //     let count = paginatedDispatchProcess.length;

    //     return res.status(200).json({ status: 200, TotalDispatchProcess: count, message: 'All Dispatch Process Found Successfully..', dispatchProcess: paginatedDispatchProcess });

    // } catch (error) {
    //     console.log(error);
    //     return res.status(500).json({ status: 500, message: error.message });
    // }

    // try {
    //     let paginatedDispatchProcess = await dispatchProcess.aggregate([
    //         { $unwind: "$ProcessData" },
    //         { $unwind: "$ProcessData.DispatchDetails" },
    //         {
    //             $lookup: {
    //                 from: 'categories',
    //                 let: { categoryId: '$ProcessData.DispatchDetails.DispatchCatogory' },
    //                 pipeline: [
    //                     {
    //                         $match: {
    //                             $expr: {
    //                                 $eq: ['$_id', { $toObjectId: '$$categoryId' }]
    //                             }
    //                         }
    //                     }
    //                 ],
    //                 as: 'dispatchCategoryData'
    //             }
    //         },
    //         {
    //             $lookup: {
    //                 from: 'subcategories',
    //                 let: { subCategoryId: '$ProcessData.DispatchDetails.DispatchSubCatogory' },
    //                 pipeline: [
    //                     {
    //                         $match: {
    //                             $expr: {
    //                                 $eq: ['$_id', { $toObjectId: '$$subCategoryId' }]
    //                             }
    //                         }
    //                     }
    //                 ],
    //                 as: 'dispatchSubCategoryData'
    //             }
    //         },
    //         {
    //             $lookup: {
    //                 from: 'products',
    //                 let: { productId: '$ProcessData.DispatchDetails.DispatchProductName' },
    //                 pipeline: [
    //                     {
    //                         $match: {
    //                             $expr: {
    //                                 $eq: ['$_id', { $toObjectId: '$$productId' }]
    //                             }
    //                         }
    //                     }
    //                 ],
    //                 as: 'dispatchProductData'
    //             }
    //         },
    //         {
    //             $lookup: {
    //                 from: 'kitproducts',
    //                 let: { kitId: '$ProcessData.DispatchDetails.DispatchKitId' },
    //                 pipeline: [
    //                     {
    //                         $match: {
    //                             $expr: {
    //                                 $eq: ['$_id', { $toObjectId: '$$kitId' }]
    //                             }
    //                         }
    //                     }
    //                 ],
    //                 as: 'dispatchKitData'
    //             }
    //         },
    //         {
    //             $lookup: {
    //                 from: 'warehouses',
    //                 localField: 'ProcessData.DebitCreditWarehouseName',
    //                 foreignField: '_id',
    //                 as: 'DebitCreditWarehouseData'
    //             }
    //         },
    //         {
    //             $lookup: {
    //                 from: 'commercialmarketings',
    //                 localField: 'marketId',
    //                 foreignField: '_id',
    //                 as: 'marketData',
    //             }
    //         },
    //         {
    //             $addFields: {
    //                 'ProcessData.DispatchDetails': {
    //                     $mergeObjects: [
    //                         '$ProcessData.DispatchDetails',
    //                         {
    //                             DispatchCatogoryData: { $arrayElemAt: ['$dispatchCategoryData', 0] },
    //                             DispatchSubCatogoryData: { $arrayElemAt: ['$dispatchSubCategoryData', 0] },
    //                             DispatchProductNameData: { $arrayElemAt: ['$dispatchProductData', 0] },
    //                             DispatchKitData: { $arrayElemAt: ['$dispatchKitData', 0] }
    //                         }
    //                     ]
    //                 },
    //                 'ProcessData.DebitCreditWarehouseData': {
    //                     $arrayElemAt: ['$DebitCreditWarehouseData', 0]
    //                 },
    //                 marketData: { $arrayElemAt: ['$marketData', 0] }
    //             }
    //         },
    //         {
    //             $group: {
    //                 _id: {
    //                     _id: '$_id',
    //                     processDataId: '$ProcessData._id'
    //                 },
    //                 marketId: { $first: '$marketId' },
    //                 marketData: { $first: '$marketData' },
    //                 ProcessData: {
    //                     $first: {
    //                         generatedNumber: '$ProcessData.generatedNumber',
    //                         bulkId: '$ProcessData.bulkId',
    //                         PurposeofDispatch: '$ProcessData.PurposeofDispatch',
    //                         DispatchSuggestionId: '$ProcessData.DispatchSuggestionId',
    //                         DispatchDate: '$ProcessData.DispatchDate',
    //                         DebitCreditWarehouseName: '$ProcessData.DebitCreditWarehouseName',
    //                         DebitCreditWarehouseData: '$ProcessData.DebitCreditWarehouseData',
    //                         DispatchModelTransport: '$ProcessData.DispatchModelTransport',
    //                         DispatchRemarks: '$ProcessData.DispatchRemarks'
    //                     }
    //                 },
    //                 DispatchDetails: {
    //                     $push: '$ProcessData.DispatchDetails'
    //                 },
    //                 createdAt: { $first: '$createdAt' },
    //                 updatedAt: { $first: '$updatedAt' }
    //             }
    //         },
    //         {
    //             $group: {
    //                 _id: '$_id._id',
    //                 marketId: { $first: '$marketId' },
    //                 marketData: { $first: '$marketData' },
    //                 ProcessData: {
    //                     $push: {
    //                         $mergeObjects: [
    //                             '$ProcessData',
    //                             { DispatchDetails: '$DispatchDetails' }
    //                         ]
    //                     }
    //                 },
    //                 createdAt: { $first: '$createdAt' },
    //                 updatedAt: { $first: '$updatedAt' }
    //             }
    //         },
    //         {
    //             $sort: { createdAt: 1 } // Sort by createdAt in ascending order
    //         },
    //     ]);

    //     let count = paginatedDispatchProcess.length;

    //     return res.status(200).json({ status: 200, TotalDispatchProcess: count, message: 'All Dispatch Process Found Successfully..', dispatchProcess: paginatedDispatchProcess });

    // } catch (error) {
    //     console.log(error);
    //     return res.status(500).json({ status: 500, message: error.message });
    // }

    try {
        let paginatedDispatchProcess = await dispatchProcess.aggregate([
            { $unwind: "$ProcessData" },
            { $unwind: "$ProcessData.DispatchDetails" },
            {
                $lookup: {
                    from: 'categories',
                    let: { categoryId: '$ProcessData.DispatchDetails.DispatchCatogory' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ['$_id', { $toObjectId: '$$categoryId' }]
                                }
                            }
                        }
                    ],
                    as: 'dispatchCategoryData'
                }
            },
            {
                $lookup: {
                    from: 'subcategories',
                    let: { subCategoryId: '$ProcessData.DispatchDetails.DispatchSubCatogory' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ['$_id', { $toObjectId: '$$subCategoryId' }]
                                }
                            }
                        }
                    ],
                    as: 'dispatchSubCategoryData'
                }
            },
            {
                $lookup: {
                    from: 'products',
                    let: { productId: '$ProcessData.DispatchDetails.DispatchProductName' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ['$_id', { $toObjectId: '$$productId' }]
                                }
                            }
                        }
                    ],
                    as: 'dispatchProductData'
                }
            },
            {
                $lookup: {
                    from: 'kitproducts',
                    let: { kitId: '$ProcessData.DispatchDetails.DispatchKitId' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ['$_id', { $toObjectId: '$$kitId' }]
                                }
                            }
                        }
                    ],
                    as: 'dispatchKitData'
                }
            },
            {
                $lookup: {
                    from: 'warehouses',
                    localField: 'ProcessData.DebitCreditWarehouseName',
                    foreignField: '_id',
                    as: 'DebitCreditWarehouseData'
                }
            },
            {
                $lookup: {
                    from: 'commercialmarketings',
                    localField: 'marketId',
                    foreignField: '_id',
                    as: 'marketData',
                }
            },
            {
                $addFields: {
                    'ProcessData.DispatchDetails': {
                        $mergeObjects: [
                            '$ProcessData.DispatchDetails',
                            {
                                DispatchCatogoryData: { $arrayElemAt: ['$dispatchCategoryData', 0] },
                                DispatchSubCatogoryData: { $arrayElemAt: ['$dispatchSubCategoryData', 0] },
                                DispatchProductNameData: { $arrayElemAt: ['$dispatchProductData', 0] },
                                DispatchKitData: { $arrayElemAt: ['$dispatchKitData', 0] }
                            }
                        ]
                    },
                    'ProcessData.DebitCreditWarehouseData': {
                        $arrayElemAt: ['$DebitCreditWarehouseData', 0]
                    },
                    marketData: { $arrayElemAt: ['$marketData', 0] }
                }
            },
            {
                $sort: { 'ProcessData.createProcessDate': 1 }
            },
            {
                $group: {
                    _id: {
                        _id: '$_id',
                        processDataId: '$ProcessData._id'
                    },
                    marketId: { $first: '$marketId' },
                    marketData: { $first: '$marketData' },
                    ProcessData: {
                        $first: {
                            generatedNumber: '$ProcessData.generatedNumber',
                            bulkId: '$ProcessData.bulkId',
                            PurposeofDispatch: '$ProcessData.PurposeofDispatch',
                            DispatchSuggestionId: '$ProcessData.DispatchSuggestionId',
                            DispatchDate: '$ProcessData.DispatchDate',
                            DebitCreditWarehouseName: '$ProcessData.DebitCreditWarehouseName',
                            DebitCreditWarehouseData: '$ProcessData.DebitCreditWarehouseData',
                            DispatchModelTransport: '$ProcessData.DispatchModelTransport',
                            DispatchRemarks: '$ProcessData.DispatchRemarks',
                            createProcessDate: '$ProcessData.createProcessDate'
                        }
                    },
                    DispatchDetails: {
                        $push: '$ProcessData.DispatchDetails'
                    },
                    createdAt: { $first: '$createdAt' },
                    updatedAt: { $first: '$updatedAt' }
                }
            },
            {
                $group: {
                    _id: '$_id._id',
                    marketId: { $first: '$marketId' },
                    marketData: { $first: '$marketData' },
                    ProcessData: {
                        $push: {
                            $mergeObjects: [
                                '$ProcessData',
                                { DispatchDetails: '$DispatchDetails' }
                            ]
                        }
                    },
                    createdAt: { $first: '$createdAt' },
                    updatedAt: { $first: '$updatedAt' }
                }
            },
            {
                $addFields: {
                    ProcessData: {
                        $sortArray: {
                            input: '$ProcessData',
                            sortBy: { createProcessDate: 1 }
                        }
                    }
                }
            }
        ]);

        let count = paginatedDispatchProcess.length;
        return res.status(200).json({
            status: 200,
            TotalDispatchProcess: count,
            message: 'All Dispatch Process Found Successfully..',
            dispatchProcess: paginatedDispatchProcess
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
};

exports.getDispatchProcessById = async (req, res) => {
    try {
        let id = req.params.id;
        let dispatchProcessById = await dispatchProcess.findById(id);
        if (!dispatchProcessById) {
            return res.json({ status: 404, message: "Dispatch Process Not Found" })
        }
        return res.json({ status: 200, message: "Dispatch Process Found Successfully..", dispatchProcess: dispatchProcessById })
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.updateDispatchProcessById = async (req, res) => {
    try {
        let id = req.params.id;
        let oldDispatchProcess = await dispatchProcess.findById(id);

        if (!oldDispatchProcess) {
            return res.json({ status: 404, message: "Dispatch Process Not Found" });
        }

        const { marketId, ProcessData } = req.body;

        const updatedProcessData = await Promise.all(ProcessData.map(async (process, index) => {
            if (!process._id) {
                const generatedNumber = await generateDispatchNumber(
                    process.PurposeofDispatch,
                    id,
                    index,
                    index === 0,
                    true
                );
                return { ...process, generatedNumber };
            }

            const existingProcess = oldDispatchProcess.ProcessData.find(
                p => p._id.toString() === process._id.toString()
            );
            return { ...process, generatedNumber: existingProcess.generatedNumber };
        }));

        for (const process of updatedProcessData) {
            for (const detail of process.DispatchDetails) {
                const { DispatchProductName, DispatchQty } = detail;
                const warehouseId = process.DebitCreditWarehouseName; // Adjusted to match schema
                const isPurposeReturn = process.PurposeofDispatch === "Return Material";

                if (!isPurposeReturn) {
                    const storeEntries = await Store.find({
                        'multipleQty.productName': DispatchProductName,
                        warehouseId: warehouseId,
                    }).sort({ createdAt: 1 });

                    let remainingQty = parseInt(DispatchQty);
                    let totalCost = 0;
                    let availableQty = 0;

                    for (const entry of storeEntries) {
                        for (const item of entry.multipleQty) {
                            if (item.productName.toString() === DispatchProductName.toString()) {
                                availableQty += item.recieveQty;
                            }
                        }
                    }

                    if (availableQty < remainingQty) {
                        return res.status(404).json({
                            status: 404,
                            message: `Not enough quantity available for product ${DispatchProductName}`
                        });
                    }

                    for (const entry of storeEntries) {
                        const updatedMultipleQty = entry.multipleQty.map(item => {
                            if (item.productName.toString() === DispatchProductName.toString() &&
                                item.recieveQty > 0 && remainingQty > 0) {
                                const qtyToRemove = Math.min(remainingQty, item.recieveQty);
                                const costPerUnit = item.recieveunitPrice;
                                totalCost += qtyToRemove * costPerUnit;
                                remainingQty -= qtyToRemove;
                                return {
                                    ...item,
                                    recieveQty: item.recieveQty - qtyToRemove,
                                    total: item.total - (qtyToRemove * costPerUnit)
                                };
                            }
                            return item;
                        });

                        entry.multipleQty = updatedMultipleQty;
                        await entry.save();

                        if (remainingQty === 0) break;
                    }

                    const avgCost = totalCost / parseInt(DispatchQty);
                    await Store.create({
                        warehouseId: warehouseId,
                        multipleQty: [{
                            recieveQty: parseInt(DispatchQty),
                            total: totalCost,
                            productName: DispatchProductName,
                            recieveunitPrice: avgCost,
                        }]
                    });
                } else {
                    let existingWarehouseEntry = await Store.findOne({
                        warehouseId: warehouseId,
                        'multipleQty.productName': DispatchProductName
                    });

                    if (existingWarehouseEntry) {
                        const productIndex = existingWarehouseEntry.multipleQty.findIndex(

                            item => item.productName.toString() === DispatchProductName.toString()
                        );

                        if (productIndex !== -1) {
                            existingWarehouseEntry.multipleQty[productIndex].recieveQty += parseInt(DispatchQty);
                            existingWarehouseEntry.multipleQty[productIndex].total +=
                                parseInt(DispatchQty) * existingWarehouseEntry.multipleQty[productIndex].recieveunitPrice;
                            await existingWarehouseEntry.save();
                        } else {
                            existingWarehouseEntry.multipleQty.push({
                                recieveQty: parseInt(DispatchQty),
                                productName: DispatchProductName,
                                recieveunitPrice: 0,
                                total: 0
                            });
                            await existingWarehouseEntry.save();
                        }
                    } else {
                        await Store.create({
                            warehouseId: warehouseId,
                            multipleQty: [{
                                recieveQty: parseInt(DispatchQty),
                                productName: DispatchProductName,
                                recieveunitPrice: 0,
                                total: 0
                            }]
                        });
                    }
                }
            }
        }
        const finalProcessData = oldDispatchProcess.ProcessData.map(oldProcess => {
            const newProcess = updatedProcessData.find(p =>
                p._id && p._id.toString() === oldProcess._id.toString()
            );
            if (newProcess) {
                return {
                    ...oldProcess,
                    ...newProcess,
                    DispatchDetails: [
                        ...oldProcess.DispatchDetails,
                        ...newProcess.DispatchDetails.filter(detail =>
                            !oldProcess.DispatchDetails.some(oldDetail =>
                                oldDetail._id && oldDetail._id.toString() === detail._id.toString()
                            )
                        )
                    ]
                };
            }
            return oldProcess;
        });

        const newProcesses = updatedProcessData.filter(process => !process._id);
        finalProcessData.push(...newProcesses);

        const updatedDispatchProcess = await dispatchProcess.findByIdAndUpdate(
            id,
            { marketId, ProcessData: finalProcessData },
            { new: true }
        );

        return res.json({
            status: 200,
            message: "Dispatch Process Updated Successfully",
            dispatchProcess: updatedDispatchProcess
        });
    } catch (error) {
        console.error('Error updating dispatch process:', error);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

exports.deleteDispatchProcessById = async (req, res) => {
    try {
        let id = req.params.id;

        let dispatchProcessById = await dispatchProcess.findById(id);

        if (!dispatchProcessById) {
            return res.json({ status: 404, message: "Dispatch Process Not Found" })
        }

        await dispatchProcess.findByIdAndDelete(id);

        return res.json({ status: 200, message: "Dispatch Process Deleted Successfully.." });

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
}

exports.getDispatchSuggestionId = async (req, res) => {
    try {
        let id = req.params.id

        let getDispatchSuggestionId = await dispatchProcess.find({ DispatchSuggestionId: id })

        if (!getDispatchSuggestionId) {
            return res.json({ status: 404, message: "Dispatch Suggestion Not Found" })
        }

        return res.json({ status: 200, message: "Dispatch Suggestion Found Successfully..", dispatchSuggestion: getDispatchSuggestionId })

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
}

exports.deleteProcessDispatchDetailsById = async (req, res) => {
    try {
        let id = req.params.id
        console.log(id);
        let dispatchDetailsId = await dispatchProcess.findOne({ "ProcessData.DispatchDetails._id": id })
        console.log(dispatchDetailsId);
        if (!dispatchDetailsId) {
            return res.status(404).json({ status: 404, message: "Dispatch Details Data Not Found" })
        }

        dispatchDetailsId = await dispatchProcess.findOneAndUpdate(
            { "ProcessData.DispatchDetails._id": id },
            { $pull: { "ProcessData.$.DispatchDetails": { _id: id } } },
            { new: true }
        )

        return res.status(200).json({ status: 200, message: "Dispatch Details Delete SuccessFully..." })

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }

}



exports.getAllDispatchProcessCategoryData = async (req, res) => {
    try {
        let allCategoryData = await category.find()

        if (!allCategoryData) {
            return res.status(404).json({ status: 404, message: "Category Not Found" })
        }

        return res.status(200).json({ status: 200, message: "All Category Data Found SuccessFully...", category: allCategoryData })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllDispatchProcessSubCategoryData = async (req, res) => {
    try {
        let allSubCategoryData = await subCategory.aggregate([
            {
                $lookup: {
                    from: 'categories',
                    localField: 'categoryName',
                    foreignField: '_id',
                    as: 'categoryData'
                }
            }
        ]);

        if (!allSubCategoryData) {
            return res.status(404).json({ status: 404, message: "SubCategory Not Found" })
        }

        return res.status(200).json({ status: 200, message: "All SubCategory Data Found SuccessFully....", subCategory: allSubCategoryData })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllDispatchProcessProductData = async (req, res) => {
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

exports.getAllDispatchProcesslWarehouseData = async (req, res) => {
    try {
        let allUserData = await warehouse.find()


        if (!allUserData) {
            return res.status(404).json({ status: 404, message: "Warehouse Not Found" })
        }

        return res.status(200).json({ status: 200, message: "All Warehouse User Found SuccessFully...", warehouse: allUserData })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}
exports.getprocessSuggestion = async (req, res) => {
    try {
        let allUserData = await suggestion.find()


        if (!allUserData) {
            return res.status(404).json({ status: 404, message: "suggestion Not Found" })
        }

        return res.status(200).json({ status: 200, message: "All suggestion User Found SuccessFully...", suggestion: allUserData })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}
exports.getprocesskitproduct = async (req, res) => {
    try {
        let allUserData = await kitproduct.find()


        if (!allUserData) {
            return res.status(404).json({ status: 404, message: "kit product Not Found" })
        }

        return res.status(200).json({ status: 200, message: "All kit product Found SuccessFully...", kitproduct: allUserData })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllDispatchProcessByWarehouse = async (req, res) => {

    try {
        const userId = req.params.id;

        const getUserData = await user.findById(userId);
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
                matchStage.push({
                    $lookup: {
                        from: 'commercialmarketings',

                        let: { warehouseId: { $toObjectId: userWarehouse._id } },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$WarehouseId', '$$warehouseId']
                                    }
                                }
                            }
                        ],
                        as: 'commercialMarketingData'
                    }
                });
                matchStage.push({
                    $match: {
                        $expr: {
                            $in: [
                                '$marketId',
                                {
                                    $map: {
                                        input: '$commercialMarketingData',
                                        as: 'cm',
                                        in: '$$cm._id'
                                    }
                                }
                            ]
                        }
                    }
                });
            }
        }


        let paginatedDispatchProcess = await dispatchProcess.aggregate([
            ...matchStage,
            { $unwind: "$ProcessData" },
            { $unwind: "$ProcessData.DispatchDetails" },
            {
                $lookup: {
                    from: 'categories',
                    let: { categoryId: '$ProcessData.DispatchDetails.DispatchCatogory' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ['$_id', { $toObjectId: '$$categoryId' }]
                                }
                            }
                        }
                    ],
                    as: 'dispatchCategoryData'
                }
            },
            {
                $lookup: {
                    from: 'subcategories',
                    let: { subCategoryId: '$ProcessData.DispatchDetails.DispatchSubCatogory' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ['$_id', { $toObjectId: '$$subCategoryId' }]
                                }
                            }
                        }
                    ],
                    as: 'dispatchSubCategoryData'
                }
            },
            {
                $lookup: {
                    from: 'products',
                    let: { productId: '$ProcessData.DispatchDetails.DispatchProductName' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ['$_id', { $toObjectId: '$$productId' }]
                                }
                            }
                        }
                    ],
                    as: 'dispatchProductData'
                }
            },
            {
                $lookup: {
                    from: 'kitproducts',
                    let: { kitId: '$ProcessData.DispatchDetails.DispatchKitId' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ['$_id', { $toObjectId: '$$kitId' }]
                                }
                            }
                        }
                    ],
                    as: 'dispatchKitData'
                }
            },
            {
                $lookup: {
                    from: 'warehouses',
                    localField: 'ProcessData.DebitCreditWarehouseName',
                    foreignField: '_id',
                    as: 'DebitCreditWarehouseData'
                }
            },
            {
                $addFields: {
                    'ProcessData.DispatchDetails': {
                        $mergeObjects: [
                            '$ProcessData.DispatchDetails',
                            {
                                DispatchCatogoryData: { $arrayElemAt: ['$dispatchCategoryData', 0] },
                                DispatchSubCatogoryData: { $arrayElemAt: ['$dispatchSubCategoryData', 0] },
                                DispatchProductNameData: { $arrayElemAt: ['$dispatchProductData', 0] },
                                DispatchKitData: { $arrayElemAt: ['$dispatchKitData', 0] }
                            }
                        ]
                    },
                    'ProcessData.DebitCreditWarehouseData': {
                        $arrayElemAt: ['$DebitCreditWarehouseData', 0]
                    }
                }
            },
            {
                $group: {
                    _id: {
                        _id: '$_id',
                        processDataId: '$ProcessData._id'
                    },
                    marketId: { $first: '$marketId' },
                    ProcessData: {
                        $first: {
                            generatedNumber: '$ProcessData.generatedNumber',
                            bulkId: '$ProcessData.bulkId',
                            PurposeofDispatch: '$ProcessData.PurposeofDispatch',
                            DispatchSuggestionId: '$ProcessData.DispatchSuggestionId',
                            DispatchDate: '$ProcessData.DispatchDate',
                            DebitCreditWarehouseName: '$ProcessData.DebitCreditWarehouseName',
                            DebitCreditWarehouseData: '$ProcessData.DebitCreditWarehouseData',
                            DispatchModelTransport: '$ProcessData.DispatchModelTransport',
                            DispatchRemarks: '$ProcessData.DispatchRemarks'
                        }
                    },
                    DispatchDetails: {
                        $push: '$ProcessData.DispatchDetails'
                    },
                    createdAt: { $first: '$createdAt' },
                    updatedAt: { $first: '$updatedAt' }
                }
            },
            {
                $group: {
                    _id: '$_id._id',
                    marketId: { $first: '$marketId' },
                    ProcessData: {
                        $push: {
                            $mergeObjects: [
                                '$ProcessData',
                                { DispatchDetails: '$DispatchDetails' }
                            ]
                        }
                    },
                    createdAt: { $first: '$createdAt' },
                    updatedAt: { $first: '$updatedAt' }
                }
            }
        ]);

        let count = paginatedDispatchProcess.length;

        return res.status(200).json({ status: 200, TotalDispatchProcess: count, message: 'All Dispatch Process Found Successfully..', dispatchProcess: paginatedDispatchProcess });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
};


exports.getAllDataForCommercialmarket = async (req, res) => {
    try {
        const userId = req.user.id;

        const getUserData = await user.findById(userId);
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
                matchStage.push({ $match: { WarehouseId: userWarehouse._id } });
            }
        }

        let paginatedRCommercialMarket;

        paginatedRCommercialMarket = await commercialMarket.aggregate([
            ...matchStage,
            {
                $lookup: {
                    from: "dealers",
                    localField: "Dealer",
                    foreignField: "_id",
                    as: "dealerData"
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userData"
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "ProductName",
                    foreignField: "_id",
                    as: "productData"
                },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "InverterName",
                    foreignField: "_id",
                    as: "inverterData"
                },
            },
            {
                $lookup: {
                    from: "warehouses",
                    localField: "WarehouseId",
                    foreignField: "_id",
                    as: "wareHouseData"
                },
            },
            {
                $lookup: {
                    from: "liasonings",
                    localField: "_id",
                    foreignField: "marketId",
                    as: "liasoningData"
                }
            },
            {
                $lookup: {
                    from: "accounts",
                    localField: "_id",
                    foreignField: "matketId",
                    as: "AccountData"
                }
            },
        ])

        let count = paginatedRCommercialMarket.length;

        return res.status(200).json({ status: 200, TotalCommercialMarket: count, message: 'All Marketing Data Found Successfully..', commercialMarket: paginatedRCommercialMarket })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}