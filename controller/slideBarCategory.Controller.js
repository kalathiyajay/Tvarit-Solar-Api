const slideBarCategory = require('../models/slideBarCategoryModels');

exports.createSlideBarCategory = async (req, res) => {
    try {
        let { categoryName, to, slideBarCategoryId, subsidebaradd } = req.body;

        if (!req.files || !req.files['slideBarImage']) {
            return res.status(401).json({ status: 401, message: "SideBar Image File Required" });
        }

        let Subsidebar;
        try {
            Subsidebar = typeof req.body.subsidebaradd === 'string'
                ? JSON.parse(req.body.subsidebaradd)
                : req.body.subsidebaradd || [];
        } catch (parseError) {
            console.error('Error parsing Subsidebar:', parseError);
            Subsidebar = [];
        }

        Subsidebar = Subsidebar.map(detail => {
            if (detail.subcategoryimages === null || detail.subcategoryimages === undefined) {
                return { ...detail, subcategoryimages: '' };
            }

            if (typeof detail.subcategoryimages === 'object') {
                console.warn('subcategoryimages is an object:', detail.subcategoryimages);
                return { ...detail, subcategoryimages: '' };
            }

            return {
                ...detail,
                subcategoryimages: String(detail.subcategoryimages || '')
            };
        });

        // Process file uploads
        if (req.files && req.files['subcategoryimages']) {
            req.files['subcategoryimages'].forEach((file, index) => {
                const paymentIndex = req.body[`subcategoryimagesIndex_${index}`];
                console.log(`Processing file at index ${index, paymentIndex}`);

                if (Subsidebar[paymentIndex]) {
                    Subsidebar[paymentIndex].subcategoryimages = file.path ? String(file.path) : '';
                }
            });
        }

        Object.keys(req.body).forEach(key => {
            if (key.startsWith('Existingsubcategoryimages_')) {
                const index = parseInt(key.split('_')[1]);
                if (Subsidebar[index]) {
                    Subsidebar[index].subcategoryimages = String(req.body[key] || '');
                }
            }
        });

        let checkSlideBarCategory = await slideBarCategory.create({
            categoryName,
            to,
            slideBarImage: req.files['slideBarImage'][0].path,
            subsidebaradd: Subsidebar,
            slideBarCategoryId
        });

        return res.status(201).json({ status: 201, message: "SideBar Category Created SuccessFully...", sidebar: checkSlideBarCategory });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
};

exports.getAllSlideBarCategory = async (req, res) => {
    try {
        let paginatedSlideBarCategory = await slideBarCategory.find({ categoryName: { $in: req.user.permissions } });

        let count = paginatedSlideBarCategory.length

        return res.status(200).json({ status: 200, sidebar: count, message: "All SideBar Category Found SuccessFully...", sidebar: paginatedSlideBarCategory })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllSlideBarCategoryByAdmin = async (req, res) => {
    try {
        let paginatedSlideBarCategory = await slideBarCategory.find();

        let count = paginatedSlideBarCategory.length

        return res.status(200).json({ status: 200, sidebar: count, message: "All SideBar Category Found SuccessFully...", sidebar: paginatedSlideBarCategory })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.slideBarCategory = async (req, res) => {
    try {

        let paginatedSlideBarCategory = await slideBarCategory.find();

        return res.status(200).json({ status: 200, message: "All SideBar Category Found SuccessFully...", sidebar: paginatedSlideBarCategory })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getSlideBarCategory = async (req, res) => {
    try {
        let id = req.params.id

        let checkSlideBarId = await slideBarCategory.findById(id)

        if (!checkSlideBarId) {
            return res.status(404).json({ status: 404, message: "SideBar Category Not Found" })
        }

        return res.status(200).json({ status: 200, message: "SideBar Category Found SuccessFully...", sidebar: checkSlideBarId });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.updateSlideBarCategory = async (req, res) => {
    try {
        let id = req.params.id;
        let checkSlideBarId = await slideBarCategory.findById(id);

        if (!checkSlideBarId) {
            return res.status(404).json({ status: 404, message: "SideBar Category Not Found" });
        }

        if (req.files && req.files['slideBarImage']) {
            req.body.slideBarImage = req.files['slideBarImage'][0].path;
        }

        let SubsidebarAdd = JSON.parse(req.body.subsidebaradd || '[]');

        if (req.files && req.files['subcategoryimages']) {
            req.files['subcategoryimages'].forEach((file, index) => {
                const subcategoryimagesIndex = req.body[`subcategoryimagesIndex_${index}`];
                if (SubsidebarAdd[subcategoryimagesIndex]) {
                    SubsidebarAdd[subcategoryimagesIndex].subcategoryimages = file.path;
                }
            });
        }

        // Handle existing subcategory images
        Object.keys(req.body).forEach(key => {
            if (key.startsWith('Existingsubcategoryimages_')) {
                const index = parseInt(key.split('_')[1]);
                if (SubsidebarAdd[index]) {
                    SubsidebarAdd[index].subcategoryimages = req.body[key];
                }
            }
        });

        checkSlideBarId = await slideBarCategory.findByIdAndUpdate(id, { $set: { ...req.body, subsidebaradd: SubsidebarAdd } }, { new: true });

        return res.status(200).json({ status: 200, message: "SideBar Category Updated SuccessFully...", sidebar: checkSlideBarId });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
};

exports.deleteSlidBarCategory = async (req, res) => {
    try {
        let id = req.params.id

        let checkSlideBarId = await slideBarCategory.findById(id)

        if (!checkSlideBarId) {
            return res.status(404).json({ status: 404, message: "SideBar Category Not Found" });
        }

        await slideBarCategory.findByIdAndDelete(id);

        return res.status(200).json({ status: 200, message: "SideBar Category Remove SuccessFully..." })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}