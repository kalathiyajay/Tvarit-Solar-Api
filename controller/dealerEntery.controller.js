const dealer = require('../models/dealerEntery.models');
const product = require('../models/product.models');

// exports.createDealer = async (req, res) => {
//     try {
//         const { userId, fillNo, ConsumerName, country, state, district, City_Village, PhoneNumber, MarketingType, amount, MultipleDetails, SystemSize, SolarModule, SolarInverter } = req.body;

//         let multipleDetails;
//         try {
//             multipleDetails = typeof req.body.MultipleDetails === 'string'
//                 ? JSON.parse(req.body.MultipleDetails)
//                 : req.body.MultipleDetails || [];
//         } catch (parseError) {
//             console.error('Error parsing MultipleDetails:', parseError);
//             multipleDetails = [];
//         }

//         multipleDetails = multipleDetails.map(detail => {
//             if (detail.dealerImage === null || detail.dealerImage === undefined) {
//                 return { ...detail, dealerImage: '' };
//             }

//             if (typeof detail.dealerImage === 'object') {
//                 console.warn('dealerImage is an object:', detail.dealerImage);
//                 return { ...detail, dealerImage: '' };
//             }

//             return {
//                 ...detail,
//                 dealerImage: String(detail.dealerImage || '')
//             };
//         });

//         // Process file uploads
//         if (req.files && req.files['dealerImage']) {
//             req.files['dealerImage'].forEach((file, index) => {
//                 const paymentIndex = req.body[`dealerImageIndex_${index}`];
//                 console.log(`Processing file at index ${index}, paymentIndex: ${paymentIndex}`);

//                 if (multipleDetails[paymentIndex]) {
//                     // Ensure file path is a string
//                     multipleDetails[paymentIndex].dealerImage = file.path ? String(file.path) : '';
//                 }
//             });
//         }

//         Object.keys(req.body).forEach(key => {
//             if (key.startsWith('ExistingdealerImage_')) {
//                 const index = parseInt(key.split('_')[1]);
//                 if (multipleDetails[index]) {
//                     multipleDetails[index].dealerImage = String(req.body[key] || '');
//                 }
//             }
//         });

//         const newDealer = await dealer.create({
//             userId,
//             fillNo,
//             ConsumerName,
//             country,
//             state,
//             district,
//             City_Village,
//             PhoneNumber,
//             MarketingType,
//             amount,
//             SystemSize,
//             SolarModule,
//             SolarInverter,
//             MultipleDetails: multipleDetails
//         });

//         return res.status(201).json({ status: 201, message: "Dealer Entry Created Successfully", dealer: newDealer });

//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ status: 500, message: error.message });
//     }
// };


