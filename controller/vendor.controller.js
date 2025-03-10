const vendor = require('../models/vendor.models');

exports.createNewVendor = async (req, res) => {
    try {
        let { businessName, officeAddress, pincode, city, state, district, country, companyEmailId, vendorType, contactPersonalDetails, contactPersonName, designation, department, contactNumber, emailId, registrationType, gstNumber, panNumber, UdyamRegistration, government, supplier, transportar, bankName, bankDetails, branchName, accountNumber, accountType, IFSCCode, bank } = req.body;

        // let chekVenode = await vendor.findOne({ companyEmailId: req.body.companyEmailId });

        // if (chekVenode) {
        //     return res.status(401).json({ status: 401, message: "Vendor Already Exists" });
        // }

        let chekVenode = await vendor.create({
            businessName,
            officeAddress,
            pincode,
            city,
            bank,
            state,
            country,
            companyEmailId,
            contactPersonalDetails,
            contactPersonName,
            designation,
            department,
            contactNumber,
            emailId,
            registrationType,
            gstNumber,
            panNumber,
            UdyamRegistration,
            // government,
            // supplier,
            // transportar,
            bankDetails,
            vendorType,
            bankName,
            branchName,
            accountNumber,
            accountType,
            IFSCCode,
            district
        });

        return res.status(201).json({ status: 201, message: "Vendor created successfully...", vendor: chekVenode });

    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.getAllvendor = async (req, res) => {
    try {
        let page = parseInt(req.query.page);
        let pageSize = parseInt(req.query.pageSize);

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: "Page And PageSize Cann't Be Less than 1" })
        }

        let paginatedvendor;

        paginatedvendor = await vendor.find();

        let count = paginatedvendor.length;

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "Vendor Not Found" })
        }

        if (page && pageSize) {
            startIndex = (page - 1) * pageSize;
            lastIndex = (startIndex + pageSize);
            paginatedvendor = paginatedvendor.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, totalVendor: count, message: "All Vendor Found SuccessFully...", vendor: paginatedvendor })

    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.getvendorById = async (req, res) => {
    try {
        let id = req.params.id
        let vendorFindById = await vendor.findById(id);
        if (!vendorFindById) {
            return res.json({ status: 400, message: "Vendor Not Found" })
        }
        return res.json({ status: 200, message: "Vendor Found SuccessFully", vendor: vendorFindById })
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};
exports.updateVandor = async (req, res) => {
    try {
        let id = req.params.id

        let vendorUpdateById = await vendor.findById(id);

        if (!vendorUpdateById) {
            return res.status(404).json({ status: 404, message: "Vendor Not Found" })
        }
        vendorUpdateById = await vendor.findByIdAndUpdate(id, { ...req.body }, { new: true });
        // console.log(vendorUpdateById);


        return res.status(200).json({ status: 200, message: "Vendor Updated SuccessFully", vendor: vendorUpdateById })

    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.removeVendor = async (req, res) => {
    try {
        let id = req.params.id
        let removevendor = await vendor.findById(id);

        if (!removevendor) {
            return res.json({ status: 400, message: "Vendor Not Found" })
        }

        await vendor.findByIdAndDelete(id);

        return res.json({ status: 200, message: "Vendor Deleted SuccessFully" })
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
}