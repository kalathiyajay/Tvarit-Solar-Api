const bom = require('../models/bom.modals')
const category = require('../models/category.models')
const subCategory = require('../models/subCategory.models')
const product = require('../models/product.models')
const store = require('../models/store.models')

exports.createBom = async (req, res) => {
    try {
        let { BOMName, Date, bomsuggestion, systemSize, Remarks1, Remarks2, Remarks3, Remarks4, Remarks5, Remarks6, TypesOfProject, BomDetails, bomcategory, bomsubcategory, bomproduct, bomdescription, bomqty, bomlastprice, bomamount, Amount1, Amount2, Amount3, Amount4, Amount5, Amount6, terms, userId, unitprice1, unitprice2, unitprice3, unitprice4, unitprice5, unitprice6, Amount, GST, TotalAmount, subcidy, PriceAfterSubcidy, Total, SystemSize1, SystemSize2, SystemSize3, SystemSize5, SystemSize6 } = req.body

        // let checkDescriptionName = await termsAndCondition.findOne({ name })

        // if (checkDescriptionName) {
        //     return res.status(409).json({ status: 409, message: "Name Is Alredy Added" })
        // }

        let checkBom = await bom.create({
            BOMName,
            systemSize,
            bomsuggestion,
            Date,
            TypesOfProject,
            BomDetails,
            bomcategory,
            bomsubcategory,
            Total,
            bomproduct,
            bomdescription,
            bomqty,
            bomlastprice,
            bomamount,
            Remarks1,
            Remarks2,
            Remarks3,
            Remarks4,
            Remarks5,
            Remarks6,
            terms,
            userId,
            Amount1,
            Amount2,
            Amount3,
            Amount4,
            Amount5,
            Amount6,
            unitprice1,
            unitprice2,
            unitprice3,
            unitprice4,
            unitprice5,
            unitprice6,
            Amount,
            GST,
            TotalAmount,
            SystemSize1,
            SystemSize2,
            SystemSize3,
            SystemSize5,
            SystemSize6,
            subcidy,
            PriceAfterSubcidy
        });

        return res.status(201).json({ status: 201, message: "Bill Of Material Created SuccessFully...", bom: checkBom });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllBom = async (req, res) => {
    try {
        let page = parseInt(req.query.page);
        let pageSize = parseInt(req.query.pageSize)

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: "Page And Page Size Cann't Be Less Than 1" })
        }

        let paginatedAllConditions;

        // paginatedAllConditions = await bom.find();
        paginatedAllConditions = await bom.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userData'
                }
            },
            {
                $lookup: {
                    from: 'termsandconditions',
                    localField: 'terms',
                    foreignField: '_id',
                    as: 'termsData'
                }
            },
        ])

        let count = paginatedAllConditions.length

        // if (count === 0) {
        //     return res.status(404).json({ status: 404, message: "Terms And Conditions Not Found" })
        // }

        if (page && pageSize) {
            let startIndex = (page - 1) * pageSize
            let lastIndex = (startIndex + pageSize)
            paginatedAllConditions = paginatedAllConditions.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, totalBom: count, message: "All Bill Of Material Found SuccessFully..", bom: paginatedAllConditions });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getBomById = async (req, res) => {
    try {
        let id = req.params.id

        let getBomId = await bom.findById(id)

        if (!getBomId) {
            return res.status(404).json({ status: 404, message: "Bill Of Material Not Found" })
        }

        return res.status(200).json({ status: 200, message: "Bill Of Material Found SuccessFully...", bom: getBomId })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.updateBomById = async (req, res) => {
    try {
        let id = req.params.id;
        console.log("Updating BOM with ID:", id, "and data:", req.body);

        let updateBomId = await bom.findById(id);

        if (!updateBomId) {
            return res.status(404).json({ status: 404, message: "Bill Of Material Not Found" });
        }

        updateBomId = await bom.findByIdAndUpdate(id, { ...req.body }, { new: true });

        return res.status(200).json({ status: 200, message: "Bill Of Material Update SuccessFully...", bom: updateBomId });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
}

exports.deleteBomById = async (req, res) => {
    try {
        let id = req.params.id

        let deleteBomId = await bom.findById(id)

        if (!deleteBomId) {
            return res.status(404).json({ status: 404, message: "Bill Of Material Not Found" })
        }

        await bom.findByIdAndDelete(id);

        return res.status(200).json({ status: 200, message: "Bill Of Material Delete SuccessFully..." });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getBomCategory = async (req, res) => {
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

exports.getBomSubCategory = async (req, res) => {
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

exports.getBomProduct = async (req, res) => {
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

exports.getBomstore = async (req, res) => {
    try {
        let allstore = await store.find()

        if (!allstore) {
            return res.status(404).json({ status: 404, message: "store Not Found" })
        }

        return res.status(200).json({ status: 200, message: "All stores Found SuccessFully...", store: allstore })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
} 