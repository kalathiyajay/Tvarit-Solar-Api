const technical = require('../models/technical.models');

exports.createTechnical = async (req, res) => {
    try {
        let { fillNo, name, contact, kw, dealer, pendingPayment, fabiricator, electircoian, solarSize } = req.body;
        // let checkTechnical = await technical.findOne({ fillNo: req.body.fillNo })
        // if (checkTechnical) {
        //     return res.json({ status: 400, message: "Technical Details Is Already Exiest.." })
        // }

        let checkTechnical = await technical.create({
            fillNo,
            name,
            contact,
            kw,
            dealer,
            pendingPayment,
            fabiricator,
            electircoian,
            solarSize
        });

        return res.json({ status: 201, message: "Technical Details Is Created successFully..", technical: checkTechnical })
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.getAllTechnical = async (req, res) => {
    try {
        let page = parseInt(req.query.page);
        let pageSize = parseInt(req.query.pageSize);

        if (page < 1 || pageSize < 1) {
            return res.json({ status: 400, message: "Page And PageSize Can't Be Less Then 1" })
        }

        let paginatedTechnical;
        paginatedTechnical = await technical.find();
        let count = paginatedTechnical.length;

        if (count === 0) {
            return res.json({ status: 404, message: "No Technical Details Found.." })
        }

        if (page && pageSize) {
            startIndex = (page - 1) * pageSize;
            lastIndex = (startIndex + pageSize)
            paginatedTechnical = paginatedTechnical.slice(startIndex, lastIndex)
        }

        return res.json({ status: 200, TotalTechinial: count, message: 'All Technical Details Found Successfully..', category: paginatedTechnical })
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
}

exports.getTechnicalById = async (req, res) => {
    try {
        let id = req.params.id;
        let technicalById = await technical.findById(id);
        if (!technicalById) {
            return res.json({ status: 404, message: "Technical Details Not Found" })
        }
        res.json({ status: 200, message: "Get Technical Details Successfully...", technical: technicalById })
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
}

exports.updateTechnicalDetails = async (req, res) => {
    try {
        let id = req.params.id;

        let checkTechnicalId = await technical.findById(id);

        if (!checkTechnicalId) {
            return res.json({ status: 404, message: "Technical details Not Found" })
        }

        checkTechnicalId = await technical.findByIdAndUpdate(id, { ...req.body }, { new: true });

        return res.json({ status: 200, message: "Technical details Updated Successfully..", technical: checkTechnicalId })
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.deleteTechnicalDetails = async (req, res) => {
    try {
        let id = req.params.id;

        let checkTechnicalId = await technical.findById(id);

        if (!checkTechnicalId) {
            return res.json({ status: 404, message: "Technical Details Not Found" })
        }

        await technical.findByIdAndDelete(id);

        return res.json({ status: 200, message: "Technical Details Removed Successfully.." })
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
}
