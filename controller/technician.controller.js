const technician = require('../models/technician.modals');
const assign = require('../models/assign.models')
const user = require('../models/user.models')
const role = require('../models/role.models')
const category = require('../models/category.models')
const subCategory = require('../models/subCategory.models')
const product = require('../models/product.models')

exports.createTechnician = async (req, res) => {
    try {

        let { assignId, TechnicianDate, liasoningId, MultipleImages, Amount, Remark, PaymentCreatedAt } = req.body;

        let multipleDetails;
        try {
            multipleDetails = typeof req.body.MultipleImages === 'string'
                ? JSON.parse(req.body.MultipleImages)
                : req.body.MultipleImages || [];
        } catch (parseError) {
            console.error('Error parsing MultipleDetails:', parseError);
            multipleDetails = [];
        }

        multipleDetails = multipleDetails.map(detail => {
            if (detail.technicianImage === null || detail.technicianImage === undefined) {
                return { ...detail, technicianImage: '' };
            }

            if (typeof detail.technicianImage === 'object') {
                console.warn('TechnicianImage is an object:', detail.technicianImage);
                return { ...detail, technicianImage: '' };
            }

            return {
                ...detail,
                technicianImage: String(detail.technicianImage || '')
            };
        });

        // Process file uploads
        if (req.files && req.files['technicianImage']) {
            req.files['technicianImage'].forEach((file, index) => {
                const technicianImageIndex = req.body[`technicianImageIndex_${index}`];
                console.log(`Processing file at index ${index}, technicianImageIndex: ${technicianImageIndex}`);

                if (multipleDetails[technicianImageIndex]) {
                    // Ensure file path is a string
                    multipleDetails[technicianImageIndex].technicianImage = file.path ? String(file.path) : '';
                }
            });
        }

        Object.keys(req.body).forEach(key => {
            if (key.startsWith('ExistingtechnicianImage_')) {
                const index = parseInt(key.split('_')[1]);
                if (multipleDetails[index]) {
                    multipleDetails[index].technicianImage = String(req.body[key] || '');
                }
            }
        });

        if (req.body.Amount > 0) {
            req.body.Amount = req.body.Amount
            PaymentCreatedAt = Date.now()
        }

        const newTechnician = await technician.create({
            assignId,
            TechnicianDate,
            liasoningId,
            MultipleImages: multipleDetails,
            Amount,
            PaymentCreatedAt,
            Remark,
        });

        return res.status(201).json({ status: 201, message: "Technician Entry Created Successfully", technician: newTechnician });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
};


exports.getAllTechnician = async (req, res) => {
    try {
        let page = parseInt(req.query.page);
        let pageSize = parseInt(req.query.pageSize);

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: "Page And PageSize Can't Be Less Than 1" })
        }

        let paginatedTechnician;

        // paginatedTechnician = await technician.find();
        paginatedTechnician = await technician.aggregate([
            {
                $lookup: {
                    from: 'assigninstallers',
                    localField: 'assignId',
                    foreignField: '_id',
                    as: 'assignInstallerData'
                }
            },
            {
                $lookup: {
                    from: 'liasonings',
                    localField: 'liasoningId',
                    foreignField: '_id',
                    as: 'LiasoningData'
                }
            },
            {
                $lookup: {
                    from: 'commercialmarketings',
                    localField: 'LiasoningData.marketId',
                    foreignField: '_id',
                    as: 'marketData'
                }
            }
        ]);


        let count = paginatedTechnician.length;


        if (page && pageSize) {
            startIndex = (page - 1) * pageSize;
            lastIndex = (startIndex + pageSize);
            paginatedTechnician = paginatedTechnician.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, totalTechnician: count, message: "All Technician Found SuccessFully", technician: paginatedTechnician })

    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.getTechnicianById = async (req, res) => {
    try {
        let id = req.params.id

        let gettechnician = await technician.findById(id);

        // if (!gettechnician) {
        //     return res.status(404).json({ status: 404, message: "Fabricator Not Found " })
        // }

        return res.status(200).json({ status: 200, message: "Technician Found SuccessFully...", technician: gettechnician });

    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
        console.log(error);
    }
}


