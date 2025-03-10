const installerPayment = require('../models/installerpayment.model');
const assignInstaller = require('../models/assign.models')
const fabricator = require('../models/fabricator.models');
const electrician = require('../models/electrician.modals');
const technician = require('../models/technician.modals');

exports.createInstallerPayment = async (req, res) => {
    try {
        let { userId, status, monthPeriod, type, fileDetails } = req.body;

        let checkInstallerPayment = await installerPayment.create({
            userId,
            status,
            monthPeriod,
            type,
            // PaymentDate,
            // PaymentAmount,
            // PaymentTDS,
            // PaymentTotal,
            fileDetails
        });

        return res.status(201).json({ status: 201, message: "Installer Payment Is Created SuccessFully..", installerPayment: checkInstallerPayment })

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.getAllInstallerPayment = async (req, res) => {
    try {

        let paginatedInstallerPayment;

        paginatedInstallerPayment = await installerPayment.find();

        let count = paginatedInstallerPayment.length;

        return res.json({ status: 200, TotalInstallerPayment: count, message: 'All Installer Payment Found Successfully..', installerPayment: paginatedInstallerPayment })

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
}

exports.getInstallerPaymentById = async (req, res) => {
    try {
        let id = req.params.id;

        let installerPaymentById = await installerPayment.findById(id);

        if (!installerPaymentById) {
            return res.json({ status: 404, message: "Installer Payment Not Found" })
        }

        res.json({ status: 200, message: "Get Installer Payment Data Successfully...", installerPayment: installerPaymentById })

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
}

exports.updateInstallerPayment = async (req, res) => {
    try {
        let id = req.params.id;

        let checkInstallerPaymentId = installerPayment.findById(id);

        if (!checkInstallerPaymentId) {
            return res.json({ status: 404, message: "Installer Payment Not Found" })
        }

        checkInstallerPaymentId = await installerPayment.findByIdAndUpdate(id, { ...req.body }, { new: true });

        return res.json({ status: 200, message: "Installer Payment Updated Successfully..", installerPayment: checkInstallerPaymentId })

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.deleteInstallerPayment = async (req, res) => {
    try {
        let id = req.params.id;

        let checkInstallerPaymentId = installerPayment.findById(id);

        if (!checkInstallerPaymentId) {
            return res.json({ status: 404, message: "Installer Payment Not Found" })
        }

        checkInstallerPaymentId = await installerPayment.findByIdAndDelete(id);


        return res.json({ status: 200, message: "Installer Payment Data Removed Successfully.." })

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
}

exports.getAllInstallerData = async (req, res) => {
    try {
        let paginatedAssignInstaller;

        paginatedAssignInstaller = await assignInstaller.aggregate([
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

        let count = paginatedAssignInstaller.length;

        return res.json({ status: 200, TotalAssignInstaller: count, message: 'All Assign Installer Found Successfully..', assignInstaller: paginatedAssignInstaller })

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
}

exports.getAllDataFabricator = async (req, res) => {

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

exports.getAllDataElectrician = async (req, res) => {
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


exports.getAllDataTechnician = async (req, res) => {
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