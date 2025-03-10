const dispatchSuggestion = require('../models/dispatchsuggestion.models');
const category = require('../models/category.models')
const subCategory = require('../models/subCategory.models')
const product = require('../models/product.models')

exports.createDispatchSuggestion = async (req, res) => {
    try {
        let { ProjectName, DispatchDetails, DispatchCatogory, DispatchSubCatogory, DispatchProductName, DispatchDiscription, DispatchUnit, DispatchQty } = req.body;
        // console.log(req.body);

        // let chekcKitProduct = await kitProduct.findOne({ kitName: req.body.kitName })

        // if (chekcKitProduct) {
        //     return res.json({ status: 400, message: "kitProduct already exists" })
        // }

        let chekcDispatchSuggestion = await dispatchSuggestion.create({
            ProjectName,
            DispatchDetails,
            DispatchCatogory,
            DispatchSubCatogory,
            DispatchProductName,
            DispatchDiscription,
            DispatchUnit,
            DispatchQty,
        });

        return res.json({ status: 201, message: "Dispatch Suggestion created successfully", dispatchSuggestion: chekcDispatchSuggestion })

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.getAllDispatchSuggestion = async (req, res) => {
    try {
        // let page = parseInt(req.query.page);
        // let pageSize = parseInt(req.query.pageSize);

        // if (page < 1 || pageSize < 1) {
        //     return res.status(400).json({ status: 400, message: "Page And PageSize Can't Be Less Then 1" })
        // }

        let paginatedDispatchSuggestion = await dispatchSuggestion.aggregate([
            {
                $unwind: "$DispatchDetails"
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "DispatchDetails.DispatchCatogory",
                    foreignField: "_id",
                    as: "categoryData"
                }
            },
            {
                $lookup: {
                    from: "subcategories",
                    localField: "DispatchDetails.DispatchSubCatogory",
                    foreignField: '_id',
                    as: 'subCategoryData'
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "DispatchDetails.DispatchProductName",
                    foreignField: "_id",
                    as: "productData"
                }
            },
            {
                $addFields: {
                    "DispatchDetails.category": { $arrayElemAt: ["$categoryData", 0] },
                    "DispatchDetails.subCategory": { $arrayElemAt: ["$subCategoryData", 0] },
                    "DispatchDetails.product": { $arrayElemAt: ["$productData", 0] }
                }
            },
            {
                $group: {
                    _id: "$_id",
                    ProjectName: { $first: "$ProjectName" },
                    createdAt: { $first: "$createdAt" },
                    updatedAt: { $first: "$updatedAt" },
                    DispatchDetails: {
                        $push: {
                            $mergeObjects: [
                                {
                                    DispatchCatogory: "$DispatchDetails.DispatchCatogory",
                                    DispatchSubCatogory: "$DispatchDetails.DispatchSubCatogory",
                                    DispatchProductName: "$DispatchDetails.DispatchProductName",
                                    DispatchDiscription: "$DispatchDetails.DispatchDiscription",
                                    DispatchUnit: "$DispatchDetails.DispatchUnit",
                                    DispatchQty: "$DispatchDetails.DispatchQty",
                                    categoryData: "$DispatchDetails.category",
                                    subCategoryData: "$DispatchDetails.subCategory",
                                    productData: "$DispatchDetails.product"
                                }
                            ]
                        }
                    }
                }
            }
        ]);
        let count = paginatedDispatchSuggestion.length;

        return res.status(200).json({ status: 200, TotalDispatchSuggestion: count, message: 'All Dispatch Suggestion Found Successfully..', dispatchSuggestion: paginatedDispatchSuggestion });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
};

exports.getDispatchSuggestionById = async (req, res) => {
    try {
        let id = req.params.id;
        let dispatchSuggestionById = await dispatchSuggestion.findById(id);
        if (!dispatchSuggestionById) {
            return res.json({ status: 404, message: "Dispatch Suggestion Not Found" })
        }
        return res.json({ status: 200, message: "Dispatch Suggestion Found Successfully..", dispatchSuggestion: dispatchSuggestionById })
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.updateDispatchSuggestionById = async (req, res) => {
    try {
        let id = req.params.id;
        let dispatchSuggestionById = await dispatchSuggestion.findById(id);

        if (!dispatchSuggestionById) {
            return res.json({ status: 404, message: "Dispatch Suggestion Not Found" })
        }
        dispatchSuggestionById = await dispatchSuggestion.findByIdAndUpdate(id, { ...req.body }, { new: true });
        return res.json({ status: 200, message: "Dispatch Suggestion Updated Successfully..", dispatchSuggestion: dispatchSuggestionById });
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.deleteDispatchSuggestionById = async (req, res) => {
    try {
        let id = req.params.id;

        let dispatchSuggestionById = await dispatchSuggestion.findById(id);

        if (!dispatchSuggestionById) {
            return res.json({ status: 404, message: "Dispatch Suggestion Not Found" })
        }
        await dispatchSuggestion.findByIdAndDelete(id);
        return res.json({ status: 200, message: "Dispatch Suggestion Deleted Successfully.." });
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
}

exports.deleteDispatchDetailsById = async (req, res) => {
    try {
        let id = req.params.id;
        let dispatchSuggestionById = await dispatchSuggestion.findOne({ "DispatchDetails._id": id })

        if (!dispatchSuggestionById) {
            return res.json({ status: 404, message: "Dispatch Details Not Found" })
        }
        dispatchSuggestionById = await dispatchSuggestion.findOneAndUpdate(
            { "DispatchDetails._id": id },
            { $pull: { DispatchDetails: { _id: id } } },
            { new: true }
        )
        return res.json({ status: 200, message: "Dispatch Details Deleted Successfully.." })
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
}


exports.getAllDispatchSuggestionCategoryData = async (req, res) => {
    try {
        let allCategoryData = await category.find()

        if (!allCategoryData) {
            return res.status(404).json({ status: 404, message: "Category Not Found" })
        }

        return res.status(200).json({ status: 200, message: "All Category Found SuccessFully...", category: allCategoryData })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllDispatchSuggestionSubCategoryData = async (req, res) => {
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

        return res.status(200).json({ status: 200, message: "All SubCategory Found SuccessFully...", subCategory: allSubCategoryData })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllDispatchSuggestionProductData = async (req, res) => {
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
        ])

        if (!allProductsData) {
            return res.status(404).json({ status: 404, message: "Product Not Found" })
        }

        return res.status(200).json({ status: 200, message: "All Products Found SuccessFully...", products: allProductsData })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}