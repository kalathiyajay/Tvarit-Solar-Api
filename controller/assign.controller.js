const assignInstaller = require('../models/assign.models');
const liasoning = require('../models/liasoning.models')
const Fabricator = require('../models/fabricator.models')
const Electrician = require('../models/electrician.modals')
const Technician = require('../models/technician.modals')
const user = require('../models/user.models')

exports.createAssignInstaller = async (req, res) => {
    try {
        let { liasoningId, FabricatorDate, Fabricator, ElectricianDate, Electrician, TechnicianDate, Technician } = req.body;

        let checkAssignInstaller = await assignInstaller.create({
            liasoningId: liasoningId,
            FabricatorDate: FabricatorDate,
            Fabricator: Fabricator,
            ElectricianDate: ElectricianDate,
            Electrician: Electrician,
            TechnicianDate: TechnicianDate,
            Technician: Technician
        });

        return res.status(201).json({ status: 201, message: "Assign Installer Is Created SuccessFully..", assignInstaller: checkAssignInstaller })

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.getAllAssignInstaller = async (req, res) => {
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

        let count = paginatedAssignInstaller.length;

        return res.json({ status: 200, TotalAssignInstaller: count, message: 'All Assign Installer Found Successfully..', assignInstaller: paginatedAssignInstaller })

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
}

exports.getAssignInstallerById = async (req, res) => {
    try {
        let id = req.params.id;

        let assignInstallerById = await assignInstaller.findById(id);

        if (!assignInstallerById) {
            return res.json({ status: 404, message: "Assign Installer Not Found" })
        }

        res.json({ status: 200, message: "Get Assign Installer Data Successfully...", assignInstaller: assignInstallerById })

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
}

exports.updateAssignInstaller = async (req, res) => {
    try {
        let id = req.params.id;

        let checkAssignInstallerId = assignInstaller.findById(id);

        if (!checkAssignInstallerId) {
            return res.json({ status: 404, message: "Assign Installer Not Found" })
        }

        checkAssignInstallerId = await assignInstaller.findByIdAndUpdate(id, { ...req.body }, { new: true });

        return res.json({ status: 200, message: "Assign Installer Updated Successfully..", assignInstaller: checkAssignInstallerId })

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};


exports.deleteAssignInstaller = async (req, res) => {
    try {
        let id = req.params.id;

        let checkAssignInstallerId = assignInstaller.findById(id);

        if (!checkAssignInstallerId) {
            return res.json({ status: 404, message: "Assign Installer Not Found" })
        }

        checkAssignInstallerId = await assignInstaller.findByIdAndDelete(id);


        return res.json({ status: 200, message: "Assign Installer Data Removed Successfully.." })

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
}

exports.getAllLiaoningData = async (req, res) => {
    try {
        let getAllLisonings = await liasoning.aggregate([
            // {
            //     $match: {
            //         fileNo: { $ne: null }
            //     }
            // },
            {
                $lookup: {
                    from: 'commercialmarketings',
                    localField: 'marketId',
                    foreignField: '_id',
                    as: 'marketData'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'marketData.userId',
                    foreignField: '_id',
                    as: 'userData'
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
                    as: 'productData'
                }
            },
        ])

        if (!getAllLisonings) {
            return res.status(404).json({ status: 404, message: "No Liaoning Data Found" })
        }

        return res.status(200).json({ status: 200, count: getAllLisonings.length, message: "All Liasoning Data Found SuccessFully...", liasonings: getAllLisonings })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message });
    }
}

exports.getFabricator = async (req, res) => {
    try {
        const getAllFabricators = await Fabricator.aggregate([
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
            }
        ])

        if (!getAllFabricators) {
            return res.status(404).json({ status: 404, message: "No Fabricator Data Found" })
        }

        return res.status(200).json({ status: 200, count: getAllFabricators.length, message: "All Fabricator Data Found SuccessFully...", Fabricator: getAllFabricators })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message });
    }
}

exports.getElectrician = async (req, res) => {
    try {
        const getAllElectrician = await Electrician.aggregate([
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
            }
        ])

        if (!getAllElectrician) {
            return res.status(404).json({ status: 404, message: "No Electrician Data Found" })
        }

        return res.status(200).json({ status: 200, count: getAllElectrician.length, message: "All Electrician Data Found SuccessFully...", Electrician: getAllElectrician })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message });
    }
}

exports.getTechnician = async (req, res) => {
    try {
        const getAllTechnician = await Technician.find()

        if (!getAllTechnician) {
            return res.status(404).json({ status: 404, message: "No Technician Data Found" })
        }

        return res.status(200).json({ status: 200, count: getAllTechnician.length, message: "All Technician Data Found SuccessFully...", Technician: getAllTechnician })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message });
    }
}

exports.getUserinAssign = async (req, res) => {
    try {


        let paginatedUser = await user.aggregate([
            {
                $lookup: {
                    from: 'roles',
                    localField: 'role',
                    foreignField: '_id',
                    as: 'roleData'
                }
            }
        ]);

        let count = paginatedUser.length;

        return res.json({ status: 200, totalRoles: count, message: "All User Found SuccessFully", assignuser: paginatedUser })

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};