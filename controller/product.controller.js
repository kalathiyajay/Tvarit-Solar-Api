const product = require('../models/product.models');
const roles = require('../models/role.models')

exports.createNewProduct = async (req, res) => {
    try {
        let { productName, unitOfMeasurement, productFor, mainCategory, subCategory, make, specifiaction, Desacription, HSNcode, taxdetails, Warrentry, Size, Color } = req.body;
        let checkProductdata = await product.findOne({
            productName: { $regex: new RegExp(`^${productName}$`, 'i') }
        })


        if (checkProductdata) {
            return res.status(400).json({ status: 400, message: "Product Already Exists" })
        }
        checkProductdata = await product.create({
            productName,
            unitOfMeasurement,
            productFor,
            mainCategory,
            subCategory,
            make,
            specifiaction,
            Desacription,
            HSNcode,
            taxdetails,
            Warrentry,
            Size,
            Color
        });

        return res.status(201).json({ message: "Product Created Successfully", products: checkProductdata })

    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.getAllProductData = async (req, res) => {
    try {
        // let page = parseInt(req.query.page);
        // let pageSize = parseInt(req.query.pageSize)

        // if (page < 1 || pageSize < 1) {
        //     return res.json({ status: 400, message: "Page And PageSize Can't Be Less Then 1" })
        // }

        let status = false

        let getRoleId = await roles.findById(req.user.role)
        console.log(getRoleId);

        if (getRoleId.roleName === 'Super Admin') {
            status = true
        }

        let paginatedProduct;

        paginatedProduct = await product.aggregate([
            {
                $lookup: {
                    from: 'categories',
                    localField: 'mainCategory',
                    foreignField: '_id',
                    as: 'mainCategoryData'
                }
            }, {
                $lookup: {
                    from: 'subcategories',
                    localField: 'subCategory',
                    foreignField: '_id',
                    as: 'subCategoryData'
                }
            }
        ])

        let count = paginatedProduct.length;

        // if (count === 0) {
        //     return res.json({ status: 400, message: "Product Data Not Found" })
        // }

        // if (page && pageSize) {
        //     startIndex = (page - 1) * pageSize;
        //     lastIndex = (startIndex + pageSize);
        //     paginatedProduct = paginatedProduct.slice(startIndex, lastIndex)
        // }

        return res.status(200).json({ status: 200, totalproduct: count, message: "All Product Found SuccessFully", products: paginatedProduct, deleteStatus: status })

    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.getProductById = async (req, res) => {
    try {
        let id = req.params.id;

        let checkProduct = await product.findById(id);

        if (!checkProduct) {
            return res.status(404).json({ status: 404, message: "Product Not Found." })
        }

        return res.status(200).json({ status: 200, message: "Product Found SuccessFully", products: checkProduct });

    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
        console.log(error);
    }
};


exports.updateProductData = async (req, res) => {
    try {
        let id = req.params.id;

        let updateProduct = await product.findById(id);

        if (!updateProduct) {
            return res.status(404).json({ status: 404, message: "Product Not Found." })
        }

        updateProduct = await product.findByIdAndUpdate(id, { ...req.body }, { new: true });

        return res.status(200).json({ status: 200, message: "Product Updated SuccessFully", products: updateProduct });

    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.deleteProductData = async (req, res) => {
    try {
        let id = req.params.id;

        let deleteProduct = await product.findById(id);

        if (!deleteProduct) {
            return res.status(404).json({ status: 404, message: "Product Not Found." })
        }

        deleteProduct = await product.findByIdAndDelete(id);

        if (!deleteProduct) {
            return res.status(404).json({ status: 404, message: "Product Not Found" });
        }

        return res.status(200).json({ status: 200, message: "Product Deleted SuccessFully" });

    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
        console.log(error);
    }
}