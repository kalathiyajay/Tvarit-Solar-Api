const commercialMarket = require('../models/commercialMarketing.models');
const FillNoTracker = require('../models/fillNoTrackerModels');
const dealer = require('../models/dealerEntery.models');
const product = require('../models/product.models');
const wareHouse = require('../models/warehouse.model');
const user = require('../models/user.models')

async function generateFillNo() {
    let tracker = await FillNoTracker.findOne();

    if (!tracker) {
        tracker = new FillNoTracker({ prefix: 'A', lastSequenceNumber: 0 });
        await tracker.save();
    }

    let nextFillNo;
    let sequenceNumber = tracker.lastSequenceNumber + 1;

    if (sequenceNumber > 998) {
        const newPrefix = String.fromCharCode(tracker.prefix.charCodeAt(0) + 1);

        let newPrefixTracker = await FillNoTracker.findOne({ prefix: newPrefix });
        if (!newPrefixTracker) {
            newPrefixTracker = new FillNoTracker({ prefix: newPrefix, lastSequenceNumber: 0 });
            await newPrefixTracker.save();
        }
        tracker.prefix = newPrefix;
        tracker.lastSequenceNumber = 1;
        await tracker.save();
        nextFillNo = `${newPrefix}${tracker.lastSequenceNumber.toString().padStart(3, '0')}`;
    } else {
        nextFillNo = `${tracker.prefix}${sequenceNumber.toString().padStart(3, '0')}`;
        tracker.lastSequenceNumber = sequenceNumber;
        await tracker.save();
    }

    return nextFillNo;
}

