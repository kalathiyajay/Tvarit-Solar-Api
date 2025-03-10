const dealerPayment = require('../models/DealerPayment.models');

exports.createDealerPayment = async (req, res) => {
    try {
        let { DealerPaymentInvoiceNo, userId, status, dealermonth, DealerPaymentDetails } = req.body;

        console.log("req.body", req.body);


        let checkDealerPayment = await dealerPayment.create({
            DealerPaymentInvoiceNo,
            userId,
            status,
            dealermonth,
            DealerPaymentDetails,
        });

        return res.json({ status: 201, message: "Dealer Payment Show Is Created SuccessFully..", dealerPayment: checkDealerPayment })
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.getAllDealerPayment = async (req, res) => {
    try {
        let page = parseInt(req.query.page);
        let pageSize = parseInt(req.query.pageSize);

        if (page < 1 || pageSize < 1) {
            return res.json({ status: 400, message: "Page And PageSize Can't Be Less Then 1" })
        }

        let paginatedDealerPayment;
        paginatedDealerPayment = await dealerPayment.find();
        let count = paginatedDealerPayment.length;

        // if (count === 0) {
        //     return res.json({ status: 404, message: "No Dealer Payment Found.." })
        // }

        if (page && pageSize) {
            startIndex = (page - 1) * pageSize;
            lastIndex = (startIndex + pageSize)
            paginatedDealerPayment = paginatedDealerPayment.slice(startIndex, lastIndex)
        }

        return res.json({ status: 200, TotalDealerPayment: count, message: 'All Dealer Payment Show Found Successfully..', dealerPayment: paginatedDealerPayment })
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
}

exports.getDealerPaymentById = async (req, res) => {
    try {
        let id = req.params.id;
        let dealerPaymentById = await dealerPayment.findById(id);
        if (!dealerPaymentById) {
            return res.json({ status: 404, message: "Dealer Payment Not Found" })
        }
        res.json({ status: 200, message: "Get Dealer Payment Data Successfully...", dealerPayment: dealerPaymentById })
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
}

exports.updateDealerPayment = async (req, res) => {
    try {
        let id = req.params.id;
        console.log("Request params:", req.params); // Log entire params object
        console.log("ID received:", id); // More detailed logging

        let checkDealerPaymentId = await dealerPayment.findById(id);

        if (!checkDealerPaymentId) {
            return res.json({ status: 404, message: "Dealer Payment Not Found" })
        }

        checkDealerPaymentId = await dealerPayment.findByIdAndUpdate(id, { ...req.body }, { new: true });

        return res.json({ status: 200, message: "Dealer Payment Updated Successfully..", dealerPayment: checkDealerPaymentId })
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.deleteDealerPayment = async (req, res) => {
    try {
        let id = req.params.id;

        let checkDealerPaymentId = await dealerPayment.findById(id);

        if (!checkDealerPaymentId) {
            return res.json({ status: 404, message: "Dealer Payment Show Not Found" })
        }

        await dealerPayment.findByIdAndDelete(id);

        return res.json({ status: 200, message: "Dealer Payment Show Removed Successfully.." })
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
}
const dealer = require('../models/dealerEntery.models');

exports.getAllDealersData = async (req, res) => {
    try {
        let allDealersData = await dealer.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: "userId",
                    foreignField: "_id",
                    as: "dealerUserData"
                }
            },
            {
                $lookup: {
                    from: "commercialmarketings",
                    localField: "_id",
                    foreignField: "Dealer",
                    as: "data"
                }
            },
            {
                $lookup: {
                    from: "accounts",
                    localField: "_id",
                    foreignField: "Dealer",
                    as: "accountData"
                }
            },
        ])

        if (!allDealersData) {
            return res.json({ status: 404, message: "No Dealers Data Found" })
        }

        return res.json({ status: 200, message: "All Dealers Data Found Successfully...", dealersData: allDealersData })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });

    }
}