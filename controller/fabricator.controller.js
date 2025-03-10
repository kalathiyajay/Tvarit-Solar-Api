const fabricator = require('../models/fabricator.models');
const assign = require('../models/assign.models')
const user = require('../models/user.models')
const role = require('../models/role.models')
const category = require('../models/category.models')
const subCategory = require('../models/subCategory.models')
const product = require('../models/product.models')

exports.createFabricator = async (req, res) => {
    try {

        console.log("Incoming data", req.body);


        let { assignId, FabricatorDate, liasoningId, PaymentCreatedAt, MultipleImages, fabricatorDetails, SystemSize, RateKw, TotalAmount } = req.body;

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
            if (detail.fabricatorImage === null || detail.fabricatorImage === undefined) {
                return { ...detail, fabricatorImage: '' };
            }

            if (typeof detail.fabricatorImage === 'object') {
                console.warn('fabricatorImage is an object:', detail.fabricatorImage);
                return { ...detail, fabricatorImage: '' };
            }

            return {
                ...detail,
                fabricatorImage: String(detail.fabricatorImage || '')
            };
        });

        // Process file uploads
        if (req.files && req.files['fabricatorImage']) {
            req.files['fabricatorImage'].forEach((file, index) => {
                const paymentIndex = req.body[`fabricatorImageIndex_${index}`];
                console.log(`Processing file at index ${index}, paymentIndex: ${paymentIndex}`);

                if (multipleDetails[paymentIndex]) {
                    // Ensure file path is a string
                    multipleDetails[paymentIndex].fabricatorImage = file.path ? String(file.path) : '';
                }
            });
        }

        Object.keys(req.body).forEach(key => {
            if (key.startsWith('ExistingfabricatorImage_')) {
                const index = parseInt(key.split('_')[1]);
                if (multipleDetails[index]) {
                    multipleDetails[index].fabricatorImage = String(req.body[key] || '');
                }
            }
        });


        if (req.body.TotalAmount > 0) {
            req.body.TotalAmount = req.body.TotalAmount
            PaymentCreatedAt = Date.now()
        }

        const newFabricator = await fabricator.create({
            assignId,
            FabricatorDate,
            liasoningId,
            MultipleImages: multipleDetails,
            fabricatorDetails,
            SystemSize,
            RateKw,
            TotalAmount,
            PaymentCreatedAt,
        });

        return res.status(201).json({ status: 201, message: "Fabricator Entry Created Successfully", fabricator: newFabricator });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
};


exports.getAllFabricator = async (req, res) => {
    try {
        let page = parseInt(req.query.page);
        let pageSize = parseInt(req.query.pageSize);

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: "Page And PageSize Can't Be Less Than 1" })
        }

        let paginatedFabricator;

        // paginatedFabricator = await fabricator.find();

        paginatedFabricator = await fabricator.aggregate([
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
                    from: 'categories',
                    localField: 'fabricatorDetails.fabricatorCatogory',
                    foreignField: '_id',
                    as: 'categoryData'
                }
            },
            {
                $lookup: {
                    from: 'subcategories',
                    localField: 'fabricatorDetails.fabricatorSubCatogory',
                    foreignField: '_id',
                    as: 'subCategoryData'
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'fabricatorDetails.fabricatorProductName',
                    foreignField: '_id',
                    as: 'productData'
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


        let count = paginatedFabricator.length;


        if (page && pageSize) {
            startIndex = (page - 1) * pageSize;
            lastIndex = (startIndex + pageSize);
            paginatedFabricator = paginatedFabricator.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, totalFabricator: count, message: "All Fabricator Found SuccessFully", fabricator: paginatedFabricator })

    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.getFabricatorById = async (req, res) => {
    try {
        let id = req.params.id

        let getfabricator = await fabricator.findById(id);

        // if (!getfabricator) {
        //     return res.status(404).json({ status: 404, message: "Fabricator Not Found " })
        // }

        return res.status(200).json({ status: 200, message: "Fabricator Found SuccessFully...", fabricator: getfabricator });

    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
        console.log(error);
    }
}


exports.updateFabricator = async (req, res) => {
    try {
        const id = req.params.id;
        let updatedfabricator = await fabricator.findById(id);

        if (req.body.TotalAmount) {
            req.body.TotalAmount = req.body.TotalAmount
            req.body.PaymentCreatedAt = Date.now()
        }

        if (!updatedfabricator) {
            return res.status(404).json({ status: 404, message: "Fabricator Not Found" });
        }

        const updatedFields = { ...req.body };

        let multipleDetails = JSON.parse(req.body.MultipleImages || '[]');

        if (req.files && req.files['fabricatorImage']) {
            req.files['fabricatorImage'].forEach((file, index) => {
                const fabricatorImageIndex = req.body[`fabricatorImageIndex_${index}`];
                if (multipleDetails[fabricatorImageIndex]) {
                    multipleDetails[fabricatorImageIndex].fabricatorImage = file.path;
                }
            });
        }

        // Handle existing dealerImage
        Object.keys(req.body).forEach(key => {
            if (key.startsWith('ExistingfabricatorImage_')) {
                const index = parseInt(key.split('_')[1]);
                if (multipleDetails[index]) {
                    multipleDetails[index].fabricatorImage = req.body[key];
                }
            }
        });

        // Update the fabricator with the new data
        updatedfabricator = await fabricator.findByIdAndUpdate(id, {
            $set: { ...updatedFields, MultipleImages: multipleDetails }
        }, { new: true });

        return res.status(200).json({ status: 200, message: "Fabricator Updated Successfully", fabricator: updatedfabricator });
    } catch (error) {
        console.error("Error in updateFabricator:", error);
        const errorMessage = error.message || 'An error occurred';
        return res.status(500).json({ status: 500, message: errorMessage });
    }
};


exports.deleteFabricator = async (req, res) => {
    try {
        let id = req.params.id

        let deletedfabricator = await fabricator.findById(id);

        if (!deletedfabricator) {
            return res.status(400).json({ status: 404, message: "Fabricator Entry Not Found " })
        }

        await fabricator.findByIdAndDelete(id);

        return res.status(200).json({ status: 200, message: "Fabricator Entry Deleted SuccessFully..." });

    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
        console.log(error);
    }
}

exports.updateFabricatorStatus = async (req, res) => {
    try {
        let id = req.params.id;

        let updatedfabricator = await fabricator.findById(id);

        const updateData = { requestStatus: "Approved" };

        if (req.body.submitDate) {
            updateData.submitDate = req.body.submitDate;
        }

        updatedfabricator = await fabricator.findByIdAndUpdate(id, updateData, { new: true });

        return res.status(200).json({ status: 200, message: "", fabricator: updatedfabricator });

    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.getAssignInFab = async (req, res) => {
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
            matchData.push({ $match: { Fabricator: req.user.id } })
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

exports.getfabCategory = async (req, res) => {
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

exports.getfabSubCategory = async (req, res) => {
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

exports.getfabProduct = async (req, res) => {
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

exports.getfabUser = async (req, res) => {
    try {
        let alluser = await user.aggregate([
            {
                $lookup: {
                    from: 'roles',
                    localField: 'role',
                    foreignField: '_id',
                    as: 'roleData'
                }
            }
        ]);

        if (!alluser) {
            return res.status(404).json({ status: 404, message: "User Not Found" })
        }

        return res.status(200).json({ status: 200, message: "All Users Found SuccessFully...", Userfab: alluser })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}