exports.createcommercialMarket = async (req, res) => {
    try {
        let { MarketingType } = req.body;

        if (MarketingType === "Commercial") {

            let { fillNo, userId, Date, ProductName, amount, ContactPersonName, Dealer, Pincode, Latitude, Longitude, MSME_UdyamREGISTRATION, CommissionPerKW, TotalCommission, adharCard, lightBill, veraBill, Phase, SystemSizeKw, GSTNumber, PanNumber, Amount, GST, TotalAmount, ConsumerName, Tarrif, AverageMonthlyBill, ConnectionLoad, DealerCommission, ConsumerNumber, PhoneNumber, Address, City_Village, country, state, district, SolarModuleNos, SolarModuleMake, SolarModuleWp, InverterModuleWp, InverterModuleMake, InverterName, status, WarehouseId, MultipleDetails, dealerImage, inputField } = req.body;

            let getDealerData = await dealer.findById(Dealer)

            if (!getDealerData) {
                return res.status(404).json({ status: 404, message: "Dealer Not Found" })
            }

            getDealerData.status = 'Completed'

            await getDealerData.save();

            let checkcommercialMarket = await commercialMarket.findOne({ fillNo: req.body.fillNo })

            if (checkcommercialMarket) {
                return res.json({ status: 400, message: "Commercial Marketing Is Already Exist.." })
            }

            if (!fillNo) {
                fillNo = await generateFillNo();
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


            checkcommercialMarket = await commercialMarket.create({
                fillNo,
                userId,
                Date,
                ContactPersonName,
                PhoneNumber,
                Address,
                country,
                state,
                district,
                City_Village,
                Dealer: Dealer && Dealer !== "null" ? Dealer : null,
                // District_Location,
                Pincode,
                Latitude,
                Longitude,
                Amount,
                GST,
                TotalAmount,
                ConsumerName,
                DealerCommission,
                ConsumerNumber,
                ConnectionLoad,
                Tarrif,
                AverageMonthlyBill,
                GSTNumber,
                PanNumber,
                SystemSizeKw,
                MSME_UdyamREGISTRATION,
                Phase,
                amount,
                MultipleDetails: multipleDetails,
                dealerImage,
                inputField,
                adharCard,
                lightBill,
                veraBill,
                ProductName,
                InverterModuleWp,
                InverterModuleMake,
                InverterName,
                SolarModuleMake,
                SolarModuleWp,
                SolarModuleNos,
                CommissionPerKW,
                TotalCommission,
                status,
                MarketingType: "Commercial",
                WarehouseId
            });

            return res.status(201).json({ status: 201, message: "Commercial Market Is Created SuccessFully..", commercialMarketing: checkcommercialMarket })
        }

        if (MarketingType === "Residential") {

            let { fillNo, userId, Date, ConsumerName, PhoneNumber, ConsumerNumber, Address, country, state, district, City_Village, District_Location, Pincode, Latitude, Longitude,
                PrimaryAmount, Dealer, CashAmount, TotalAmount, SolarModuleMake, DealerPolicy, SolarModuleWp, SolarModuleNos, SystemSizeKw, InverterSize,
                adharCard, lightBill, veraBill, status, ProductName, DealerCommission, InverterModuleWp,
                InverterModuleMake, amount,
                InverterName, WarehouseId, MultipleDetails, dealerImage, inputField, CommissionPerKW, TotalCommission } = req.body;

            let getDealerData = await dealer.findById(Dealer)

            if (!getDealerData) {
                return res.status(404).json({ status: 404, message: "Dealer Not Found" })
            }

            getDealerData.status = 'Completed'

            await getDealerData.save();

            let checkResidentMarket = await commercialMarket.findOne({ fillNo: req.body.fillNo })

            if (checkResidentMarket) {
                return res.status(401).json({ status: 401, message: "Residential Marketing Is Already Exist.." })
            }

            if (!fillNo) {
                fillNo = await generateFillNo();
            }


            let multipleDetails = JSON.parse(req.body.MultipleDetails || '[]');

            // if (req.files && req.files['dealerImage']) {
            //     req.files['dealerImage'].forEach((file, index) => {
            //         const dealerImageIndex = req.body[`dealerImageIndex_${index}`];
            //         if (multipleDetails[dealerImageIndex]) {
            //             multipleDetails[dealerImageIndex].dealerImage = file.path;
            //         }
            //     });
            // }
            if (req.files && req.files['dealerImage']) {
                req.files['dealerImage'].forEach((file, index) => {
                    const dealerImageIndex = req.body[`dealerImageIndex_${index}`];
                    if (multipleDetails[dealerImageIndex]) {
                        // Store multiple images
                        if (!multipleDetails[dealerImageIndex].dealerImage) {
                            multipleDetails[dealerImageIndex].dealerImage = [];
                        }
                        multipleDetails[dealerImageIndex].dealerImage.push(file.path); // Push the new image path
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

            checkResidentMarket = await commercialMarket.create({
                fillNo,
                userId,
                Date,
                ConsumerName,
                PhoneNumber,
                ConsumerNumber,
                Address,
                country,
                state,
                district,
                City_Village,
                District_Location,
                Pincode,
                Latitude,
                Longitude,
                PrimaryAmount,
                Dealer: Dealer && Dealer !== "null" ? Dealer : null,
                CashAmount,
                TotalAmount,
                SolarModuleMake,
                DealerPolicy,
                SolarModuleWp,
                SolarModuleNos,
                SystemSizeKw,
                InverterSize,
                adharCard,
                lightBill,
                veraBill,
                InverterModuleWp,
                InverterModuleMake,
                InverterName,
                amount,
                MultipleDetails: multipleDetails,
                dealerImage,
                inputField,
                CommissionPerKW,
                status,
                ProductName,
                DealerCommission,
                TotalCommission,
                MarketingType: "Residential",
                WarehouseId
            });

            return res.status(201).json({ status: 201, message: "Residential Marketing Is Created SuccessFully..", residentialMarketing: checkResidentMarket })
        }
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.getAllCommercialmarket = async (req, res) => {
    try {
        // let page = parseInt(req.query.page);
        // let pageSize = parseInt(req.query.pageSize);

        // if (page < 1 || pageSize < 1) {
        //     return res.status(401).json({ status: 401, message: "Page And PageSize Can't Be Less Than 1" })
        // }

        let paginatedRCommercialMarket;

        paginatedRCommercialMarket = await commercialMarket.aggregate([
            {
                $lookup: {
                    from: "dealers",
                    localField: "Dealer",
                    foreignField: "_id",
                    as: "dealerData"
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userData"
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "ProductName",
                    foreignField: "_id",
                    as: "productData"
                },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "InverterName",
                    foreignField: "_id",
                    as: "inverterData"
                },
            },
            {
                $lookup: {
                    from: "warehouses",
                    localField: "WarehouseId",
                    foreignField: "_id",
                    as: "wareHouseData"
                },
            },
            {
                $lookup: {
                    from: "liasonings",
                    localField: "_id",
                    foreignField: "marketId",
                    as: "liasoningData"
                }
            }
        ])

        let count = paginatedRCommercialMarket.length;

        // if (count === 0) {
        //     return res.status(404).json({ status: 404, message: "No CommercialMarket Found.." })
        // }

        // if (page && pageSize) {
        //     startIndex = (page - 1) * pageSize;
        //     lastIndex = (startIndex + pageSize)
        //     paginatedRCommercialMarket = paginatedRCommercialMarket.slice(startIndex, lastIndex)
        // }

        return res.status(200).json({ status: 200, TotalCommercialMarket: count, message: 'All Marketing Data Found Successfully..', commercialMarket: paginatedRCommercialMarket })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getCommercialMarketById = async (req, res) => {
    try {
        let id = req.params.id;

        let commercialMarketById = await commercialMarket.findById(id);

        return res.status(200).json({ status: 200, message: "Get Marketing Data Successfully...", CommercialMarket: commercialMarketById })

    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
        console.log(error);
    }
}

exports.updateCommercialMarket = async (req, res) => {
    try {
        let id = req.params.id;

        // Log the incoming data
        console.log("Received data for update:", req.body);
        const { MultipleDetails, Dealer, ...updatedFields } = req.body;

        let multipleDetails = JSON.parse(req.body.MultipleDetails || '[]');
        if (Dealer === "" || Dealer === "null") {
            updatedFields.Dealer = null;
        } else {
            updatedFields.Dealer = Dealer; // Ensure the Dealer ID is set correctly
        }

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

        delete updatedFields.MultipleDetails;
        Object.keys(updatedFields).forEach(key => {
            if (key.startsWith('ExistingdealerImage_') || key.startsWith('dealerImageIndex_')) {
                delete updatedFields[key];
            }
        });

        let checkCommercialMarketId = await commercialMarket.findByIdAndUpdate(id, {
            $set: { ...updatedFields, MultipleDetails: multipleDetails }
        }, { new: true });

        return res.status(200).json({ status: 200, message: "Marketing Data Updated Successfully..", CommercialMarket: checkCommercialMarketId });

    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.deleteCommercialMasrket = async (req, res) => {
    try {
        let id = req.params.id;

        let checkCommercialMarketId = await commercialMarket.findById(id);

        if (!checkCommercialMarketId) {
            return res.status(404).json({ status: 404, message: "Marketing Data Not Found" })
        }

        await commercialMarket.findByIdAndDelete(id);

        return res.status(200).json({ status: 200, message: "Marketing Data Removed Successfully.." })

    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
        console.log(error);
    }
}


exports.getAllWarehouse = async (req, res) => {
    try {
        let getAllUsers = await wareHouse.find();

        if (!getAllUsers) {
            return res.status(404).json({ status: 404, message: "User Not Found" })
        }

        return res.status(200).json({ status: 200, message: "All Warehouse User Found SuccessFully...", warehouseUsers: getAllUsers });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllCommercialProduct = async (req, res) => {
    try {

        let getAllProducts = await product.aggregate([
            {
                $lookup: {
                    from: 'categories',
                    localField: "mainCategory",
                    foreignField: "_id",
                    as: "mainCategoryData"
                }
            },
            {
                $lookup: {
                    from: 'subcategories',
                    localField: "subCategory",
                    foreignField: "_id",
                    as: "subCategoryData"
                }
            }
        ])

        if (!getAllProducts) {
            return res.status(404).json({ status: 404, message: "Product Not Found" })
        }

        return res.status(200).json({ status: 200, message: "All Product Found SuccessFully...", allProducts: getAllProducts })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}


exports.getAllCommercialDealer = async (req, res) => {
    try {
        let getAllDealerUser = await user.aggregate([
            {
                $lookup: {
                    from: 'roles',
                    localField: "role",
                    foreignField: "_id",
                    as: "roleData"
                }
            },
            {
                $match: {
                    $or: [{ "roleData.roleName": 'Super Admin' }, { "roleData.roleName": "Dealer" }, { "roleData.roleName": "Head and dealer" }]
                }
            },
            {
                $project: {
                    name: 1,
                    email: 1
                }
            },
        ])

        if (!getAllDealerUser) {
            return res.status(404).json({ status: 404, message: "Dealer User Not Found" })
        }

        return res.status(200).json({ status: 200, message: "All Dealers Found SuccessFully....", dealers: getAllDealerUser })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllDealerProduct = async (req, res) => {
    try {
        let getAllCommercialProduct = await commercialMarket.aggregate([
            {
                $lookup: {
                    from: 'dealers',
                    localField: "Dealer",
                    foreignField: "_id",
                    as: "dealerData"
                },

            },
            {
                $lookup: {
                    from: 'products',
                    localField: "dealerData.SolarInverter",
                    foreignField: "_id",
                    as: "solarInverterData"
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: "dealerData.SolarModule",
                    foreignField: "_id",
                    as: "solarModuleData"
                }
            }
        ]);

        if (!getAllCommercialProduct) {
            return res.status(404).json({ status: 404, message: "Dealer Not Found" })
        }

        return res.status(200).json({ status: 200, message: "All Dealer Found Successfully..", dealerProduct: getAllCommercialProduct })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllPendingDealerData = async (req, res) => {
    try {
        let allDealers = await dealer.aggregate([
            {
                $match: {
                    status: "Pending"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userData"
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: "SolarInverter",
                    foreignField: "_id",
                    as: "solarInverterData"
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: "SolarModule",
                    foreignField: "_id",
                    as: "solarModuleData"
                }
            }
        ])

        if (!allDealers) {
            return res.status(404).json({ status: 404, message: "Dealer Not Found" })
        }

        return res.status(200).json({ status: 200, message: "All Pending Dealer Found SuccessFully...", pendingDealer: allDealers });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}