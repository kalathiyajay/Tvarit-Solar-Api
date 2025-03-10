const account = require('../models/account.models');

exports.createAccount = async (req, res) => {
    try {
        let { matketId, pendingAmount, dealerEnteryId, AmountMarket, TotalAccountAmount, AccountRemarks, AccountAmount, AccountDate, AccountDetails, CustomerPayment, Dealer } = req.body;

        // let checkAccount = await account.findOne({ field1: req.body.field1 })

        // if (checkAccount) {
        //     return res.json({ status: 400, message: "Account Is Already Exist.." })
        // }

        let checkAccount = await account.create({
            matketId,
            pendingAmount,
            TotalAccountAmount,
            AmountMarket,
            Dealer,
            AccountRemarks,
            AccountAmount,
            AccountDate,
            AccountDetails,
            dealerEnteryId
        });

        return res.json({ status: 201, message: "Account Is Created SuccessFully..", account: checkAccount })

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.getAllAccount = async (req, res) => {
    try {
        let page = parseInt(req.query.page);
        let pageSize = parseInt(req.query.pageSize);

        if (page < 1 || pageSize < 1) {
            return res.json({ status: 400, message: "Page And PageSize Can't Be Less Then 1" })
        }

        let paginatedAccount;

        paginatedAccount = await account.find();

        let count = paginatedAccount.length;

        // if (count === 0) {
        //     return res.json({ status: 404, message: "No Account Found.." })
        // }

        if (page && pageSize) {
            startIndex = (page - 1) * pageSize;
            lastIndex = (startIndex + pageSize)
            paginatedAccount = paginatedAccount.slice(startIndex, lastIndex)
        }

        return res.json({ status: 200, TotalAccount: count, message: 'All Account Found Successfully..', accounts: paginatedAccount })

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
}

exports.getAccountById = async (req, res) => {
    try {
        let id = req.params.id;

        let accountById = await account.findById(id);

        if (!accountById) {
            return res.json({ status: 404, message: "Account Not Found" })
        }

        res.json({ status: 200, message: "Get Account Data Successfully...", credit: accountById })

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
}

exports.updateAccount = async (req, res) => {
    try {
        let id = req.params.id;

        let checkAccountId = await account.findById(id);

        if (!checkAccountId) {
            return res.json({ status: 404, message: "Account Not Found" })
        }

        checkAccountId = await account.findByIdAndUpdate(id, { ...req.body }, { new: true });

        return res.json({ status: 200, message: "Account Updated Successfully..", account: checkAccountId })

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        let id = req.params.id;

        let checkAccountId = await account.findById(id);

        if (!checkAccountId) {
            return res.json({ status: 404, message: "Account Not Found" })
        }

        await account.findByIdAndDelete(id);

        return res.json({ status: 200, message: "Account Removed Successfully.." })

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
}

const commercialMarket = require('../models/commercialMarketing.models');

exports.getAllMarketingData = async (req, res) => {
    try {
        let allCommerCialMarketData = await commercialMarket.aggregate([
            {
                $lookup: {
                    from: 'dealers',
                    localField: "Dealer",
                    foreignField: "_id",
                    as: "dealerData"
                }
            },
            {
                $addFields: {
                    dealerData: {
                        $filter: {
                            input: "$dealerData",
                            as: "dealer",
                            cond: { $gt: [{ $size: "$$dealer.PaymentDetails" }, 0] }
                        }
                    }
                }
            },
            {
                $match: {
                    dealerData: { $ne: [] }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userData'
                }
            }
        ]);


        if (!allCommerCialMarketData) {
            return res.status(404).json({ status: 404, message: "Marketing Data Not Found" })
        }

        return res.status(200).json({ status: 200, count: allCommerCialMarketData.length, message: "All Commercial Market Data Found SuccessFully....", market: allCommerCialMarketData })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}