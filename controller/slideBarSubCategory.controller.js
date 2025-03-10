const slideBarSubCategory = require('../models/slideBarSubCategoryModel');

exports.createSlideBarSubCategory = async (req, res) => {
    try {
        let { slideBarCategoryId, slideBarSubCategoryName } = req.body

        // let checkSlideBarSubCategory = await slideBarSubCategory.findOne({ slideBarSubCategoryName })

        // if (checkSlideBarSubCategory) {
        //     return res.status(404).json({ status: 404, message: "Slide Bar Sub Category Alredy Added" })
        // }

        let checkSlideBarSubCategory = await slideBarSubCategory.create({
            slideBarCategoryId,
            slideBarSubCategoryName
        });

        return res.status(201).json({ status: 201, message: "Slide Bar Sub Category Created SuccessFully", slideBarSubCategory: checkSlideBarSubCategory })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllSlideBarSubCategory = async (req, res) => {
    try {
        let page = parseInt(req.query.page);
        let pageSize = parseInt(req.query.pageSize)

        if (page < 1 || pageSize < 1) {
            return res.status(404).json({ status: 404, message: "Page And PageSize Cann't Be Less Than 1" })
        }

        let paginatedslideBarSubCategory;

        paginatedslideBarSubCategory = await slideBarSubCategory.find()

        let count = paginatedslideBarSubCategory.length

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "Slide Bar Sub Category Not Found " })
        }

        if (page && pageSize) {
            let startIndex = (page - 1) * pageSize
            let lastIndex = (startIndex + pageSize)
            paginatedslideBarSubCategory = await paginatedslideBarSubCategory.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, totalSlidebarSubCategory: count, message: 'All Slide Bar Sub Category Not Found', slideBarSubCategory: paginatedslideBarSubCategory });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getSlideBarSubCategory = async (req, res) => {
    try {
        let id = req.params.id

        let checkSlideBarId = await slideBarSubCategory.findById(id)

        if (!checkSlideBarId) {
            return res.status(404).json({ status: 404, message: "Slide Bar Sub Category Not Found" })
        }

        return res.status(200).json({ status: 200, message: "Slide Bar Sub Category Found SuccessFully...", slideBarSubCategory: checkSlideBarId });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.updateSlideBarSubCategory = async (req, res) => {
    try {
        let id = req.params.id
        let checkSlideBarId = await slideBarSubCategory.findById(id)

        if (!checkSlideBarId) {
            return res.status(404).json({ status: 404, message: "Slide Bar Sub Category Not Found" })
        }

        checkSlideBarId = await slideBarSubCategory.findByIdAndUpdate(id, { ...req.body }, { new: true });

        return res.status(200).json({ status: 200, message: "Slide Bar Sub Category Updated SuccessFully...", slideBarSubCategory: checkSlideBarId })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.deleteSlidBarSubCategory = async (req, res) => {
    try {
        let id = req.params.id

        let checkSlideBarId = await slideBarSubCategory.findById(id)

        if (!checkSlideBarId) {
            return res.status(404).json({ status: 404, message: "Slide Bar Sub Category Not Found" });
        }

        await slideBarSubCategory.findByIdAndDelete(id);

        return res.status(200).json({ status: 200, message: "Slide Bar Sub Category Remove SuccessFully..." })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}