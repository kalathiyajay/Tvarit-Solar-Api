const dailyPrice = require('../models/dailyPrice.models');

exports.createDailyPrice = async (req, res) => {
    try {
        let { kw, primary, secondary } = req.body;
        // let chekcDailyPrice = await dailyPrice.findOne({ kw: req.body.kw })

        // if (chekcDailyPrice) {
        //     return res.json({ status: 400, message: "DailyPrice already exists" })
        // }

        let chekcDailyPrice = await dailyPrice.create({
            kw,
            primary,
            secondary
        });
        return res.json({ status: 201, message: "DailyPrice created successfully", wareHouse: chekcDailyPrice })
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.getAllDailyPrice = async (req, res) => {
    try {
        let page = parseInt(req.query.page);
        let pageSize = parseInt(req.query.pageSize);

        if (page < 1 || pageSize < 1) {
            return res.json({ status: 400, message: "Page And PageSize Can't Be Less Then 1" })
        }
        let paginatedDailyPrice;
        paginatedDailyPrice = await dailyPrice.find();

        let count = paginatedDailyPrice.length;

        if (count === 0) {
            return res.json({ status: 404, message: "No DailyPrice Found.." })
        }

        if (page && pageSize) {
            startIndex = (page - 1) * pageSize;
            lastIndex = (startIndex + pageSize)
            paginatedDailyPrice = paginatedDailyPrice.slice(startIndex, lastIndex)
        }
        return res.json({ status: 200, TotalDailyPrice: count, message: 'All DailyPrice Found Successfully..', wareHouse: paginatedDailyPrice })
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.getDailyPriceById = async (req, res) => {
    try {
        let id = req.params.id;
        let dailyPriceId = await dailyPrice.findById(id);
        if (!dailyPriceId) {
            return res.json({ status: 404, message: "DailyPrice Not Found" })
        }
        return res.json({ status: 200, message: "DailyPrice Found Successfully..", dailyPrice: dailyPriceId })
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.updatedailyPriceById = async (req, res) => {
    try {
        let id = req.params.id;

        let dailyPriceById = await dailyPrice.findById(id);

        if (!dailyPriceById) {
            return res.json({ status: 404, message: "DailyPrice Not Found" })
        }
        dailyPriceById = await dailyPrice.findByIdAndUpdate(id, { ...req.body }, { new: true });
        return res.json({ status: 200, message: "DailyPrice Updated Successfully..", dailyPrice: dailyPriceById });
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.deletedailyPriceById = async (req, res) => {
    try {
        let id = req.params.id;

        let dailyPriceById = await dailyPrice.findById(id);

        if (!dailyPriceById) {
            return res.json({ status: 404, message: "DailyPrice Not Found" })
        }
        await dailyPrice.findByIdAndDelete(id);

        return res.json({ status: 200, message: "DailyPrice Deleted Successfully.." });
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
}