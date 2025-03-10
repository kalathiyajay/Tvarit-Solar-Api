const stocktransfer = require('../models/stocktransfer.models');

exports.createNewstocktransfer = async (req, res) => {
    try {
        let { categoryId, subCategoryId, productId, description, unitofMeasurement, quantity, debitWarehouseId, creditWarehouseId, pupose, modeofTransport } = req.body;
        // if (checkstocktransfer) {
        //     return res.json({ status: 400, message: "stocktransfer Already Exists" })
        // }
        let checkstocktransfer = await stocktransfer.create({
            categoryId,
            subCategoryId,
            productId,
            description,
            unitofMeasurement,
            quantity,
            debitWarehouseId,
            creditWarehouseId,
            pupose,
            modeofTransport,

        });
        return res.json({ status: 201, message: "stocktransfer Created Successfully", stocktransfer: checkstocktransfer })
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.getAllstocktransferData = async (req, res) => {
    try {

        let page = parseInt(req.query.page);
        let pageSize = parseInt(req.query.pageSize)

        if (page < 1 || pageSize < 1) {
            return res.json({ status: 400, message: "Page And PageSize Can't Be Less Then 1" })
        }

        let paginatedstocktransfer;

        paginatedstocktransfer = await stocktransfer.aggregate([
            {
                $lookup: {
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "categoryData"
                }
            },
            {
                $lookup: {
                    from: "subcategories",
                    localField: "subCategoryId",
                    foreignField: "_id",
                    as: "subCategoryData"
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "productData"
                }
            },
            {
                $lookup: {
                    from: 'warehouses',
                    localField: 'debitWarehouseId',
                    foreignField: '_id',
                    as: 'debitWarehouseData'
                }
            },
            {
                $lookup: {
                    from: 'warehouses',
                    localField: 'creditWarehouseId',
                    foreignField: '_id',
                    as: 'creditWarehouseData'
                }
            }
        ])

        let count = paginatedstocktransfer.length;

        if (count === 0) {
            return res.json({ status: 400, message: "stocktransfer Data Not Found" })
        }

        if (page && pageSize) {
            startIndex = (page - 1) * pageSize;
            lastIndex = (startIndex + pageSize);
            paginatedstocktransfer = paginatedstocktransfer.slice(startIndex, lastIndex)
        }
        return res.json({ status: 200, totalstocktransfer: count, message: "All stocktransfer Found SuccessFully", stocktransfer: paginatedstocktransfer })
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.getstocktransferById = async (req, res) => {
    try {
        let id = req.params.id;

        let checkstocktransfer = await stocktransfer.findById(id);

        if (!checkstocktransfer) {
            return res.json({ status: 404, message: "stocktransfer Not Found." })
        }
        return res.json({ status: 200, message: "stocktransfer Found SuccessFully", stocktransfer: checkstocktransfer });
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};


exports.updateStocktransferData = async (req, res) => {
    try {
        let id = req.params.id;

        let updateStocktransfer = await stocktransfer.findById(id);

        if (!updateStocktransfer) {
            return res.json({ status: 404, message: "stocktransfer Not Found." })
        }

        updateStocktransfer = await stocktransfer.findByIdAndUpdate(id, { ...req.body }, { new: true });

        return res.json({ status: 200, message: "stocktransfer Updated SuccessFully", stocktransfer: updateStocktransfer });
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.deleteStocktransferData = async (req, res) => {
    try {
        let id = req.params.id;

        let deleteStocktransfer = await stocktransfer.findById(id);

        if (!deleteStocktransfer) {
            return res.json({ status: 404, message: "stocktransfer Not Found." })
        }
        deleteStocktransfer = await stocktransfer.findByIdAndDelete(id);

        if (!deleteStocktransfer) {
            return res.json({ status: 404, message: "stocktransfer Not Found" });
        }

        return res.json({ status: 200, message: "stocktransfer Deleted SuccessFully" });
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
}



const category = require('../models/category.models')
const subCategory = require('../models/subCategory.models')
const product = require('../models/product.models')
const warehouse = require('../models/warehouse.model')
const store = require('../models/store.models')

exports.getAllStoreTransferCategoryData = async (req, res) => {
    try {
        let getAllCategory = await category.find()

        if (!getAllCategory) {
            return res.status(404).json({ status: 404, message: "Category Not Found" })
        }

        return res.status(200).json({ status: 200, message: "All Category Found SuccessFully...", category: getAllCategory })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllStoreTransferSubCategoryData = async (req, res) => {
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
            return res.status(404).json({ status: 404, message: "Sub Category Not Found" })
        }

        return res.status(200).json({ status: 200, message: "All SubCategory Found SuccessFully...", subCategory: allSubCategoryData })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllStoreTransferProductData = async (req, res) => {
    try {
        let allProductData = await product.aggregate([
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

        if (!allProductData) {
            return res.status(404).json({ status: 404, message: "Product Not Found" })
        }

        return res.status(200).json({ status: 200, message: "All Product Found SuccessFully...", product: allProductData })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllStoreTransferWarehouseData = async (req, res) => {
    try {
        let allWarehouseUserData = await warehouse.find()

        if (!allWarehouseUserData) {
            return res.status(404).json({ status: 404, message: "Warehouse User Not Found" })
        }

        return res.status(200).json({ status: 200, message: "All warehouse Found SuccessFully...", warehouse: allWarehouseUserData })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getstorestock = async (req, res) => {
    try {
        let allstoreData = await store.find()

        if (!allstoreData) {
            return res.status(404).json({ status: 404, message: "store User Not Found" })
        }

        return res.status(200).json({ status: 200, message: "All store Found SuccessFully...", store: allstoreData })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}