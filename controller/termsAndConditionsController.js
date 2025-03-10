const termsAndCondition = require('../models/termsAndCondition')

exports.createConditions = async (req, res) => {
    try {
        let { name, description, TermsType } = req.body

        // let checkDescriptionName = await termsAndCondition.findOne({ name })

        // if (checkDescriptionName) {
        //     return res.status(409).json({ status: 409, message: "Name Is Alredy Added" })
        // }

        let checkDescriptionName = await termsAndCondition.create({
            name,
            description,
            TermsType
        });

        return res.status(201).json({ status: 201, message: "Terms And Condition Created SuccessFully...", termsAndCondition: checkDescriptionName });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllConditions = async (req, res) => {
    try {
        let page = parseInt(req.query.page);
        let pageSize = parseInt(req.query.pageSize)

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: "Page And Page Size Cann't Be Less Than 1" })
        }

        let paginatedAllConditions;

        paginatedAllConditions = await termsAndCondition.find();

        let count = paginatedAllConditions.length

        // if (count === 0) {
        //     return res.status(404).json({ status: 404, message: "Terms And Conditions Not Found" })
        // }

        if (page && pageSize) {
            let startIndex = (page - 1) * pageSize
            let lastIndex = (startIndex + pageSize)
            paginatedAllConditions = paginatedAllConditions.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, totalTermsAndConditions: count, message: "All Terms And Conditions Found SuccessFully..", termsAndCondition: paginatedAllConditions });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getConditionById = async (req, res) => {
    try {
        let id = req.params.id

        let getConditionId = await termsAndCondition.findById(id)

        if (!getConditionId) {
            return res.status(404).json({ status: 404, message: "Terms And Condition Not Found" })
        }

        return res.status(200).json({ status: 200, message: "Terms And Condition Found SuccessFully...", termsAndCondition: getConditionId })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.updateConditionById = async (req, res) => {
    try {
        let id = req.params.id

        let updateConditionId = await termsAndCondition.findById(id)

        if (!updateConditionId) {
            return res.status(404).json({ status: 404, message: "Terms And Condition Not Found" })
        }

        updateConditionId = await termsAndCondition.findByIdAndUpdate(id, { ...req.body }, { new: true })

        return res.status(200).json({ status: 200, message: "Terms And Condition Update SuccessFully...", termsAndCondition: updateConditionId });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.deleteConditionById = async (req, res) => {
    try {
        let id = req.params.id

        let deleteConditionId = await termsAndCondition.findById(id)

        if (!deleteConditionId) {
            return res.status(404).json({ status: 404, message: "Terms And Condition Not Found" })
        }

        await termsAndCondition.findByIdAndDelete(id);

        return res.status(200).json({ status: 200, message: "Terms And Condition Delete SuccessFully..." });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}