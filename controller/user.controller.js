const user = require('../models/user.models');
const roles = require('../models/role.models');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const upload = require('../helper/imageUplode');

exports.createNewUser = async (req, res) => {
    try {
        let { name, email, password, contact, address, city, state, country, avatar, role } = req.body;

        // let chekUser = await user.findOne({ email: req.body.email });
        // if (chekUser) {
        //     return res.json({ status: 400, message: "User Already Exists" });
        // }
        let salt = await bcrypt.genSalt(10);
        let hashPassword = await bcrypt.hash(req.body.password, salt);

        let checkRole = await roles.findOne({ _id: role })

        if (!checkRole) {
            return res.json({ status: 404, message: "Role Not Found" });
        }

        let chekUser = await user.create({
            name,
            email,
            password: hashPassword,
            contact,
            address,
            city,
            state,
            country,
            avatar: req.file.path,
            role
        });

        return res.json({ status: 200, message: "User Created Successfully", user: chekUser });

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        // let page = parseInt(req.query.page);
        // let pageSize = parseInt(req.query.pageSize);

        // if (page < 1 || pageSize < 1) {
        //     return res.json({ status: 400, message: "Page And PageSize Can't Be Less Then 1" })
        // }

        let paginatedUser;

        paginatedUser = await user.aggregate([
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

        // if (count === 0) {
        //     return res.json({ status: 400, message: "Role Not Found" })
        // }

        // if (page && pageSize) {
        //     startIndex = (page - 1) * pageSize;
        //     lastIndex = (startIndex + pageSize);
        //     paginatedUser = paginatedUser.slice(startIndex, lastIndex)
        // }

        return res.json({ status: 200, totalRoles: count, message: "All User Found SuccessFully", user: paginatedUser })

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.getUserById = async (req, res) => {
    try {
        let id = req.params.id

        let userFindById = await user.findById(id);

        if (!userFindById) {
            return res.json({ status: 400, message: "User Not Found" })
        }

        return res.json({ status: 200, message: "User Found SuccessFully", user: userFindById })

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.updateUser = async (req, res) => {
    try {
        let id = req.params.id
        let userUpdateById = await user.findById(id);

        let userData = {}

        if (req.file) {
            userData = {
                ...req.body,
                avatar: req.file.path
            };
        } else {
            userData = {
                ...req.body
            };
        }

        // if (req.body.password) {
        //     let salt = await bcrypt.genSalt(10);
        //     let hashPassword = await bcrypt.hash(req.body.password, salt);
        //     userData.password = hashPassword;
        // }

        if (!userUpdateById) {
            return res.json({ status: 400, message: "User Not Found" })
        }

        if (req.body.role) {
            let checkRole = await roles.findOne({ _id: req.body.role })

            if (!checkRole) {
                return res.json({ status: 404, message: "Role Not Found" });
            }
        }
        userUpdateById = await user.findByIdAndUpdate(id, { ...userData }, { new: true });

        return res.json({ status: 200, message: "User Updated SuccessFully", user: userUpdateById });
    }
    catch (error) {
        console.log(error);
        res.json({ status: 500, message: error.message });
    }
};

exports.removeUser = async (req, res) => {
    try {
        let id = req.params.id

        let removeUser = await user.findById(id);

        if (!removeUser) {
            return res.json({ status: 400, message: "User Not Found" })
        }

        await user.findByIdAndDelete(id);

        return res.json({ status: 200, message: "User Deleted SuccessFully" })

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
}
