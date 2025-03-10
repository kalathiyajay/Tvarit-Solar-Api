const wareHouse = require('../models/warehouse.model');
const user = require('../models/user.models');

async function generateWareHouseCode() {
    const prefix = 'WH-';

    const lastwareHouse = await wareHouse.findOne().sort({ createdAt: -1 });

    if (!lastwareHouse) {
        return `${prefix}001`;
    }

    const lastwareHouseCode = lastwareHouse.wareHouseCode;

    if (!lastwareHouseCode.startsWith(prefix)) {
        throw new Error('Unexpected WareHouseCode Format');
    }

    const lastSequenceNumber = parseInt(lastwareHouseCode.substr(prefix.length), 10);

    let newSequenceNumber;
    if (lastSequenceNumber < 999) {
        newSequenceNumber = lastSequenceNumber + 1;
    } else {
        throw new Error('Sequence Number limit reached');
    }

    return `${prefix}${newSequenceNumber.toString().padStart(3, '0')}`;
}

exports.createWareHouse = async (req, res) => {
    try {
        let { wareHouseCode, wareHouseName, contactPersonName, contactNumber, email, address, pincode, state, city, country, district } = req.body;

        let chekcWarhouse = await wareHouse.findOne({ email: email })

        if (chekcWarhouse) {
            return res.status(401).json({ status: 401, message: "Warehouse Already Exists" })
        }

        if (!wareHouseCode) {
            wareHouseCode = await generateWareHouseCode();
        }
        chekcWarhouse = await wareHouse.create({
            wareHouseCode,
            wareHouseName,
            contactPersonName,
            contactNumber,
            email,
            address,
            pincode,
            state,
            city,
            country,
            district
        });

        return res.status(201).json({ status: 201, message: "Warehouse Created Successfully", wareHouse: chekcWarhouse })

    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.getAllWareHouse = async (req, res) => {
    try {
        let page = parseInt(req.query.page);
        let pageSize = parseInt(req.query.pageSize);

        if (page < 1 || pageSize < 1) {
            return res.json({ status: 400, message: "Page And PageSize Can't Be Less Then 1" })
        }
        let paginatedWareHouse;
        paginatedWareHouse = await wareHouse.find();

        let count = paginatedWareHouse.length;

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "No Warhouse Found.." })
        }

        if (page && pageSize) {
            startIndex = (page - 1) * pageSize;
            lastIndex = (startIndex + pageSize)
            paginatedWareHouse = paginatedWareHouse.slice(startIndex, lastIndex)
        }
        return res.json({ status: 200, TotalCategory: count, message: 'All WareHouse Found Successfully..', wareHouse: paginatedWareHouse })
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.getWareHouseById = async (req, res) => {
    try {
        let id = req.params.id;
        let wareHouseById = await wareHouse.findById(id);
        if (!wareHouseById) {
            return res.json({ status: 404, message: "WareHouse Not Found" })
        }
        return res.json({ status: 200, message: "WareHouse Found Successfully..", wareHouse: wareHouseById })
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.updateWareHouseById = async (req, res) => {
    try {
        let id = req.params.id;

        let wareHouseById = wareHouse.findById(id);

        if (!wareHouseById) {
            return res.json({ status: 404, message: "WareHouse Not Found" })
        }
        wareHouseById = await wareHouse.findByIdAndUpdate(id, { ...req.body }, { new: true });
        return res.json({ status: 200, message: "WareHouse Updated Successfully..", wareHouse: wareHouseById });
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.deleteWareHouseById = async (req, res) => {
    try {
        let id = req.params.id;

        let wareHouseById = await wareHouse.findById(id);

        if (!wareHouseById) {
            return res.json({ status: 404, message: "WareHouse Not Found" })
        }
        await wareHouse.findByIdAndDelete(id);
        return res.json({ status: 200, message: "WareHouse Deleted Successfully.." });
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
}

exports.getAllWarehouseUser = async (req, res) => {
    try {
        let getAllUsers = await user.aggregate([
            {
                $lookup: {
                    from: 'roles',
                    localField: "role",
                    foreignField: "_id",
                    as: "roleData"
                }
            },
            {
                $match: {
                    "roleData.permissions": { $in: ['Dispatch', 'Store'] }
                }
            },
            {
                $match: {
                    "roleData.roleName": { $ne: "Super Admin" }
                }
            },
            {
                $project: {
                    name: 1,
                    email: 1
                }
            }
        ])

        if (!getAllUsers) {
            return res.status(404).json({ status: 404, message: "User Not Found" })
        }

        return res.status(200).json({ status: 200, message: "All Warehouse User Found SuccessFully...", warehouseUsers: getAllUsers });
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
        console.log(error);
    }
}