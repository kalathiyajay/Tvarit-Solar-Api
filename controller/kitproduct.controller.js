const kitProduct = require('../models/kitProduct.models');
const category = require('../models/category.models')
const subCategory = require('../models/subCategory.models')
const product = require('../models/product.models')

exports.createKitProduct = async (req, res) => {
    try {
        let { KitName, KitDetails, KitCatogory, KitSubCatogory, KitProductName, KitDiscription, KitUnit, KitQty } = req.body;
        // console.log(req.body);

        // let chekcKitProduct = await kitProduct.findOne({ kitName: req.body.kitName })

        // if (chekcKitProduct) {
        //     return res.json({ status: 400, message: "kitProduct already exists" })
        // }

        let chekcKitProduct = await kitProduct.create({
            KitName,
            KitDetails,
            KitCatogory,
            KitSubCatogory,
            KitProductName,
            KitDiscription,
            KitUnit,
            KitQty,
        });

        return res.json({ status: 201, message: "kitProduct created successfully", kitProduct: chekcKitProduct })
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.getAllKitProduct = async (req, res) => {
    try {
        // let page = parseInt(req.query.page);
        // let pageSize = parseInt(req.query.pageSize);

        // if (page < 1 || pageSize < 1) {
        //     return res.status(400).json({ status: 400, message: "Page And PageSize Can't Be Less Then 1" })
        // }

        let paginatedKitProduct

        paginatedKitProduct = await kitProduct.aggregate([
            {
                $unwind: "$KitDetails"
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "KitDetails.KitCatogory",
                    foreignField: "_id",
                    as: "categoryData"
                }
            },
            {
                $lookup: {
                    from: "subcategories",
                    localField: "KitDetails.KitSubCatogory",
                    foreignField: '_id',
                    as: 'subCategoryData'
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "KitDetails.KitProductName",
                    foreignField: "_id",
                    as: "productData"
                }
            },
            {
                $addFields: {
                    "KitDetails.categoryData": { $arrayElemAt: ["$categoryData", 0] },
                    "KitDetails.subCategoryData": { $arrayElemAt: ["$subCategoryData", 0] },
                    "KitDetails.productdata": { $arrayElemAt: ["$productData", 0] }
                }
            },
            {
                $group: {
                    _id: "$_id",
                    KitName: { $first: "$KitName" },
                    createdAt: { $first: "$createdAt" },
                    updatedAt: { $first: "$updatedAt" },
                    KitDetails: {
                        $push: {
                            $mergeObjects: [
                                "$KitDetails",
                                {
                                    category: "$KitDetails.category",
                                    subCategory: "$KitDetails.subCategory",
                                    product: "$KitDetails.product"
                                }
                            ]
                        }
                    }
                }
            }
        ]);

        let count = paginatedKitProduct.length;

        // if (count === 0) {
        //     return res.status(404).json({ status: 404, message: "No kitProduct Found.." })
        // }

        // if (page && pageSize) { 
        //     startIndex = (page - 1) * pageSize;
        //     lastIndex = (startIndex + pageSize)
        //     paginatedKitProduct = paginatedKitProduct.slice(startIndex, lastIndex)
        // }

        return res.status(200).json({ status: 200, TotalKitProducts: count, message: 'All kitProduct Found Successfully..', kitProduct: paginatedKitProduct })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
};

exports.getkitProductById = async (req, res) => {
    try {
        let id = req.params.id;
        let kitProductById = await kitProduct.findById(id);
        if (!kitProductById) {
            return res.json({ status: 404, message: "Kit Product Not Found" })
        }
        return res.json({ status: 200, message: "Kit Product Found Successfully..", kitProduct: kitProductById })
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.updateKitProductById = async (req, res) => {
    try {
        let id = req.params.id;

        let kitProductById = await kitProduct.findById(id);

        if (!kitProductById) {
            return res.json({ status: 404, message: "Kit Product Not Found" })
        }
        kitProductById = await kitProduct.findByIdAndUpdate(id, { ...req.body }, { new: true });
        return res.json({ status: 200, message: "Kit Product Updated Successfully..", kitProduct: kitProductById });
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.deleteKitProductById = async (req, res) => {
    try {
        let id = req.params.id;

        let kitProductById = await kitProduct.findById(id);

        if (!kitProductById) {
            return res.json({ status: 404, message: "kitProduct Not Found" })
        }
        await kitProduct.findByIdAndDelete(id);
        return res.json({ status: 200, message: "kitProduct Deleted Successfully.." });
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
}

exports.deleteKitDetilaById = async (req, res) => {
    try {
        let id = req.params.id

        let kitDetailsId = await kitProduct.findOne({ "KitDetails._id": id })

        if (!kitDetailsId) {
            return res.status(404).json({ status: 404, message: "Kit Details Data Not Found" })
        }

        kitDetailsId = await kitProduct.findOneAndUpdate(
            { "KitDetails._id": id },
            { $pull: { KitDetails: { _id: id } } },
            { new: true }
        )

        return res.status(200).json({ status: 200, message: "KitProduct Detail Delete SuccessFully..." })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}


exports.getAllKitCategoryData = async (req, res) => {
    try {
        let allCategory = await category.find()

        if (!allCategory) {
            return res.status(404).json({ status: 404, message: "Category Not Found" })
        }

        return res.status(200).json({ status: 200, message: "All Category Data Found SuccessFully...", category: allCategory })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllKitSubCategoryData = async (req, res) => {
    try {
        let allSubCategory = await subCategory.aggregate([
            {
                $lookup: {
                    from: 'categories',
                    localField: 'categoryName',
                    foreignField: '_id',
                    as: 'categoryData'
                }
            }
        ]);

        if (!allSubCategory) {
            return res.status(404).json({ status: 404, message: "SubCategory Not Found" })
        }

        return res.status(200).json({ status: 200, message: "All SubCategory Data Found SuccessFully...", subCategory: allSubCategory })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllKitsProductData = async (req, res) => {
    try {
        let allProduct = await product.aggregate([
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

        if (!allProduct) {
            return res.status(404).json({ status: 404, message: "Product Not Found" })
        }

        return res.status(200).json({ status: 200, message: "All Products Found SuccessFully...", products: allProduct })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
} 