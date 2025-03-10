const Marketing = require("../models/marketing");

async function generateFillNo() {
    const lastCommercialMarket = await commercialMarket.findOne().sort({ createdAt: -1 });
    if (!lastCommercialMarket) {
        return 'A001';
    }

    const lastFillNo = lastCommercialMarket.fillNo;
    const prefix = lastFillNo.charAt(0);

    let sequenceNumber = parseInt(lastFillNo.substr(1));
    if (sequenceNumber < 9) {
        sequenceNumber++;
    } else {
        const nextPrefix = String.fromCharCode(prefix.charCodeAt(0) + 1);
        sequenceNumber = 1;
        return `${nextPrefix}001`;
    }

    return `${prefix}${sequenceNumber.toString().padStart(3, '0')}`;
}

exports.CreateMarketing = async (req, res) => {
    try {
        let { fillNo, date, contactPeosonName, dealer, phoneNumber, marketingType, address, city, district, pincode, latitude, amount, gst, totalAmount, bank, consumerNameAsPerLightBill,
            dealerCommission, consumerNumber, conectionLoad, tarrif, averageMonthlyBill, gstNumber, panNumber, udhyamRegistration, consumerName, longitude, primaryAccount, solarAmount,
            cashAmount, dealerPolicy, solarModuleMake, solarModuleNos, solarModulWp, systmSizeKw, inventrySize
        } = req.body;

        if (!fillNo) {
            fillNo = await generateFillNo();

        }
        let marketing = req.body.marketingType;
        let MarketingData;

        if(marketing === "CommercialMarketing") {
            MarketingData =  await Marketing.create({
                    fillNo,
                    date,
                    contactPeosonName,
                    phoneNumber,
                    address,
                    city,
                    dealer,
                    district,
                    pincode,
                    latitude,
                    amount,
                    gst,
                    totalAmount,
                    bank,
                    marketingType,
                    consumerNameAsPerLightBill,
                    dealerCommission,
                    consumerNumber,
                    conectionLoad,
                    tarrif,
                    averageMonthlyBill,
                    systmSizeKw,
                    gstNumber,
                    panNumber,
                    udhyamRegistration
                })
        } else if (marketing === "ResidentialMarketing") {
            MarketingData =  await Marketing.create({
                    fillNo,
                    date,
                    consumerName,
                    phoneNumber,
                    consumerNumber,
                    address,
                    city,
                    district,
                    pincode,
                    latitude,
                    longitude,
                    marketingType,
                    primaryAccount,
                    dealer,
                    cashAmount,
                    solarAmount,
                    solarModuleMake,
                    dealerPolicy,
                    solarModulWp,
                    solarModuleNos,
                    systmSizeKw,
                    inventrySize
                })
        }
        return res.status(200).json({status:"true", message:"Marketing Data Created Successfully", Marketing:MarketingData})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
}