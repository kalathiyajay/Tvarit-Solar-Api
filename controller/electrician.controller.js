const electrician = require('../models/electrician.modals');
const Liasoning = require('../models/liasoning.models')
const user = require('../models/user.models')
const role = require('../models/role.models')
const assign = require('../models/assign.models')
const category = require('../models/category.models')
const subCategory = require('../models/subCategory.models')
const product = require('../models/product.models')

exports.createElectrician = async (req, res) => {
    try {
        console.log("Incoming data", req.body);
        let { assignId, ElectricianDate, liasoningId, MultipleImages, PaymentCreatedAt, electricianDetails, PanelInverterSerialNo, SystemSize, RateKw, TotalAmount } = req.body;

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
            if (detail.electricianImage === null || detail.electricianImage === undefined) {
                return { ...detail, electricianImage: '' };
            }

            if (typeof detail.electricianImage === 'object') {
                console.warn('electricianImage is an object:', detail.electricianImage);
                return { ...detail, electricianImage: '' };
            }
            return {
                ...detail,
                electricianImage: String(detail.electricianImage || '')
            };
        });

        // Process file uploads
        if (req.files && req.files['electricianImage']) {
            req.files['electricianImage'].forEach((file, index) => {
                const electricianIndex = req.body[`electricianImageIndex_${index}`];
                console.log(`Processing file at index ${index}, electricianIndex: ${electricianIndex}`);

                if (multipleDetails[electricianIndex]) {
                    // Ensure file path is a string
                    multipleDetails[electricianIndex].electricianImage = file.path ? String(file.path) : '';
                }
            });
        }

        Object.keys(req.body).forEach(key => {
            if (key.startsWith('ExistingelectricianImage_')) {
                const index = parseInt(key.split('_')[1]);
                if (multipleDetails[index]) {
                    multipleDetails[index].electricianImage = String(req.body[key] || '');
                }
            }
        });

        if (liasoningId && multipleDetails.length > 0) {
            const getLiasoningData = await Liasoning.findById(liasoningId);

            if (getLiasoningData) {
                const serialDetails = multipleDetails.map(detail => ({
                    field: detail.electricianField || '',
                    image: detail.electricianImage || ''
                }));

                getLiasoningData.SerialNumber = JSON.stringify(serialDetails);
                getLiasoningData.SerialNumberDate = new Date().toISOString().split('T')[0];

                if (!getLiasoningData.filledSteps) {
                    getLiasoningData.filledSteps = [];
                }

                if (!getLiasoningData.filledSteps.includes(3)) {
                    getLiasoningData.filledSteps.push(3);
                    getLiasoningData.applicationStatus = 'NET METER DOCUMENT UPLOAD';
                }

                await getLiasoningData.save();
            }
        }

        if (req.body.TotalAmount > 0) {
            req.body.TotalAmount = req.body.TotalAmount
            PaymentCreatedAt = Date.now()
        }
        const newElectrician = await electrician.create({
            assignId,
            ElectricianDate,
            liasoningId,
            PanelInverterSerialNo,
            MultipleImages: multipleDetails,
            electricianDetails,
            SystemSize,
            RateKw,
            PaymentCreatedAt,
            TotalAmount,
        });

        return res.status(201).json({ status: 201, message: "Electrician Entry Created Successfully", electrician: newElectrician });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
};


