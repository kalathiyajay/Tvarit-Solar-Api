const credit = require('../models/credit.models');

exports.createCredit = async (req, res) => {
    try {
        let { srNo, category, subCategory, description, vender, date, Kw, address, consumerNo, dealer, quantity, wareHouse, amount, gst, totalAmount, unitPrice } = req.body;
        // let checkCredit = await credit.findOne({ srNo: req.body.srNo })
        // if (checkCredit) {
        //     return res.json({ status: 400, message: "Credit Name Is Already Exist.." })
        // }

        let checkCredit = await credit.create({
            srNo,
            category,
            subCategory,
            description,
            vender,
            date,
            Kw,
            address,
            consumerNo,
            dealer,
            quantity,
            wareHouse,
            amount,
            gst,
            totalAmount,
            unitPrice
        });

        return res.json({ status: 201, message: "Credit Is Created SuccessFully..", credit: checkCredit })
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.getAllCreadit = async (req, res) => {
    try {
        let page = parseInt(req.query.page);
        let pageSize = parseInt(req.query.pageSize);

        if (page < 1 || pageSize < 1) {
            return res.json({ status: 400, message: "Page And PageSize Can't Be Less Then 1" })
        }

        let paginatedCredit;
        paginatedCredit = await credit.find();
        let count = paginatedCredit.length;

        if (count === 0) {
            return res.json({ status: 404, message: "No Credit Found.." })
        }

        if (page && pageSize) {
            startIndex = (page - 1) * pageSize;
            lastIndex = (startIndex + pageSize)
            paginatedCredit = paginatedCredit.slice(startIndex, lastIndex)
        }

        return res.json({ status: 200, TotalCredit: count, message: 'All Credit Found Successfully..', category: paginatedCredit })
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
}

exports.getCerditById = async (req, res) => {
    try {
        let id = req.params.id;
        let creditById = await credit.findById(id);
        if (!creditById) {
            return res.json({ status: 404, message: "Credit Not Found" })
        }
        res.json({ status: 200, message: "Get Credit Data Successfully...", credit: creditById })
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
}

exports.updateCredit = async (req, res) => {
    try {
        let id = req.params.id;

        let checkCreditId = await credit.findById(id);

        if (!checkCreditId) {
            return res.json({ status: 404, message: "Credit Not Found" })
        }

        checkCreditId = await credit.findByIdAndUpdate(id, { ...req.body }, { new: true });

        return res.json({ status: 200, message: "Credit Updated Successfully..", category: checkCreditId })
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.deleteCredit = async (req, res) => {
    try {
        let id = req.params.id;

        let checkCreditId = await credit.findById(id);

        if (!checkCreditId) {
            return res.json({ status: 404, message: "Credit Not Found" })
        }

        await credit.findByIdAndDelete(id);

        return res.json({ status: 200, message: "Credit Removed Successfully.." })
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
}
