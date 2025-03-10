const SubCategory = require('../models/subCategory.models');
const roles = require('../models/role.models')

exports.createSubCategory = async (req, res) => {
    try {
        let { categoryName, subCategoryName, unit } = req.body;

        let checkCategory = await SubCategory.findOne({
            subCategoryName: { $regex: new RegExp(`^${subCategoryName}$`, 'i') }
        });

        if (checkCategory) {
            return res.status(400).json({ message: "SubCategory Name Already Exists." });
        }

        const newSubCategory = await SubCategory.create({
            categoryName: categoryName,
            subCategoryName: subCategoryName,
            unit: unit
        });

        return res.status(201).json({ message: "SubCategory Created Successfully.", subCategories: newSubCategory });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};
exports.getAllSubCategory = async (req, res) => {
    try {
        // let page = parseInt(req.query.page) || 1;
        // let pageSize = parseInt(req.query.pageSize) || 10;

        // if (page < 1 || pageSize < 1) {
        //     return res.status(400).json({ message: "Page And PageSize Can't Be Less Than 1" });
        // }

        // const count = await SubCategory.countDocuments();
        let status = false

        let getRoleId = await roles.findById(req.user.role)

        if (getRoleId.roleName === 'Super Admin') {
            status = true
        }

        const paginatedSubCategory = await SubCategory.aggregate([
            {
                $lookup: {
                    from: 'categories',
                    localField: 'categoryName',
                    foreignField: '_id',
                    as: 'categoryData'
                }
            }
        ])
        // .skip((page - 1) * pageSize)
        // .limit(pageSize);

        // if (count === 0) {
        //     return res.status(404).json({ message: "No SubCategories Found" });
        // }

        return res.status(200).json({ message: 'All SubCategories Found Successfully', subCategories: paginatedSubCategory, deleteStatus: status });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

exports.getSubCategoryById = async (req, res) => {
    try {
        const subCategoryById = await SubCategory.findById(req.params.id);

        if (!subCategoryById) {
            return res.status(404).json({ message: "SubCategory Not Found" });
        }

        res.status(200).json({ message: "SubCategory Data Retrieved Successfully", subCategories: subCategoryById });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

exports.updateSubCategory = async (req, res) => {
    try {
        const updatedSubCategory = await SubCategory.findByIdAndUpdate(
            req.params.id,
            { ...req.body },
            { new: true }
        );

        if (!updatedSubCategory) {
            return res.status(404).json({ message: "SubCategory Not Found" });
        }

        return res.status(200).json({ message: "SubCategory Updated Successfully", subCategories: updatedSubCategory });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

exports.deleteSubCategory = async (req, res) => {
    try {
        const deletedSubCategory = await SubCategory.findByIdAndDelete(req.params.id);

        if (!deletedSubCategory) {
            return res.status(404).json({ message: "SubCategory Not Found" });
        }

        return res.status(200).json({ message: "SubCategory Removed Successfully" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};