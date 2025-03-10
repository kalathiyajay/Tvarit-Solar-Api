const dealerRegitser = require('../models/dealerRegister.models');
const roles = require('../models/role.models');
const bcrypt = require('bcryptjs')

exports.createDealerRegister = async (req, res) => {
    try {
        let { name, email, password, address, city, state, contactNo, country, image, marketingType, role } = req.body;
        // let checkDealerRegister = await dealerRegitser.findOne({ email: req.body.email })

        // if (checkDealerRegister) {
        //     return res.json({ status: 400, message: "DealerRegitser already exists" })
        // }

        let salt = await bcrypt.genSalt(10);
        let hashPassword = await bcrypt.hash(req.body.password, salt);

        let checkRole = await roles.findOne({ roleName: req.body.role })
        if (!checkRole) {
            return res.json({ status: 404, message: "Role not found" });
        }
        let checkDealerRegister = await dealerRegitser.create({
            name,
            email,
            password: hashPassword,
            address,
            city,
            state,
            contactNo,
            country,
            image: req.file.path,
            marketingType,
            role
        });
        return res.json({ status: 201, message: "DealerRegitser created successfully", DealerRegister: checkDealerRegister })
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.getAllDealersRegister = async (req, res) => {
    try {
        let page = parseInt(req.query.page);
        let pageSize = parseInt(req.query.pageSize);

        if (page < 1 || pageSize < 1) {
            return res.json({ status: 400, message: "Page And PageSize Can't Be Less Then 1" })
        }

        let paginatedDealerRegister;
        paginatedDealerRegister = await dealerRegitser.find();
        let count = paginatedDealerRegister.length;

        if (count === 0) {
            return res.json({ status: 400, message: "Dealer Register Not Found  " })
        }

        if (page && pageSize) {
            startIndex = (page - 1) * pageSize;
            lastIndex = (startIndex + pageSize);
            paginatedDealerRegister = paginatedDealerRegister.slice(startIndex, lastIndex)
        }

        return res.json({ status: 200, totalDealersRegister: count, message: "All Dealer Register Found SuccessFully", DealerRegister: paginatedDealerRegister })
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.getDealerRegisterById = async (req, res) => {
    try {
        let id = req.params.id

        let getdealerRegister = await dealerRegitser.findById(id);
        if (!getdealerRegister) {
            return res.json({ status: 400, message: "Dealer Register Not Found " })
        }
        return res.json({ status: 200, message: "Dealer Register Found SuccessFully...", DealerRegister: getdealerRegister });
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
}

exports.updateDealerRegister = async (req, res) => {
    try {
        let id = req.params.id

        let updatedealerRegister = await dealerRegitser.findById(id);
        if (!updatedealerRegister) {
            return res.json({ status: 400, message: "Dealer Register Not Found " })
        }
        if (req.file) {
            req.body.image = req.file.path
        }
        updatedealerRegister = await dealerRegitser.findByIdAndUpdate(id, { ...req.body }, { new: true });

        return res.json({ status: 200, message: "Dealer Register Updated SuccessFully...", DealerRegister: updatedealerRegister });
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.deleteDealerRegister = async (req, res) => {
    try {
        let id = req.params.id

        let deleteDealerRegister = await dealerRegitser.findById(id);
        if (!deleteDealerRegister) {
            return res.json({ status: 400, message: "Dealer Register Not Found " })
        }
        await dealerRegitser.findByIdAndDelete(id);
        return res.json({ status: 200, message: "Dealer Register Deleted SuccessFully..." });
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
}