exports.createDealer = async (req, res) => {
    try {

        // const MAX_FILE_SIZE = 2 * 1024 * 1024;

        // if (req.files && req.files['dealerImage']) {
        //     for (const file of req.files['dealerImage']) {
        //         if (file.size > MAX_FILE_SIZE) {
        //             return res.status(400).json({
        //                 status: 400,
        //                 message: `Maximum size allowed is 2MB`
        //             });
        //         }
        //     }
        // }

        const { userId, fillNo, ConsumerName, country, state, district, City_Village, PhoneNumber, MarketingType, amount, MultipleDetails, SystemSize, SolarModule, SolarInverter } = req.body;

        console.log("req.body", req.files)
        let multipleDetails;
        try {
            multipleDetails = typeof req.body.MultipleDetails === 'string'
                ? JSON.parse(req.body.MultipleDetails)
                : req.body.MultipleDetails || [];
        } catch (parseError) {
            console.error('Error parsing MultipleDetails:', parseError);
            multipleDetails = [];
        }

        multipleDetails = multipleDetails.map(detail => {
            if (detail.dealerImage === null || detail.dealerImage === undefined) {
                return { ...detail, dealerImage: '' };
            }

            if (typeof detail.dealerImage === 'object') {
                console.warn('dealerImage is an object:', detail.dealerImage);
                return { ...detail, dealerImage: '' };
            }

            return {
                ...detail,
                dealerImage: String(detail.dealerImage || '')
            };
        });

        // Process file uploads
        if (req.files && req.files['dealerImage']) {
            req.files['dealerImage'].forEach((file, index) => {
                const paymentIndex = req.body[`dealerImageIndex_${index}`];
                console.log(`Processing file at index ${index}, paymentIndex: ${paymentIndex}`);

                if (multipleDetails[paymentIndex]) {
                    multipleDetails[paymentIndex].dealerImage = file.path ? String(file.path) : '';
                }
            });
        }

        Object.keys(req.body).forEach(key => {
            if (key.startsWith('ExistingdealerImage_')) {
                const index = parseInt(key.split('_')[1]);
                if (multipleDetails[index]) {
                    multipleDetails[index].dealerImage = String(req.body[key] || '');
                }
            }
        });

        const newDealer = await dealer.create({
            userId,
            fillNo,
            ConsumerName,
            country,
            state,
            district,
            City_Village,
            PhoneNumber,
            MarketingType,
            amount,
            SystemSize,
            SolarModule,
            SolarInverter,
            MultipleDetails: multipleDetails
        });

        return res.status(201).json({ status: 201, message: "Dealer Entry Created Successfully", dealer: newDealer });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
};

exports.getAllDealers = async (req, res) => {
    try {
        let page = parseInt(req.query.page);
        let pageSize = parseInt(req.query.pageSize);

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: "Page And PageSize Can't Be Less Than 1" })
        }

        let paginatedDealer;

        paginatedDealer = await dealer.aggregate([
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
                    from: "products",
                    localField: "data.ProductName",
                    foreignField: "_id",
                    as: "MarketModuledata"
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "data.InverterName",
                    foreignField: "_id",
                    as: "marketInverterdata"
                }
            },
            {
                $lookup: {
                    from: "liasonings",
                    localField: 'data._id',
                    foreignField: 'marketId',
                    as: 'liasoningData'
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "SolarModule",
                    foreignField: "_id",
                    as: "SolarModuleDetails"
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "SolarInverter",
                    foreignField: "_id",
                    as: "SolarInverterDetails"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            {
                $lookup: {
                    from: "accounts",
                    localField: "_id",
                    foreignField: "Dealer",
                    as: "AccountData"
                }
            },
            {
                $lookup: {
                    from: "dealerpayments",
                    localField: "userId",
                    foreignField: "userId",
                    as: "dealerPaymentDetails"
                }
            }
        ]);

        let count = paginatedDealer.length;


        if (page && pageSize) {
            startIndex = (page - 1) * pageSize;
            lastIndex = (startIndex + pageSize);
            paginatedDealer = paginatedDealer.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, totalDealersEntery: count, message: "All Dealer Entry Found SuccessFully", Dealer: paginatedDealer })

    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.getDealerById = async (req, res) => {
    try {
        let id = req.params.id

        let getdealer = await dealer.findById(id);

        // if (!getdealer) {
        //     return res.status(404).json({ status: 404, message: "Dealer Entery Not Found " })
        // }

        return res.status(200).json({ status: 200, message: "Dealer Entry Found SuccessFully...", Dealer: getdealer });

    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
        console.log(error);
    }
}

