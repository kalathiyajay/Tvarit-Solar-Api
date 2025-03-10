const role = require('../models/role.models');

exports.createRole = async (req, res) => {
    try {
        let { roleName, description, permissions } = req.body;
        // let chekRole = await role.findOne({ roleName: roleName })

        // if (chekRole) {
        //     return res.json({ status: 400, message: "Role Is Alredy Added...  " })
        // }

        let chekRole = await role.create({
            roleName,
            description,
            permissions
        });
        return res.json({ status: 200, message: "Role Added Successfully...  ", role: chekRole })
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.getAllRoles = async (req, res) => {
    try {
        let page = parseInt(req.query.page);
        let pageSize = parseInt(req.query.pageSize)

        if (page < 1 || pageSize < 1) {
            return res.json({ status: 400, message: "Page And PageSize Can't Be Less Then 1" })
        }
        let paginatedRole;

        paginatedRole = await role.find();

        let count = paginatedRole.length;

        if (count === 0) {
            return res.json({ status: 400, message: "Role Not Found" })
        }

        if (page && pageSize) {
            startIndex = (page - 1) * pageSize;
            lastIndex = (startIndex + pageSize);
            paginatedRole = paginatedRole.slice(startIndex, lastIndex)
        }

        return res.json({ status: 200, totalRoles: count, message: "All Roles Found SuccessFully", role: paginatedRole })
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
}

exports.getRoleById = async (req, res) => {
    try {
        let id = req.params.id;
        let checkRoleId = await role.findById(id);

        if (!checkRoleId) {
            return res.json({ status: 400, message: "Role Not Found" })
        }
        return res.json({ status: 200, message: "Role Found SuccessFully", role: checkRoleId });
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.upadetRoleById = async (req, res) => {
    try {
        let id = req.params.id;
        let updateRoleId = await role.findById(id);

        if (!updateRoleId) {
            return res.json({ status: 400, message: "Role Not Found" })
        }
        let updateRole = await role.findByIdAndUpdate(id, { ...req.body }, { new: true });
        return res.json({ status: 200, message: "Role Updated SuccessFully", role: updateRole })
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.deleteRoleById = async (req, res) => {
    try {
        let id = req.params.id;
        let deleteRoleId = await role.findById(id);

        if (!deleteRoleId) {
            return res.json({ status: 400, message: "Role Not Found" })
        }
        let deleteRole = await role.findByIdAndDelete(id);
        return res.json({ status: 200, message: "Role Deleted SuccessFully", role: deleteRole });
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
}
