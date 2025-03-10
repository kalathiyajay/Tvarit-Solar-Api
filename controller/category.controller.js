const category = require('../models/category.models');
const roles = require('../models/role.models')

exports.createCategory = async (req, res) => {
    try {
        let { categoryName } = req.body;

        let checkCategory = await category.findOne({
            categoryName: { $regex: new RegExp(`^${categoryName}$`, 'i') }
        });

        if (checkCategory) {
            return res.status(400).json({ status: 400, message: "Category Name Is Already Exist.." })
        }

        checkCategory = await category.create({
            categoryName: categoryName,
        });

        return res.status(201).json({ status: 201, message: "Category Is Created SuccessFully..", category: checkCategory })

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.getAllCategory = async (req, res) => {
    try {
        // let page = parseInt(req.query.page);
        // let pageSize = parseInt(req.query.pageSize);

        // if (page < 1 || pageSize < 1) {
        //     return res.json({ status: 400, message: "Page And PageSize Can't Be Less Then 1" })
        // }
        let status = false

        let getRoleId = await roles.findById(req.user.role)

        if (getRoleId.roleName === 'Super Admin') {
            status = true
        }

        let paginatedCategory;

        paginatedCategory = await category.find();

        let count = paginatedCategory.length;

        // if (count === 0) {
        //     return res.json({ status: 404, message: "No Category Found.." })
        // }

        // if (page && pageSize) {
        //     startIndex = (page - 1) * pageSize;
        //     lastIndex = (startIndex + pageSize)
        //     paginatedCategory = paginatedCategory.slice(startIndex, lastIndex)
        // }

        return res.json({ status: 200, TotalCategory: count, message: 'All Category Found Successfully..', category: paginatedCategory, deleteStatus: status })

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
}

exports.getCategoryById = async (req, res) => {
    try {
        let id = req.params.id;

        let categoryById = await category.findById(id);

        if (!categoryById) {
            return res.json({ status: 404, message: "Category Not Found" })
        }

        res.json({ status: 200, message: "Get Category Data Successfully...", category: categoryById })

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
}

exports.updateCategory = async (req, res) => {
    try {
        let id = req.params.id;

        let checkCategoryId = category.findById(id);

        if (!checkCategoryId) {
            return res.json({ status: 404, message: "Category Not Found" })
        }

        checkCategoryId = await category.findByIdAndUpdate(id, { ...req.body }, { new: true });

        return res.json({ status: 200, message: "Category Updated Successfully..", category: checkCategoryId })

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};


exports.deleteCategory = async (req, res) => {
    try {
        let id = req.params.id;

        let checkCategoryId = category.findById(id);

        if (!checkCategoryId) {
            return res.json({ status: 404, message: "Category Not Found" })
        }

        checkCategoryId = await category.findByIdAndDelete(id);

        // if (!checkCategoryId) {
        //     return res.json({ status: 404, message: "Category Not Found" });
        // }

        return res.json({ status: 200, message: "Category Data Removed Successfully.." })
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
}