exports.getAllDelersPaymentDetails = async (req, res) => {
    try {
        let getAllPaymentDetail = await dealer.aggregate([
            {
                $lookup: {
                    from: "dealerpayments",
                    localField: "userId",
                    foreignField: "userId",
                    as: "dealerPaymentDetails"
                }
            }
        ])

        if (!getAllPaymentDetail) {
            return res.status(404).json({ status: 404, message: "Dealer Payment Details Not Found" })
        }

        return res.status(200).json({ status: 200, message: "Dealer Payment Found SuccessFully...", delarPaymentData: getAllPaymentDetail })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.updateDealer = async (req, res) => {
    try {
        const id = req.params.id;
        let updatedealer = await dealer.findById(id);
        if (!updatedealer) {
            return res.status(404).json({ status: 404, message: "Dealer Entry Not Found" });
        }

        const updatedFields = { ...req.body };

        if (req.body.dealerCommission) {
            req.body.dealerCommission = req.body.dealerCommission
            req.body.commisionCreatedAt = Date.now()
        }
        console.log("hello", req.body.requestStatus, req.body.boxStatus)
        if (req.body.requestStatus === 'Approved' && req.body.boxStatus === 'Disabled') {
            // req.body.requestStatus && req.body.boxStatus == req.body.requestStatus && req.body.boxStatus
            req.body.submitDate = Date.now()
        }

        let multipleDetails = JSON.parse(req.body.MultipleDetails || '[]');

        if (req.files && req.files['dealerImage']) {
            req.files['dealerImage'].forEach((file, index) => {
                const dealerImageIndex = req.body[`dealerImageIndex_${index}`];
                if (multipleDetails[dealerImageIndex]) {
                    multipleDetails[dealerImageIndex].dealerImage = file.path;
                }
            });
        }

        // Handle existing dealerImage
        Object.keys(req.body).forEach(key => {
            if (key.startsWith('ExistingdealerImage_')) {
                const index = parseInt(key.split('_')[1]);
                if (multipleDetails[index]) {
                    multipleDetails[index].dealerImage = req.body[key];
                }
            }
        });

        let paymentDetails = JSON.parse(req.body.PaymentDetails || '[]');

        // Process UploadPaymentSlip
        if (req.files && req.files['UploadPaymentSlip']) {
            req.files['UploadPaymentSlip'].forEach((file, index) => {
                const paymentIndex = req.body[`UploadPaymentSlipIndex_${index}`];
                if (paymentDetails[paymentIndex]) {
                    paymentDetails[paymentIndex].UploadPaymentSlip = file.path;
                }
            });
        }

        // Handle existing UploadPaymentSlip
        Object.keys(req.body).forEach(key => {
            if (key.startsWith('ExistingUploadPaymentSlip_')) {
                const index = parseInt(key.split('_')[1]);
                if (paymentDetails[index] && !paymentDetails[index].UploadPaymentSlip) {
                    paymentDetails[index].UploadPaymentSlip = req.body[key];
                }
            }
        });

        delete updatedFields.PaymentDetails;
        Object.keys(updatedFields).forEach(key => {
            if (key.startsWith('ExistingUploadPaymentSlip_') || key.startsWith('UploadPaymentSlipIndex_')) {
                delete updatedFields[key];
            }
        });

        // Update the dealer with the new data
        updatedealer = await dealer.findByIdAndUpdate(id, {
            $set: { ...updatedFields, PaymentDetails: paymentDetails, MultipleDetails: multipleDetails }
        }, { new: true });

        return res.status(200).json({ status: 200, message: "Dealer Entry Updated Successfully", Dealer: updatedealer });
    } catch (error) {
        console.error("Error in updateDealer:", error);
        const errorMessage = error.message || 'An error occurred';
        return res.status(500).json({ status: 500, message: errorMessage });
    }
};

exports.updateDealerStatus = async (req, res) => {
    try {
        let id = req.params.id;

        let updatedealer = await dealer.findById(id);

        const updateData = { requestStatus: "Approved" };

        if (req.body.submitDate && updatedealer.boxStatus === "Disabled") {
            updateData.submitDate = req.body.submitDate;
        }
        console.log("data", updateData, updatedealer.boxStatus)

        updatedealer = await dealer.findByIdAndUpdate(id, updateData, { new: true });

        return res.status(200).json({ status: 200, message: "", Dealer: updatedealer });

    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.updateBoxStatus = async (req, res) => {
    try {
        let id = req.params.id;

        let updatedealer = await dealer.findById(id);

        const updateData = { boxStatus: "Disabled" };
        if (req.body.submitDate && updatedealer.requestStatus === "Approved") {
            updateData.submitDate = req.body.submitDate;
        }
        console.log("updateData", updateData, updatedealer.requestStatus)

        updatedealer = await dealer.findByIdAndUpdate(id, updateData, { new: true });

        return res.status(200).json({ status: 200, message: "", Dealer: updatedealer });
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
        console.log(error);
    }
}
exports.dealerCommissionStatus = async (req, res) => {
    try {
        let id = req.params.id


        let updatedealer = await dealer.findById(id);

        updatedealer = await dealer.findByIdAndUpdate(id, { dealerCommissionStatus: "Completed" }, { new: true });

        // return res.status(200).json({ status: 200, message: "Dealer Commission Status Updated SuccessFully...", Dealer: updatedealer });

    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
        console.log(error);
    }
}

exports.dealerPaymentStatus = async (req, res) => {
    try {
        let id = req.params.id

        let updatedealer = await dealer.findById(id);

        updatedealer = await dealer.findByIdAndUpdate(id, { dealerPaymentStatus: "Completed" }, { new: true });

        // return res.status(200).json({ status: 200, message: "Dealer Payment Status Updated SuccessFully...", Dealer: updatedealer });
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
        console.log(error);
    }
}



exports.deleteDealer = async (req, res) => {
    try {
        let id = req.params.id

        let deletedealer = await dealer.findById(id);

        if (!deletedealer) {
            return res.status(400).json({ status: 404, message: "Dealer Entry Not Found " })
        }

        await dealer.findByIdAndDelete(id);

        return res.status(200).json({ status: 200, message: "Dealer Entry Deleted SuccessFully..." });

    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
        console.log(error);
    }
}

exports.getAllSolarModulAndInveterProducts = async (req, res) => {
    try {
        let getAllProducts = await product.aggregate([
            {
                $lookup: {
                    from: "categories",
                    localField: "mainCategory",
                    foreignField: "_id",
                    as: "categoryData"
                }
            },
            {
                $project: {
                    productName: 1,
                    categoryName: { $arrayElemAt: ["$categoryData.categoryName", 0] }
                }
            }
        ]);

        return res.status(200).json({ status: 200, message: "All Product Found SuccessFully...", products: getAllProducts })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}