const liasoning = require('../models/liasoning.models');
const roles = require('../models/role.models');
const twilio = require('twilio');

// Twilio credentials
const accountSid = 'AC19958e303a4b922643ab70f634fd0719';  // Your Twilio Account SID
const authToken = 'e9324f48bcabaf09944c9a6679400eb9';    // Your Twilio Auth Token
// const client = twilio(accountSid, authToken);

exports.createLiasoning = async (req, res) => {
    try {
        let { marketId, fillNo, fileDate, Dealer, filledSteps, fileNo, FQPayment, AmountL, AmountDate, SerialNumber, SerialNumberDate,
            addmorephotos, SitePhoto, OtherPhoto, CheckBox1, PhoneNumber, CheckBox1date, CheckBox2, CheckBox2date, CheckBox3, CheckBox3date, CheckBox4, CheckBox4date, CheckBox5, CheckBox5date, Query1, Query2,
            Query3, Query4, Query5, status } = req.body;

        let checkLiasoning = await liasoning.create({
            marketId,
            fillNo,
            fileDate,
            filledSteps,
            fileNo,
            FQPayment,
            AmountL,
            AmountDate,
            SerialNumber,
            SerialNumberDate,
            CheckBox1,
            Dealer,
            CheckBox1date,
            CheckBox2,
            CheckBox2date,
            CheckBox3,
            CheckBox3date,
            CheckBox4,
            CheckBox4date,
            CheckBox5,
            CheckBox5date,
            Query1,
            Query2,
            Query3,
            Query4,
            Query5,
            status,
            PhoneNumber,
        });

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.getAllLiasoning = async (req, res) => {
    try {
        let page = parseInt(req.query.page);
        let pageSize = parseInt(req.query.pageSize);

        if (page < 1 || pageSize < 1) {
            return res.json({ status: 400, message: "Page And PageSize Can't Be Less Then 1" })
        }

        let status = false

        let getRoleId = await roles.findById(req.user.role)

        console.log(getRoleId);

        if (getRoleId.roleName === 'Super Admin') {
            status = true
        }

        let paginatedLiasoning;

        paginatedLiasoning = await liasoning.aggregate([
            {
                $lookup: {
                    from: "commercialmarketings",
                    localField: "marketId",
                    foreignField: "_id",
                    as: "marketdata"
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'marketdata.userId',
                    foreignField: '_id',
                    as: 'marketUserData'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'User_id',
                    foreignField: '_id',
                    as: 'liasoningUserData'
                }
            },
            {
                $lookup: {
                    from: "electricians",
                    localField: "_id",
                    foreignField: "liasoningId",
                    as: "electricianData"
                }
            },
            {
                $lookup: {
                    from: "dealers",
                    localField: "Dealer",
                    foreignField: "_id",
                    as: "dealersData"
                }
            }

        ])

        let count = paginatedLiasoning.length;

        if (page && pageSize) {
            startIndex = (page - 1) * pageSize;
            lastIndex = (startIndex + pageSize)
            paginatedLiasoning = paginatedLiasoning.slice(startIndex, lastIndex)
        }

        return res.json({ status: 200, Totallisoning: count, message: 'All Liasoning Found Successfully..', liasoning: paginatedLiasoning, activeStatus: status })
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
}

exports.getLiasoningById = async (req, res) => {
    try {
        let id = req.params.id;
        let liasoningById = await liasoning.findById(id);
        if (!liasoningById) {
            return res.json({ status: 404, message: "Liasoning Not Found" })
        }
        res.json({ status: 200, message: "Get Liasoning Data Successfully...", liasoning: liasoningById })
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
}

// const STAGES = {
//     APPLICATION_PENDING: 'APPLICATION PENDING',
//     APPLICATION_SUBMITTED: 'APPLICATION SUBMITTED',
//     FQ_STATUS: 'FQ STATUS',
//     FQ_PAID: 'FQ PAID',
//     SITE_DETAILS: 'SITE DETAILS',
//     NET_METER_DOCUMENT: 'NET METER DOCUMENT UPLOAD',
//     NET_METER_QUERIER: 'NET METER DOCUMENT QUERIER',
//     NET_METER_INSTALL: 'NET METER INSTALL',
//     SUBSIDY_CLAIM: 'SUBSIDY CLAIM PROCESS',
//     SUBSIDY_RECEIVED: "SUBSIDY RECEIVED STATUS"
// }

// const STAGE_ORDER = [
//     STAGES.APPLICATION_SUBMITTED,
//     STAGES.FQ_STATUS,
//     STAGES.FQ_PAID,
//     STAGES.SITE_DETAILS,
//     STAGES.NET_METER_DOCUMENT,
//     STAGES.NET_METER_QUERIER,
//     STAGES.NET_METER_INSTALL,
//     STAGES.SUBSIDY_CLAIM,
//     STAGES.SUBSIDY_RECEIVED
// ]

// const calculateNextStage = (currentStage) => {
//     const currentIndex = STAGE_ORDER.indexOf(currentStage);
//     if (currentIndex < STAGE_ORDER.length - 1) {
//         return STAGE_ORDER[currentIndex + 1];
//     }
//     return currentStage;
// }

// const updateFilledSteps = (steps, newSteps) => {
//     const newStepNum = STAGE_ORDER.indexOf(newSteps);
//     if (!steps.includes(newStepNum)) {
//         steps.push(newStepNum);
//     }
//     return steps;
// }

// exports.updateLiasoning = async (req, res) => {
//     try {
//         let id = req.params.id;
//         let updateData = req.body;
//         console.log("aaaaaaa", updateData.AmountL)
//         let checkLiasoningId = await liasoning.findById(id);

//         if (!checkLiasoningId) {
//             return res.json({ status: 404, message: "Liasoning Not Found" })
//         }

//         if (!checkLiasoningId.filledSteps) {
//             checkLiasoningId.filledSteps = [];
//         }

//         const currentStage = checkLiasoningId.applicationStatus || STAGES.APPLICATION_PENDING
//         let newStatus = currentStage;

//         switch (updateData.stage) {

//             case 'APPLICATION SUBMITTED':
//                 if (checkLiasoningId.fileNo) {
//                     newStatus = STAGES.APPLICATION_PENDING;
//                     checkLiasoningId.applicationStatus = newStatus;
//                     checkLiasoningId.filledSteps = checkLiasoningId.filledSteps.filter(
//                         step => STAGE_ORDER[step] !== 'APPLICATION SUBMITTED'
//                     );
//                     await checkLiasoningId.save();
//                 }
//                 if (!checkLiasoningId.fileNo) {
//                     newStatus = STAGES.APPLICATION_SUBMITTED;
//                     checkLiasoningId.filledSteps = updateFilledSteps(
//                         checkLiasoningId.filledSteps,
//                         'APPLICATION SUBMITTED'
//                     );
//                     checkLiasoningId.submissionTime = new Date();
//                     checkLiasoningId.targetStatusChangeTime = new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000);
//                     checkLiasoningId.fileNo = updateData.fileNo || checkLiasoningId.fileNo;
//                     await checkLiasoningId.save();
//                 }
//                 break;

//             case 'FQ STATUS':

//                 if (checkLiasoningId.FQPayment) {
//                     newStatus = STAGES.APPLICATION_SUBMITTED;
//                     checkLiasoningId.applicationStatus = newStatus;
//                     checkLiasoningId.filledSteps = checkLiasoningId.filledSteps.filter(
//                         step => STAGE_ORDER[step] !== 'FQ STATUS'
//                     );
//                     await checkLiasoningId.save();
//                 }
//                 if (!checkLiasoningId.FQPayment) {
//                     newStatus = STAGES.FQ_PAID;
//                     checkLiasoningId.filledSteps = updateFilledSteps(
//                         checkLiasoningId.filledSteps,
//                         'FQ STATUS'
//                     );
//                     checkLiasoningId.applicationStatus = newStatus;
//                     await checkLiasoningId.save();
//                 }
//                 break;

//             case 'FQ PAID':
//                 if (checkLiasoningId.AmountL) {
//                     newStatus = STAGES.FQ_PAID;
//                     checkLiasoningId.applicationStatus = newStatus;
//                     checkLiasoningId.filledSteps = checkLiasoningId.filledSteps.filter(
//                         step => STAGE_ORDER[step] !== 'FQ PAID'
//                     );
//                     await checkLiasoningId.save();
//                 }
//                 if (!checkLiasoningId.AmountL) {
//                     newStatus = STAGES.SITE_DETAILS;
//                     checkLiasoningId.filledSteps = updateFilledSteps(
//                         checkLiasoningId.filledSteps,
//                         'FQ PAID'
//                     );
//                     checkLiasoningId.applicationStatus = newStatus;
//                     await checkLiasoningId.save();
//                 }
//                 break;

//             case "SITE DETAILS":
//                 if (checkLiasoningId.SerialNumber) {
//                     newStatus = STAGES.SITE_DETAILS;
//                     checkLiasoningId.applicationStatus = newStatus;
//                     checkLiasoningId.filledSteps = checkLiasoningId.filledSteps.filter(
//                         step => STAGE_ORDER[step] !== 'SITE DETAILS'
//                     );
//                     await checkLiasoningId.save();
//                 }
//                 if (!checkLiasoningId.SerialNumber) {
//                     newStatus = STAGES.NET_METER_DOCUMENT;
//                     checkLiasoningId.filledSteps = updateFilledSteps(
//                         checkLiasoningId.filledSteps,
//                         'SITE DETAILS'
//                     );
//                     checkLiasoningId.applicationStatus = newStatus;
//                     await checkLiasoningId.save();
//                 }
//                 break;

//             case "NET METER DOCUMENT UPLOAD":
//                 if (checkLiasoningId.CheckBox1 && checkLiasoningId.CheckBox1date && checkLiasoningId.Query1) {
//                     newStatus = STAGES.NET_METER_DOCUMENT;
//                     checkLiasoningId.applicationStatus = newStatus;
//                     checkLiasoningId.filledSteps = checkLiasoningId.filledSteps.filter(
//                         step => STAGE_ORDER[step] !== 'NET METER DOCUMENT UPLOAD'
//                     );
//                     await checkLiasoningId.save();
//                 }
//                 if (!checkLiasoningId.CheckBox1 && !checkLiasoningId.CheckBox1date && !checkLiasoningId.Query1) {
//                     newStatus = STAGES.NET_METER_QUERIER;
//                     checkLiasoningId.filledSteps = updateFilledSteps(
//                         checkLiasoningId.filledSteps,
//                         'NET METER DOCUMENT UPLOAD'
//                     );
//                     checkLiasoningId.applicationStatus = newStatus;
//                     await checkLiasoningId.save();
//                 }
//                 break;

//             case "NET METER DOCUMENT QUERIER":
//                 if (checkLiasoningId.CheckBox2 && checkLiasoningId.CheckBox2date && checkLiasoningId.Query2) {
//                     newStatus = STAGES.NET_METER_QUERIER;
//                     checkLiasoningId.applicationStatus = newStatus;
//                     checkLiasoningId.filledSteps = checkLiasoningId.filledSteps.filter(
//                         step => STAGE_ORDER[step] !== 'NET METER DOCUMENT QUERIER'
//                     );
//                     await checkLiasoningId.save();
//                 }

//                 if (!checkLiasoningId.CheckBox2 && !checkLiasoningId.CheckBox2date && !checkLiasoningId.Query2) {
//                     newStatus = STAGES.NET_METER_INSTALL;
//                     checkLiasoningId.filledSteps = updateFilledSteps(
//                         checkLiasoningId.filledSteps,
//                         'NET METER DOCUMENT QUERIER'
//                     );
//                     checkLiasoningId.applicationStatus = newStatus;
//                     await checkLiasoningId.save();
//                 }
//                 break;

//             case "NET METER INSTALL":
//                 if (checkLiasoningId.CheckBox3 && checkLiasoningId.CheckBox3date && checkLiasoningId.Query3) {
//                     newStatus = STAGES.NET_METER_INSTALL;
//                     checkLiasoningId.applicationStatus = newStatus;
//                     checkLiasoningId.filledSteps = checkLiasoningId.filledSteps.filter(
//                         step => STAGE_ORDER[step] !== 'NET METER INSTALL'
//                     );
//                     await checkLiasoningId.save();
//                 }
//                 if (!checkLiasoningId.CheckBox3 && !checkLiasoningId.CheckBox3date && !checkLiasoningId.Query3) {
//                     newStatus = STAGES.SUBSIDY_CLAIM;
//                     checkLiasoningId.filledSteps = updateFilledSteps(
//                         checkLiasoningId.filledSteps,
//                         'NET METER INSTALL'
//                     );
//                     checkLiasoningId.applicationStatus = newStatus;
//                     await checkLiasoningId.save();
//                 }
//                 break;

//             case 'SUBSIDY CLAIM PROCESS':

//                 if (checkLiasoningId.CheckBox4 && checkLiasoningId.CheckBox4date && checkLiasoningId.Query4) {
//                     newStatus = STAGES.SUBSIDY_CLAIM;
//                     checkLiasoningId.applicationStatus = newStatus;
//                     checkLiasoningId.filledSteps = checkLiasoningId.filledSteps.filter(
//                         step => STAGE_ORDER[step] !== 'SUBSIDY CLAIM PROCESS'
//                     );
//                     await checkLiasoningId.save();
//                 }

//                 if (!checkLiasoningId.CheckBox4 && !checkLiasoningId.CheckBox4date && !checkLiasoningId.Query4) {
//                     newStatus = STAGES.SUBSIDY_CLAIM;
//                     checkLiasoningId.filledSteps = updateFilledSteps(
//                         checkLiasoningId.filledSteps,
//                         'SUBSIDY CLAIM PROCESS'
//                     )

//                     checkLiasoningId.subSidyCalaimSetDate = new Date();
//                     checkLiasoningId.subSidyCalaimStatusChangeTime = new Date(new Date().getTime() + 25 * 24 * 60 * 60 * 1000);

//                     await checkLiasoningId.save();
//                 }
//                 break;

//             default:
//                 newStatus = calculateNextStage(currentStage);
//                 checkLiasoningId.filledSteps = updateFilledSteps(
//                     checkLiasoningId.filledSteps,
//                     updateData.stage
//                 )
//         }

//         checkLiasoningId = await liasoning.findByIdAndUpdate(
//             id,
//             {
//                 ...updateData,
//                 applicationStatus: newStatus,
//                 filledSteps: checkLiasoningId.filledSteps
//             },
//             { new: true }
//         );

//         return res.json({ status: 200, message: "Liasoning Updated Successfully..", liasoning: checkLiasoningId })

//     } catch (error) {
//         res.json({ status: 500, message: error.message });
//         console.log(error);
//     }
// };

// setInterval(async () => {
//     const records = await liasoning.find({
//         applicationStatus: STAGES.APPLICATION_SUBMITTED,
//         targetStatusChangeTime: { $lte: new Date() }
//     });


//     for (const record of records) {
//         if (new Date(record.targetStatusChangeTime) <= new Date()) {
//             record.applicationStatus = STAGES.FQ_STATUS;
//             await record.save();
//         }
//     }
// });

// setInterval(async () => {
//     const records = await liasoning.find({
//         applicationStatus: STAGES.SUBSIDY_CLAIM,
//         subSidyCalaimStatusChangeTime: { $lte: new Date() }
//     });


//     for (const record of records) {
//         if (new Date(record.subSidyCalaimStatusChangeTime) <= new Date()) {
//             record.applicationStatus = STAGES.SUBSIDY_RECEIVED;
//             record.filledSteps = updateFilledSteps(record.filledSteps, STAGES.SUBSIDY_RECEIVED);
//             await record.save();
//         }
//     }
// });


const STAGES = {
    APPLICATION_SUBMITTED: 'APPLICATION SUBMITTED',
    FQ_STATUS: 'FQ STATUS',
    FQ_PAID: 'FQ PAID',
    SITE_DETAILS: 'SITE DETAILS',
    NET_METER_DOCUMENT: 'NET METER DOCUMENT UPLOAD',
    NET_METER_QUERIER: 'NET METER DOCUMENT QUERIER',
    NET_METER_INSTALL: 'NET METER INSTALL',
    SUBSIDY_CLAIM: 'SUBSIDY CLAIM PROCESS',
    SUBSIDY_RECEIVED: "SUBSIDY RECEIVED STATUS"
};

const STAGE_ORDER = [
    STAGES.APPLICATION_SUBMITTED,
    STAGES.FQ_STATUS,
    STAGES.FQ_PAID,
    STAGES.SITE_DETAILS,
    STAGES.NET_METER_DOCUMENT,
    STAGES.NET_METER_QUERIER,
    STAGES.NET_METER_INSTALL,
    STAGES.SUBSIDY_CLAIM,
    STAGES.SUBSIDY_RECEIVED
];
const updateFilledSteps = (steps, newSteps) => {
    const newStepNum = STAGE_ORDER.indexOf(newSteps);
    if (!steps.includes(newStepNum)) {
        steps.push(newStepNum);
    }
    steps.sort((a, b) => a - b);
    return steps;
};

const removeFilledStep = (steps, stage) => {
    const stageIndex = STAGE_ORDER.indexOf(stage);
    if (stageIndex !== -1) {
        steps = steps.filter(step => Number(step) !== stageIndex);
    }
    // steps.sort((a, b) => a - b);
    return steps;
};

const getLastCompletedStage = (steps) => {
    if (!steps || steps.length === 0) {
        return STAGES.APPLICATION_SUBMITTED;
    }
    let lastStepIndex = Math.max(...steps.map(Number));

    lastStepIndex = lastStepIndex + 1

    if (lastStepIndex == 9) {
        return STAGES.SUBSIDY_RECEIVED
    }
    return STAGE_ORDER[lastStepIndex];
};

const getNextStageAfterRemoval = async (filledSteps, liasoningId) => {
    try {
        const sortedSteps = [...filledSteps].map(Number).sort((a, b) => a - b);
        const lastCompletedIndex = Math.max(...sortedSteps);


        if (sortedSteps.length === 1 && sortedSteps[0] === 0) {
            const record = await liasoning.findById(liasoningId);

            if (record && record.submissionTime) {
                const daysSinceSubmission = (new Date() - new Date(record.submissionTime)) / (1000 * 60 * 60 * 24);

                if (daysSinceSubmission >= 10) {
                    return STAGES.FQ_STATUS;
                }
                return STAGES.APPLICATION_SUBMITTED;
            }
            return STAGES.APPLICATION_SUBMITTED;
        }

        if (lastCompletedIndex >= 0) {
            const nextStageIndex = lastCompletedIndex + 1;
            if (nextStageIndex < STAGE_ORDER.length) {
                const nextStage = STAGE_ORDER[nextStageIndex];
                return nextStage;
            }
        }

        return STAGES.APPLICATION_SUBMITTED;

    } catch (error) {
        console.log(error);
        return STAGES.APPLICATION_SUBMITTED;
    }
};
exports.updateLiasoning = async (req, res) => {
    try {
        const id = req.params.id;
        const updateData = req.body;
        let checkLiasoningId = await liasoning.findById(id);

        if (!checkLiasoningId) {
            return res.json({ status: 404, message: "Liasoning Not Found" });
        }

        if (!checkLiasoningId.filledSteps) {
            checkLiasoningId.filledSteps = [];
        }

        let newStatus = checkLiasoningId.applicationStatus || STAGES.APPLICATION_SUBMITTED;

        switch (updateData.stage) {
            case STAGES.APPLICATION_SUBMITTED:
                if (updateData.fileNo === "") {
                    checkLiasoningId.fileNo = updateData.fileNo;
                    checkLiasoningId.fileDate = undefined
                    checkLiasoningId.submissionTime = null;
                    checkLiasoningId.targetStatusChangeTime = null;
                    checkLiasoningId.filledSteps = await removeFilledStep(checkLiasoningId.filledSteps, STAGES.APPLICATION_SUBMITTED);
                    newStatus = await getNextStageAfterRemoval(checkLiasoningId.filledSteps, id);
                } else {
                    checkLiasoningId.fileNo = await updateData.fileNo;
                    checkLiasoningId.fileDate = await updateData.fileDate
                    checkLiasoningId.submissionTime = new Date();
                    checkLiasoningId.targetStatusChangeTime = new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000);
                    checkLiasoningId.filledSteps = await updateFilledSteps(checkLiasoningId.filledSteps, STAGES.APPLICATION_SUBMITTED);
                }
                newStatus = STAGES.APPLICATION_SUBMITTED;
                break;

            case STAGES.FQ_STATUS:
                if (updateData.FQPayment === "") {
                    checkLiasoningId.FQPayment = updateData.FQPayment;
                    checkLiasoningId.filledSteps = await removeFilledStep(checkLiasoningId.filledSteps, STAGES.FQ_STATUS);
                    newStatus = await getNextStageAfterRemoval(checkLiasoningId.filledSteps, id);
                } else {
                    checkLiasoningId.FQPayment = updateData.FQPayment;
                    checkLiasoningId.filledSteps = await updateFilledSteps(checkLiasoningId.filledSteps, STAGES.FQ_STATUS);
                    const lastCompletedStage = getLastCompletedStage(checkLiasoningId.filledSteps);
                    if (lastCompletedStage === STAGES.APPLICATION_SUBMITTED) {
                        newStatus = STAGES.FQ_PAID;
                    } else {
                        newStatus = lastCompletedStage;
                    }
                }
                // newStatus = STAGES.FQ_PAID;
                break;

            case STAGES.FQ_PAID:
                if (updateData.AmountL === "") {
                    checkLiasoningId.AmountL = updateData.AmountL;
                    checkLiasoningId.AmountDate = undefined;
                    checkLiasoningId.filledSteps = await removeFilledStep(checkLiasoningId.filledSteps, STAGES.FQ_PAID);
                    newStatus = await getNextStageAfterRemoval(checkLiasoningId.filledSteps, id);
                } else {
                    checkLiasoningId.AmountL = await updateData.AmountL;
                    checkLiasoningId.AmountDate = await updateData.AmountDate
                    checkLiasoningId.filledSteps = await updateFilledSteps(checkLiasoningId.filledSteps, STAGES.FQ_PAID);
                    const lastCompletedStage = getLastCompletedStage(checkLiasoningId.filledSteps);
                    if (lastCompletedStage === STAGES.FQ_STATUS) {
                        newStatus = STAGES.SITE_DETAILS;
                    } else {
                        newStatus = lastCompletedStage;
                    }
                }
                // newStatus = STAGES.SITE_DETAILS;
                break;

            case STAGES.SITE_DETAILS:
                if (updateData.SerialNumber === "") {
                    checkLiasoningId.SerialNumber = updateData.SerialNumber;
                    checkLiasoningId.SerialNumberDate = undefined
                    checkLiasoningId.filledSteps = await removeFilledStep(checkLiasoningId.filledSteps, STAGES.SITE_DETAILS);
                    newStatus = await getNextStageAfterRemoval(checkLiasoningId.filledSteps, id);

                } else {
                    checkLiasoningId.SerialNumber = await updateData.SerialNumber;
                    checkLiasoningId.SerialNumberDate = await updateData.SerialNumberDate
                    checkLiasoningId.filledSteps = await updateFilledSteps(checkLiasoningId.filledSteps, STAGES.SITE_DETAILS);
                    const lastCompletedStage = getLastCompletedStage(checkLiasoningId.filledSteps);
                    if (lastCompletedStage === STAGES.FQ_PAID) {
                        newStatus = STAGES.NET_METER_DOCUMENT;
                    } else {
                        newStatus = lastCompletedStage;
                    }
                }
                // newStatus = STAGES.NET_METER_DOCUMENT;
                break;

            case STAGES.NET_METER_DOCUMENT:
                if (updateData.Query1 === "") {
                    checkLiasoningId.Query1 = await updateData.Query1;
                    checkLiasoningId.CheckBox1 = await updateData.CheckBox1;
                    checkLiasoningId.CheckBox1date = await updateData.CheckBox1date
                    checkLiasoningId.filledSteps = await removeFilledStep(checkLiasoningId.filledSteps, STAGES.NET_METER_DOCUMENT);
                    newStatus = await getNextStageAfterRemoval(checkLiasoningId.filledSteps, id);
                } else {
                    checkLiasoningId.Query1 = await updateData.Query1;
                    checkLiasoningId.CheckBox1 = await updateData.CheckBox1;
                    checkLiasoningId.CheckBox1date = await updateData.CheckBox1date
                    checkLiasoningId.filledSteps = await updateFilledSteps(checkLiasoningId.filledSteps, STAGES.NET_METER_DOCUMENT);
                    const lastCompletedStage = getLastCompletedStage(checkLiasoningId.filledSteps);
                    if (lastCompletedStage === STAGES.SITE_DETAILS) {
                        newStatus = STAGES.NET_METER_QUERIER;
                    } else {
                        newStatus = lastCompletedStage;
                    }
                }
                // newStatus = STAGES.NET_METER_QUERIER;
                break;

            case STAGES.NET_METER_QUERIER:
                if (updateData.Query2 === "") {
                    checkLiasoningId.Query2 = await updateData.Query2;
                    checkLiasoningId.CheckBox2 = await updateData.CheckBox2;
                    checkLiasoningId.CheckBox2date = await updateData.CheckBox2date
                    checkLiasoningId.filledSteps = await removeFilledStep(checkLiasoningId.filledSteps, STAGES.NET_METER_QUERIER);
                    newStatus = await getNextStageAfterRemoval(checkLiasoningId.filledSteps, id);
                } else {
                    checkLiasoningId.Query2 = updateData.Query2;
                    checkLiasoningId.CheckBox2 = await updateData.CheckBox2;
                    checkLiasoningId.CheckBox2date = await updateData.CheckBox2date
                    checkLiasoningId.filledSteps = await updateFilledSteps(checkLiasoningId.filledSteps, STAGES.NET_METER_QUERIER);
                    const lastCompletedStage = getLastCompletedStage(checkLiasoningId.filledSteps);
                    if (lastCompletedStage === STAGES.NET_METER_DOCUMENT) {
                        newStatus = STAGES.NET_METER_INSTALL;
                    } else {
                        newStatus = lastCompletedStage;
                    }
                }
                // newStatus = STAGES.NET_METER_INSTALL;
                break;

            case STAGES.NET_METER_INSTALL:
                if (updateData.Query3 === "") {
                    checkLiasoningId.Query3 = updateData.Query3;
                    checkLiasoningId.CheckBox3 = await updateData.CheckBox3;
                    checkLiasoningId.CheckBox3date = await updateData.CheckBox3date
                    checkLiasoningId.filledSteps = await removeFilledStep(checkLiasoningId.filledSteps, STAGES.NET_METER_INSTALL);
                    newStatus = await getNextStageAfterRemoval(checkLiasoningId.filledSteps, id);
                } else {
                    checkLiasoningId.Query3 = updateData.Query3;
                    checkLiasoningId.CheckBox3 = await updateData.CheckBox3;
                    checkLiasoningId.CheckBox3date = await updateData.CheckBox3date;
                    checkLiasoningId.filledSteps = await updateFilledSteps(checkLiasoningId.filledSteps, STAGES.NET_METER_INSTALL);
                    const lastCompletedStage = getLastCompletedStage(checkLiasoningId.filledSteps);
                    if (lastCompletedStage === STAGES.NET_METER_QUERIER) {
                        newStatus = STAGES.SUBSIDY_CLAIM;
                    } else {
                        newStatus = lastCompletedStage;
                    }
                }
                // newStatus = STAGES.SUBSIDY_CLAIM;
                break;

            case STAGES.SUBSIDY_CLAIM:
                if (updateData.Query4 === "") {
                    checkLiasoningId.Query4 = updateData.Query4;
                    checkLiasoningId.CheckBox4 = await updateData.CheckBox4;
                    checkLiasoningId.CheckBox4date = await updateData.CheckBox4date
                    checkLiasoningId.subsidyClaim = null;
                    checkLiasoningId.subSidyCalaimSetDate = null;
                    checkLiasoningId.subSidyCalaimStatusChangeTime = null;
                    checkLiasoningId.filledSteps = await removeFilledStep(checkLiasoningId.filledSteps, STAGES.SUBSIDY_CLAIM);
                    newStatus = await getNextStageAfterRemoval(checkLiasoningId.filledSteps, id);
                } else {
                    checkLiasoningId.Query4 = await updateData.Query4;
                    checkLiasoningId.CheckBox4 = await updateData.CheckBox4;
                    checkLiasoningId.CheckBox4date = await updateData.CheckBox4date;
                    checkLiasoningId.subSidyCalaimSetDate = new Date();
                    checkLiasoningId.subSidyCalaimStatusChangeTime = new Date(new Date().getTime() + 25 * 24 * 60 * 60 * 1000);
                    checkLiasoningId.filledSteps = await updateFilledSteps(checkLiasoningId.filledSteps, STAGES.SUBSIDY_CLAIM);
                    const lastCompletedStage = getLastCompletedStage(checkLiasoningId.filledSteps);
                    if (lastCompletedStage === STAGES.SUBSIDY_RECEIVED) {
                        newStatus = STAGES.SUBSIDY_RECEIVED;
                    } else {
                        newStatus = lastCompletedStage;
                    }
                }
                // newStatus = STAGES.SUBSIDY_CLAIM;
                break;

            case STAGES.SUBSIDY_RECEIVED:
                if (updateData.Query5 === "") {
                    checkLiasoningId.Query5 = await updateData.Query5;
                    checkLiasoningId.CheckBox5 = await updateData.CheckBox5;
                    checkLiasoningId.CheckBox5date = await updateData.CheckBox5date;
                    checkLiasoningId.filledSteps = await removeFilledStep(checkLiasoningId.filledSteps, STAGES.SUBSIDY_RECEIVED);
                    newStatus = await getNextStageAfterRemoval(checkLiasoningId.filledSteps, id);
                } else {
                    checkLiasoningId.Query5 = await updateData.Query5;
                    checkLiasoningId.CheckBox5 = await updateData.CheckBox5;
                    checkLiasoningId.CheckBox5date = await updateData.CheckBox5date;
                    checkLiasoningId.filledSteps = await updateFilledSteps(checkLiasoningId.filledSteps, STAGES.SUBSIDY_RECEIVED);
                }
                newStatus = STAGES.SUBSIDY_RECEIVED;
                break;

            default:
                newStatus = await calculateNextStage(updateData.stage);
                checkLiasoningId.filledSteps = await updateFilledSteps(checkLiasoningId.filledSteps, updateData.stage);
        }

        checkLiasoningId.applicationStatus = newStatus;
        await checkLiasoningId.save();

        let phoneNumber = checkLiasoningId.PhoneNumber;

        // Add +91 if it is not already present
        if (!phoneNumber.startsWith("+91")) {
            phoneNumber = `+91${phoneNumber}`;
        }

        let message = `Your Liasoning Status Updated to ${newStatus}`;
        // let to = phoneNumber;

        let to = "+919624610077";
        client.messages
            .create({
                body: message,
                from: 'whatsapp:+14155238886',
                to: `whatsapp:${to}`,
            })

        return res.json({
            status: 200,
            message: "Liasoning Updated Successfully",
            liasoning: checkLiasoningId
        });

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

const checkAndUpdateStatus = async () => {
    const currentTime = new Date();
    const recordsToProcess = await liasoning.find({
        $or: [
            {
                applicationStatus: STAGES.APPLICATION_SUBMITTED,
                targetStatusChangeTime: { $lte: currentTime }
            },
            {
                applicationStatus: STAGES.SUBSIDY_CLAIM,
                subSidyCalaimStatusChangeTime: { $lte: currentTime }
            }
        ]
    });

    for (const record of recordsToProcess) {
        if (record.applicationStatus === STAGES.APPLICATION_SUBMITTED) {
            record.applicationStatus = STAGES.FQ_STATUS;
            await record.save();
        } else if (record.applicationStatus === STAGES.SUBSIDY_CLAIM) {
            record.applicationStatus = STAGES.SUBSIDY_RECEIVED;
            record.filledSteps = updateFilledSteps(record.filledSteps, STAGES.SUBSIDY_RECEIVED);
            await record.save();
        }
    }
};

checkAndUpdateStatus();

exports.deleteLiasoning = async (req, res) => {
    try {
        let id = req.params.id;

        let checkLiasoningId = await liasoning.findById(id);

        if (!checkLiasoningId) {
            return res.json({ status: 404, message: "Liasoning Not Found" })
        }

        await liasoning.findByIdAndDelete(id);

        return res.json({ status: 200, message: "Liasoning Removed Successfully.." })
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
}

exports.updateLiasoningStatus = async (req, res) => {
    try {
        let id = req.params.id
        let { status } = req.body
        let updateStatus = await liasoning.findById(id)

        if (!updateStatus) {
            return res.status(404).json({ status: 404, message: 'Liasoning Not Found' })
        }

        updateStatus.status = status

        await updateStatus.save()

        return res.status(200).json({ status: 200, message: "Status Updated SuccessFully...", Liasoning: updateStatus })

    } catch (error) {
        console.log(error);
        return res.json({ status: 500, message: error.message });

    }
}