exports.getAllElectrician = async (req, res) => {
    try {
        let page = parseInt(req.query.page);
        let pageSize = parseInt(req.query.pageSize);

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: "Page And PageSize Can't Be Less Than 1" })
        }

        let paginatedElectrician;

        // paginatedElectrician = await electrician.find();
        paginatedElectrician = await electrician.aggregate([
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
                    localField: 'electricianDetails.electricianCatogory',
                    foreignField: '_id',
                    as: 'categoryData'
                }
            },
            {
                $lookup: {
                    from: 'subcategories',
                    localField: 'electricianDetails.electricianSubCatogory',
                    foreignField: '_id',
                    as: 'subCategoryData'
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'electricianDetails.electricianProductName',
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



        let count = paginatedElectrician.length;


        if (page && pageSize) {
            startIndex = (page - 1) * pageSize;
            lastIndex = (startIndex + pageSize);
            paginatedElectrician = paginatedElectrician.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, totalElectrician: count, message: "All Electrician Found SuccessFully", electrician: paginatedElectrician })

    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.getElectricianById = async (req, res) => {
    try {
        let id = req.params.id

        let getelectrician = await electrician.findById(id);

        // if (!getfabricator) {
        //     return res.status(404).json({ status: 404, message: "Fabricator Not Found " })
        // }

        return res.status(200).json({ status: 200, message: "Electrician Found SuccessFully...", electrician: getelectrician });

    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
        console.log(error);
    }
}

exports.updateElectrician = async (req, res) => {
    try {
        const id = req.params.id;
        let updatedelectrician = await electrician.findById(id);

        if (req.body.TotalAmount) {
            req.body.TotalAmount = req.body.TotalAmount
            req.body.PaymentCreatedAt = Date.now()
        }

        if (!updatedelectrician) {
            return res.status(404).json({ status: 404, message: "Electrician Not Found" });
        }

        const updatedFields = { ...req.body };

        let multipleDetails = JSON.parse(req.body.MultipleImages || '[]');

        if (req.files && req.files['electricianImage']) {
            req.files['electricianImage'].forEach((file, index) => {
                const electricianImageIndex = req.body[`electricianImageIndex_${index}`];
                if (multipleDetails[electricianImageIndex]) {
                    multipleDetails[electricianImageIndex].electricianImage = file.path;
                }
            });
        }

        Object.keys(req.body).forEach(key => {
            if (key.startsWith('ExistingelectricianImage_')) {
                const index = parseInt(key.split('_')[1]);
                if (multipleDetails[index]) {
                    multipleDetails[index].electricianImage = req.body[key];
                }
            }
        });

        if (updatedelectrician.liasoningId && multipleDetails.length > 0) {

            const getLiasoningData = await Liasoning.findById(updatedelectrician.liasoningId);

            if (getLiasoningData) {
                if (!getLiasoningData.filledSteps) {
                    getLiasoningData.filledSteps = [];
                }

                if (!getLiasoningData.filledSteps.includes(3)) {
                    getLiasoningData.filledSteps.push(3);
                    await getLiasoningData.save();
                }
            }

        }

        updatedelectrician = await electrician.findByIdAndUpdate(id, {
            $set: { ...updatedFields, MultipleImages: multipleDetails }
        }, { new: true });

        return res.status(200).json({ status: 200, message: "Electrician Updated Successfully", electrician: updatedelectrician });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
};



exports.deleteElectrician = async (req, res) => {
    try {
        let id = req.params.id

        let deletedelectrician = await electrician.findById(id);

        if (!deletedelectrician) {
            return res.status(400).json({ status: 404, message: "Electrician Entry Not Found " })
        }

        await electrician.findByIdAndDelete(id);

        return res.status(200).json({ status: 200, message: "Electrician Entry Deleted SuccessFully..." });

    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
        console.log(error);
    }
}

// exports.updateElectricianStatus = async (req, res) => {
//     try {
//         let id = req.params.id

//         let updatedelectrician = await electrician.findById(id);

//         updatedelectrician = await electrician.findByIdAndUpdate(id, { requestStatus: "Approved" }, { new: true });
//     } catch (error) {
//         res.status(500).json({ status: 500, message: error.message });
//         console.log(error);
//     }
// };

exports.updateElectricianStatus = async (req, res) => {
    try {
        let id = req.params.id;

        let updatedelectrician = await electrician.findById(id);

        const updateData = { requestStatus: "Approved" };

        if (req.body.submitDate) {
            updateData.submitDate = req.body.submitDate;
        }

        updatedelectrician = await electrician.findByIdAndUpdate(id, updateData, { new: true });

        return res.status(200).json({ status: 200, message: "", electrician: updatedelectrician });

    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.getAssignInEle = async (req, res) => {
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
            matchData.push({ $match: { Electrician: req.user.id } })
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


exports.geteleCategory = async (req, res) => {
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

exports.geteleSubCategory = async (req, res) => {
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

exports.geteleProduct = async (req, res) => {
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