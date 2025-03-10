const sales = require('../models/sales.modals')
const product = require('../models/product.models')
const category = require('../models/category.models')
const subCategory = require('../models/subCategory.models')
const bom = require('../models/bom.modals')
const terms = require('../models/termsAndCondition')

exports.createSales = async (req, res) => {
    try {
        let { QuotationNo, bomId, Date, customerName, location, TypesOfProject, systemSize, Amount1, Amount2, Amount3, Amount4, Amount5, Amount6, terms, userId } = req.body

        // let checkDescriptionName = await termsAndCondition.findOne({ name })

        // if (checkDescriptionName) {
        //     return res.status(409).json({ status: 409, message: "Name Is Alredy Added" })
        // }

        let SalesDetails = [];
        if (TypesOfProject === 'Residential Individual') {
            SalesDetails = [
                {
                    salesproduct: "Solar PV Module",
                    salesmake: "Waaree/Adani",
                    salesspecifiaction: "540Wp Bifacial"
                },
                {
                    salesproduct: "Solar Grid Tie Inverter",
                    salesmake: "Solax / Polycab / Sofar",
                    salesspecifiaction: "Outdoor String Inverter Capacity 3.3 KW x 1 Nos"
                },
                {
                    salesproduct: "Module Mounting Structure",
                    salesmake: "Hindustar",
                    salesspecifiaction: "60 x 40 Rafter and Leg , 40 x 40 Perlin"
                },
                {
                    salesproduct: "DC Cables",
                    salesmake: "Polycab or Equivalent",
                    salesspecifiaction: "4 Sq. MM x 1 Core Cu Flexible"
                },
                {
                    salesproduct: "AC Cables",
                    salesmake: " Polycab or Equivalent",
                    salesspecifiaction: "4 Sq. MM x 2 Core"
                },
                {
                    salesproduct: "Earthing Green Cable",
                    salesmake: "Polycab or Equivalent",
                    salesspecifiaction: "4 Sq. MM x 1 Core Cu Flexible"
                },
                {
                    salesproduct: "Earthing Kit",
                    salesmake: "Electrical Standard and As per Tender Norms",
                    salesspecifiaction: "Standard Lightning Arrester and LA cable Any Reputed Make"
                },
                {
                    salesproduct: "ACDB & DCDB",
                    salesmake: "Havelles / Elmex or L & K / Finder",
                    salesspecifiaction: "As Per Site Design"
                },
            ]
        }

        if (TypesOfProject === 'Residential Comman Meter') {
            SalesDetails = [
                {
                    salesproduct: "Solar PV Module",
                    salesmake: "Waaree/Adani",
                    salesspecifiaction: "540Wp Bifacial"
                },
                {
                    salesproduct: "Solar Grid Tie Inverter",
                    salesmake: "Solax / Polycab / Sofar",
                    salesspecifiaction: "Outdoor String Inverter Capacity 3.3 KW x 1 Nos"
                },
                {
                    salesproduct: "Module Mounting Structure",
                    salesmake: "Hindustar",
                    salesspecifiaction: "60 x 40 Rafter and Leg , 40 x 40 Perlin"
                },
                {
                    salesproduct: "DC Cables",
                    salesmake: "Polycab or Equivalent",
                    salesspecifiaction: "4 Sq. MM x 1 Core Cu Flexible"
                },
                {
                    salesproduct: "AC Cables",
                    salesmake: "Polycab or Equivalent",
                    salesspecifiaction: "4 Sq. MM x 2 Core"
                },
                {
                    salesproduct: "Earthing Green Cable",
                    salesmake: "Polycab or Equivalent",
                    salesspecifiaction: "4 Sq. MM x 1 Core Cu Flexible"
                },
                {
                    salesproduct: "Earthing Kit",
                    salesmake: "Electrical Standard and As per Tender Norms",
                    salesspecifiaction: "Standard Lightning Arrester and LA cable Any Reputed Make"
                },
                {
                    salesproduct: "ACDB & DCDB",
                    salesmake: "Havelles / Elmex or L & K / Finder",
                    salesspecifiaction: "As Per Site Design"
                },
            ]
        }

        if (TypesOfProject === "Commercial with Large BOM") {
            SalesDetails = [
                {
                    salesproduct: "Solar PV Module",
                    salesmake: "Credence/Waaree",
                    salesspecifiaction: "540Wp Bifacial"
                },
                {
                    salesproduct: "Solar Grid Tie Inverter",
                    salesmake: "Sungrow / Polycab / Sofar",
                    salesspecifiaction: "Outdoor String Inverter Capacity 50 KW x 2 Nos"
                },
                {
                    salesproduct: "Module Mounting Structure",
                    salesmake: "Hindustar",
                    salesspecifiaction: "60 x 40 Rafter and Leg , 40 x 40 Perlin"
                },
                {
                    salesproduct: 'DC Cables',
                    salesmake: 'Polycab / RR or Equivalent',
                    salesspecifiaction: '4 Sq. MM x 1 Core Cu Flexible'
                },
                {
                    salesproduct: "AC Cables",
                    salesmake: "Polycab / RR or Equivalent",
                    salesspecifiaction: "Alluminum Armoured (Cabel Size As per plant design and site requirement)"
                },
                {
                    salesproduct: "Cable Tray",
                    salesmake: "EPP/Aum/Aeron or Equivalent",
                    salesspecifiaction: "Galvanized Coating Gi Perforated"
                },
                {
                    salesproduct: "Walkway",
                    salesmake: "EPP / Aron / Makwell or Equivalent",
                    salesspecifiaction: " FRP Material Walk Way Size - 310 x 25 MM"
                },
                {
                    salesproduct: "LT Panel / ACDB",
                    salesmake: "Havelles, L&T, & Schneider System house",
                    salesspecifiaction: "As per plant design and site requirement"
                },
                {
                    salesproduct: "Earthing",
                    salesmake: "Vasudha / Connect Earth / Eliva or Equivalent",
                    salesspecifiaction: "50 mm die / 3 Meter Depth HDGI Chemical Earthing"
                },
                {
                    salesproduct: "Lightning Arrester",
                    salesmake: "Vasudha / Connect Earth / Eliva or Equivalent",
                    salesspecifiaction: "As per IS / Electrical Standard ( LA Cabel any reputed make )"
                },
                {
                    salesproduct: "Hardware",
                    salesmake: "Perfect / Sunshine or Equivalent",
                    salesspecifiaction: "SS 304"
                },
                {
                    salesproduct: " Panel Cleaning System",
                    salesmake: " Finolex / Astral or Equivalent",
                    salesspecifiaction: "NA"
                },
                {
                    salesproduct: "Balance of System",
                    salesmake: "Any Reputed Make",
                    salesspecifiaction: "As per IS / Electrical Standard (As per plant design and site requirement)"
                },
                {
                    salesproduct: "Generation Meter",
                    salesmake: "Secure / HPL or Equivalent",
                    salesspecifiaction: "As per DISCOM Specification"
                },
                {
                    salesproduct: "Inverter Canopy",
                    salesmake: "     -     ",
                    salesspecifiaction: "As per plant design and site requirement"
                }
            ]
        }

        if (TypesOfProject === "Commercial with Small BOM") {
            SalesDetails = [
                {
                    salesproduct: "Solar PV Module",
                    salesmake: "Waaree/Adani",
                    salesspecifiaction: "540Wp Bifacial"
                },
                {
                    salesproduct: "Solar Grid Tie Inverter",
                    salesmake: "Solax / Polycab /Sofar",
                    salesspecifiaction: "Outdoor String Inverter Capacity 3.3 KW x 1 Nos"
                },
                {
                    salesproduct: "Module Mounting Structure",
                    salesmake: "Hindustar",
                    salesspecifiaction: "60 x 40 Rafter and Leg , 40 x 40 Perlin"
                },
                {
                    salesproduct: "DC Cables",
                    salesmake: "Polycab or Equivalent",
                    salesspecifiaction: "4 Sq. MM x 1 Core Cu Flexible"
                },
                {
                    salesproduct: "AC Cables",
                    salesmake: "Polycab or Equivalent",
                    salesspecifiaction: "4 Sq. MM x 2 Core"
                },
                {
                    salesproduct: "Earthing Green Cable",
                    salesmake: "Polycab or Equivalent",
                    salesspecifiaction: "4 Sq. MM x 1 Core Cu Flexible"
                },
                {
                    salesproduct: "Earthing Kit",
                    salesmake: " Electrical Standard and As per Tender Norms",
                    salesspecifiaction: "Standard Lightning Arrester and LA cable Any Reputed Make"
                },
                {
                    salesproduct: "ACDB & DCDB",
                    salesmake: "Havelles / Elmex or L & K / Finder",
                    salesspecifiaction: "As Per Site Design"
                },
                {
                    salesproduct: 'Cable Tray',
                    salesmake: 'EPP/Aum/Aeronor Equivalent',
                    salesspecifiaction: 'NA'
                },
                {
                    salesproduct: 'Walkway ',
                    salesmake: 'EPP / Aron / Makwell or Equivalent',
                    salesspecifiaction: 'NA'
                }
            ]
        }

        let checkSales = await sales.create({
            QuotationNo,
            Date,
            customerName,
            location,
            TypesOfProject,
            systemSize,
            SalesDetails,
            Amount1,
            Amount2,
            Amount3,
            Amount4,
            Amount5,
            Amount6,
            terms,
            userId,
            bomId
        });

        return res.status(201).json({ status: 201, message: "Sales Created SuccessFully...", sales: checkSales });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllSales = async (req, res) => {
    try {
        let page = parseInt(req.query.page);
        let pageSize = parseInt(req.query.pageSize)

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: "Page And Page Size Cann't Be Less Than 1" })
        }

        let paginatedAllConditions;

        paginatedAllConditions = await sales.aggregate([
            {
                $unwind: "$SalesDetails"
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userData'
                }
            },
            {
                $lookup: {
                    from: 'termsandconditions',
                    localField: 'terms',
                    foreignField: '_id',
                    as: 'termsData'
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "SalesDetails.salescategory",
                    foreignField: "_id",
                    as: "categoryData"
                }
            },
            {
                $lookup: {
                    from: "subcategories",
                    localField: "SalesDetails.salessubcategory",
                    foreignField: "_id",
                    as: "subCategoryData"
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "SalesDetails.salesproduct",
                    foreignField: "_id",
                    as: "productData"
                }
            },
            {
                $addFields: {
                    "SalesDetails.categoryData": { $arrayElemAt: ["$categoryData", 0] },
                    "SalesDetails.subCategoryData": { $arrayElemAt: ["$subCategoryData", 0] },
                    "SalesDetails.productData": { $arrayElemAt: ["$productData", 0] },
                    "userData": { $first: "$userData" },
                    "termsData": "$termsData"
                }
            },
            {
                $group: {
                    _id: "$_id",
                    QuotationNo: { $first: "$QuotationNo" },
                    Date: { $first: "$Date" },
                    bomId: { $first: "$bomId" },
                    customerName: { $first: "$customerName" },
                    location: { $first: "$location" },
                    TypesOfProject: { $first: "$TypesOfProject" },
                    systemSize: { $first: "$systemSize" },
                    SalesDetails: {
                        $push: {
                            $mergeObjects: [
                                "$SalesDetails",
                                {
                                    categoryData: "$SalesDetails.categoryData",
                                    subCategoryData: "$SalesDetails.subCategoryData",
                                    productData: "$SalesDetails.productData"
                                }
                            ]
                        }
                    },
                    Amount1: { $first: "$Amount1" },
                    Amount2: { $first: "$Amount2" },
                    Amount3: { $first: "$Amount3" },
                    Amount4: { $first: "$Amount4" },
                    Amount5: { $first: "$Amount5" },
                    Amount6: { $first: "$Amount6" },
                    terms: { $first: "$terms" },
                    termsData: { $first: "$termsData" },
                    userId: { $first: "$userId" },
                    userData: { $first: "$userData" },
                }
            }
        ])

        let count = paginatedAllConditions.length

        // if (count === 0) {
        //     return res.status(404).json({ status: 404, message: "Terms And Conditions Not Found" })
        // }

        if (page && pageSize) {
            let startIndex = (page - 1) * pageSize
            let lastIndex = (startIndex + pageSize)
            paginatedAllConditions = paginatedAllConditions.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, totalsales: count, message: "All Sales Found SuccessFully..", sales: paginatedAllConditions });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getSalesById = async (req, res) => {
    try {
        let id = req.params.id

        let getSalesId = await sales.findById(id)

        if (!getSalesId) {
            return res.status(404).json({ status: 404, message: "Sales Not Found" })
        }

        return res.status(200).json({ status: 200, message: "Sales Found SuccessFully...", sales: getSalesId })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.updateSalesById = async (req, res) => {
    try {
        let id = req.params.id;
        console.log("Updating BOM with ID:", id, "and data:", req.body);

        let updateSalesId = await sales.findById(id);

        if (!updateSalesId) {
            return res.status(404).json({ status: 404, message: "Sales Not Found" });
        }

        // let getBomData = await bom.findById(updateSalesId.bomId)

        updateSalesId = await sales.findByIdAndUpdate(id, { ...req.body }, { new: true });

        return res.status(200).json({ status: 200, message: "Sales Update SuccessFully...", sales: updateSalesId });
        // return res.status(200).json({ status: 200, message: "Sales Update SuccessFully...", sales: updateSalesId, bom: getBomData });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
}

exports.updateSalesDetailsById = async (req, res) => {
    try {
        const saleDetailId = req.params.id;

        const updateOperation = {};
        const fieldsToUpdate = {};

        Object.keys(req.body).forEach(key => {
            if (key !== '_id') {
                fieldsToUpdate[`SalesDetails.$.${key}`] = req.body[key];
            }
        });

        const updatedSalesRecord = await sales.findOneAndUpdate(
            { "SalesDetails._id": saleDetailId },
            { $set: fieldsToUpdate },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedSalesRecord) {
            return res.status(404).json({ status: 404, message: "Sales Record or Sale Detail Not Found" });
        }

        return res.status(200).json({ status: 200, message: "Sale Detail Updated Successfully", sales: updatedSalesRecord });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.deleteSalesById = async (req, res) => {
    try {
        let id = req.params.id

        let deleteSalesId = await sales.findById(id)

        if (!deleteSalesId) {
            return res.status(404).json({ status: 404, message: "Sales Not Found" })
        }

        await sales.findByIdAndDelete(id);

        return res.status(200).json({ status: 200, message: "Sales Delete SuccessFully..." });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}


exports.getsalesCategory = async (req, res) => {
    try {
        let allCategory = await category.find()

        if (!allCategory) {
            return res.status(404).json({ status: 404, message: "Category Not Found" })
        }

        return res.status(200).json({ status: 200, message: "All Category Data Found SuccessFully...", category: allCategory })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getsalesSubCategory = async (req, res) => {
    try {
        let allSubCategory = await subCategory.aggregate([
            {
                $lookup: {
                    from: 'categories',
                    localField: 'categoryName',
                    foreignField: '_id',
                    as: 'categoryData'
                }
            }
        ]);

        if (!allSubCategory) {
            return res.status(404).json({ status: 404, message: "SubCategory Not Found" })
        }

        return res.status(200).json({ status: 200, message: "All SubCategory Data Found SuccessFully...", subCategory: allSubCategory })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getsalesProduct = async (req, res) => {
    try {
        let allProduct = await product.aggregate([
            {
                $lookup: {
                    from: 'categories',
                    localField: 'mainCategory',
                    foreignField: '_id',
                    as: 'mainCategoryData'
                }
            },
            {
                $lookup: {
                    from: 'subcategories',
                    localField: 'subCategory',
                    foreignField: '_id',
                    as: 'subCategoryData'
                }
            }
        ]);

        if (!allProduct) {
            return res.status(404).json({ status: 404, message: "Product Not Found" })
        }

        return res.status(200).json({ status: 200, message: "All Products Found SuccessFully...", products: allProduct })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}
exports.getsalesBom = async (req, res) => {
    try {
        let allBom = await bom.find()

        if (!allBom) {
            return res.status(404).json({ status: 404, message: "Bom Not Found" })
        }

        return res.status(200).json({ status: 200, message: "All Bom Found SuccessFully...", Bom: allBom })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}
exports.getsalesTerms = async (req, res) => {
    try {
        let allTerms = await terms.find()

        if (!allTerms) {
            return res.status(404).json({ status: 404, message: "Terms Not Found" })
        }

        return res.status(200).json({ status: 200, message: "All Terms Found SuccessFully...", Terms: allTerms })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}