exports.updateTechnician = async (req, res) => {
    try {
        const id = req.params.id;
        let updatedtechnician = await technician.findById(id);

        if (req.body.Amount) {
            req.body.Amount = req.body.Amount
            req.body.PaymentCreatedAt = Date.now()
        }
        if (!updatedtechnician) {
            return res.status(404).json({ status: 404, message: "Technician Not Found" });
        }

        const updatedFields = { ...req.body };

        let multipleDetails = JSON.parse(req.body.MultipleImages || '[]');

        if (req.files && req.files['technicianImage']) {
            req.files['technicianImage'].forEach((file, index) => {
                const technicianImageIndex = req.body[`technicianImageIndex_${index}`];
                if (multipleDetails[technicianImageIndex]) {
                    multipleDetails[technicianImageIndex].technicianImage = file.path;
                }
            });
        }

        // Handle existing dealerImage
        Object.keys(req.body).forEach(key => {
            if (key.startsWith('ExistingtechnicianImage_')) {
                const technicianImageIndex = parseInt(key.split('_')[1]);
                if (multipleDetails[technicianImageIndex]) {
                    multipleDetails[technicianImageIndex].technicianImage = req.body[key];
                }
            }
        });

        // Update the fabricator with the new data
        updatedtechnician = await technician.findByIdAndUpdate(id, {
            $set: { ...updatedFields, MultipleImages: multipleDetails }
        }, { new: true });

        return res.status(200).json({ status: 200, message: "Technician Updated Successfully", technician: updatedtechnician });
    } catch (error) {
        console.error("Error in updateTechnician:", error);
        const errorMessage = error.message || 'An error occurred';
        return res.status(500).json({ status: 500, message: errorMessage });
    }
};


exports.deleteTechnician = async (req, res) => {
    try {
        let id = req.params.id

        let deletedtechnician = await technician.findById(id);

        if (!deletedtechnician) {
            return res.status(400).json({ status: 404, message: "Technician Entry Not Found " })
        }

        await technician.findByIdAndDelete(id);

        return res.status(200).json({ status: 200, message: "Technician Entry Deleted SuccessFully..." });

    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
        console.log(error);
    }
}

exports.updateTechnicianStatus = async (req, res) => {
    try {
        let id = req.params.id;

        let updatedtechnician = await technician.findById(id);

        const updateData = { requestStatus: "Approved" };

        if (req.body.submitDate) {
            updateData.submitDate = req.body.submitDate;
        }

        updatedtechnician = await technician.findByIdAndUpdate(id, updateData, { new: true });

        return res.status(200).json({ status: 200, message: "", technician: updatedtechnician });

    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
        console.log(error);
    }
};


exports.getAssignInTech = async (req, res) => {
    try {

        let getUserData = await user.findById(req.user.id)

        if (!getUserData) {
            return res.status(404).json({ status: 404, message: "User not found" })
        }

        let getRoleData = await role.findById(getUserData.role)

        if (!getRoleData) {
            return res.status(404).json({ status: 404, message: "Role not found" })
        }

        let matchData = [];

        const isSuperAdmin = getRoleData.roleName === "Super Admin";

        if (!isSuperAdmin) {
            matchData.push({ $match: { Technician: req.user.id } })
        }

        let assignInstaller = await assign.aggregate([
            ...matchData,
            {
                $lookup: {
                    from: 'users',
                    localField: 'Fabricator',
                    foreignField: '_id',
                    as: 'fabricatorData'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'Electrician',
                    foreignField: '_id',
                    as: 'electricianData'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'Technician',
                    foreignField: '_id',
                    as: 'technicianData'
                }
            },
            {
                $lookup: {
                    from: 'liasonings',
                    localField: 'liasoningId',
                    foreignField: '_id',
                    as: 'liasoningData'
                }
            },
            {
                $lookup: {
                    from: 'commercialmarketings',
                    localField: 'liasoningData.marketId',
                    foreignField: '_id',
                    as: 'marketData'
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'marketData.InverterName',
                    foreignField: '_id',
                    as: 'inverterData'
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'marketData.ProductName',
                    foreignField: '_id',
                    as: 'ModuleData'
                }
            },
            {
                $lookup: {
                    from: 'fabricators',
                    localField: '_id',
                    foreignField: 'assignId',
                    as: 'fabdata'
                }
            },
            {
                $lookup: {
                    from: 'electricians',
                    localField: '_id',
                    foreignField: 'assignId',
                    as: 'eledata'
                }
            },
            {
                $lookup: {
                    from: 'technicians',
                    localField: '_id',
                    foreignField: 'assignId',
                    as: 'techdata'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'marketData.userId',
                    foreignField: '_id',
                    as: 'marketuserData'
                }
            },
            {
                $lookup: {
                    from: 'installerpayments',
                    localField: 'userId',
                    foreignField: 'Fabricator',
                    as: 'fabricatorPaymentData'
                }
            },
            {
                $lookup: {
                    from: 'installerpayments',
                    localField: 'userId',
                    foreignField: 'Electrician',
                    as: 'electricianPaymentData'
                }
            },
            {
                $lookup: {
                    from: 'installerpayments',
                    localField: 'userId',
                    foreignField: 'Technician',
                    as: 'technicianPaymentData'
                }
            },
        ]);

        let count = assignInstaller.length;

        return res.json({ status: 200, totalAssignInstaller: count, message: "All Assign Installer Found SuccessFully...", assign: assignInstaller })

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};


exports.gettechCategory = async (req, res) => {
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

exports.gettechSubCategory = async (req, res) => {
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

exports.gettechProduct = async (req, res) => {
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