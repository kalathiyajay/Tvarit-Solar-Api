const purchaseInvoice = require('../models/purchaseInvoice.models');

exports.createNewPurchaseInvoice = async (req, res) => {
    try {
        let { vendor, date, srNo, itemCategory, itemSubCategory, totalAmount, wareHouse, amount, uplodFile } = req.body;

        // let checkPurchaseInvoicedata = await purchaseInvoice.findOne({ srNo: req.body.srNo })
        // if (checkPurchaseInvoicedata) {
        //     return res.json({ status: 400, message: "Purchase Invoice already exists" })
        // }
        let checkPurchaseInvoicedata = await purchaseInvoice.create({
            vendor,
            date,
            srNo,
            itemCategory,
            itemSubCategory,
            totalAmount,
            wareHouse,
            amount,
            uplodFile: req.file.path
        });
        return res.json({ status: 201, message: "Purchase Invoice created successfully", purchaseInvoice: checkPurchaseInvoicedata })
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.getAllPurchaseInvoiceData = async (req, res) => {
    try {

        let page = parseInt(req.query.page);
        let pageSize = parseInt(req.query.pageSize)

        if (page < 1 || pageSize < 1) {
            return res.json({ status: 400, message: "Page And PageSize Can't Be Less Then 1" })
        }

        let paginatedPurchaseInvoice;
        paginatedPurchaseInvoice = await purchaseInvoice.find();
        let count = paginatedPurchaseInvoice.length;

        if (count === 0) {
            return res.json({ status: 400, message: "Purchase Invoice Data Not Found" })
        }

        if (page && pageSize) {
            startIndex = (page - 1) * pageSize;
            lastIndex = (startIndex + pageSize);
            paginatedPurchaseInvoice = paginatedPurchaseInvoice.slice(startIndex, lastIndex)
        }
        return res.json({ status: 200, totalPurchaseInvoice: count, message: "All Purchase Invoice Found SuccessFully", purchaseInvoice: paginatedPurchaseInvoice })
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.getPurchaseInvoiceById = async (req, res) => {
    try {
        let id = req.params.id;

        let checkPurchaseInvoice = await purchaseInvoice.findById(id);

        if (!checkPurchaseInvoice) {
            return res.json({ status: 404, message: "Purchase Invoice Not Found." })
        }
        return res.json({ status: 200, message: "Purchase Invoice Found SuccessFully...", purchaseInvoice: checkPurchaseInvoice });
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};


exports.updatePurchaseInvoiceData = async (req, res) => {
    try {
        let id = req.params.id;

        let updatePurchaseInvoice = await purchaseInvoice.findById(id);

        if (!updatePurchaseInvoice) {
            return res.json({ status: 404, message: "Purchase Invoice Not Found." })
        }

        updatePurchaseInvoice = await purchaseInvoice.findByIdAndUpdate(id, { ...req.body }, { new: true });

        return res.json({ status: 200, message: "Purchase Invoice Updated SuccessFully", purchaseInvoice: updatePurchaseInvoice });
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.deletePurchaseInvoice = async (req, res) => {
    try {
        let id = req.params.id;

        let deletepurchaseInvoice = await purchaseInvoice.findById(id);

        if (!deletepurchaseInvoice) {
            return res.json({ status: 404, message: "Purchase Invoice Not Found." })
        }
        await purchaseInvoice.findByIdAndDelete(id);
        return res.json({ status: 200, message: "Purchase Invoice Deleted SuccessFully" });
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
}