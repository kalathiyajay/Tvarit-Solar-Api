const dispatch = require('../models/dispatch.models');

exports.createDispatch = async (req, res) => {
    try {
        let { fillNo, name, contachNo, Kw, location, consumerNo, dealer, date, wareHouseMetirial, wareHouseStrucure, solarModule, inverterMake } = req.body;

        // let checkDispatch = await dispatch.findOne({ fillNo: req.body.fillNo })

        // if (checkDispatch) {
        //     return res.json({ status: 400, message: "Dispatch alredy Added..." })
        // }

        checkDispatch = await dispatch.create({
            fillNo,
            name,
            contachNo,
            Kw,
            location,
            consumerNo,
            dealer,
            date,
            wareHouseMetirial,
            wareHouseStrucure,
            solarModule,
            inverterMake
        })
        return res.json({ status: 201, message: "Dispatch Is Created SuccessFully....", dispatch: checkDispatch })

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.getAllDispatchData = async (req, res) => {
    try {
        let page = parseInt(req.query.page);
        let pageSize = parseInt(req.query.pageSize);

        if (page < 1 || pageSize < 1) {
            return res.json({ status: 400, message: "Page And PageSize Cant'b less Than 1" });
        }

        let paginatedDispatch;
        paginatedDispatch = await dispatch.find();
        let count = await paginatedDispatch.length;

        if (count === 0) {
            return res.json({ status: 400, message: "No Dispatch Found..." })
        }

        if (page && pageSize) {
            startIndex = (page - 1) * pageSize;
            lastIndex = (startIndex + pageSize);
            paginatedDispatch = paginatedDispatch.slice(startIndex, lastIndex);
        }

        return res.json({ status: 200, totalDispatch: count, message: "All Dispatch found Successfully...", dispatch: paginatedDispatch });
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.getDispatchDataById = async (req, res) => {
    try {
        let id = req.params.id;
        let dispatchById = await dispatch.findById(id);
        if (!dispatchById) {
            return res.json({ status: 404, message: "Dispach Not Found" })
        }
        res.json({ status: 200, message: "Get Dispach Data Successfully...", dispatch: dispatchById })
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.updateDispatchById = async (req, res) => {
    try {
        let id = req.params.id;
        let updateDispatchById = await dispatch.findById(id);
        if (!updateDispatchById) {
            return res.json({ status: 404, message: "Dispach Not Found" })
        }
        updateDispatchById = await dispatch.findByIdAndUpdate(id, { ...req.body }, { new: true });
        res.json({ status: 200, message: "Dispach Updated Successfully...", dispatch: updateDispatchById });
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.deleteDispatchById = async (req, res) => {
    try {
        let id = req.params.id;
        let removeDispatchById = await dispatch.findById(id);
        if (!removeDispatchById) {
            return res.json({ status: 404, message: "Dispach Not Found" })
        }
        await dispatch.findByIdAndDelete(id);
        res.json({ status: 200, message: "Dispach Deleted Successfully..." });
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
}
