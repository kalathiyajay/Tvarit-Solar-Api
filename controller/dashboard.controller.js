const market = require("../models/commercialMarketing.models");
const liasoning = require("../models/liasoning.models");
const dispatch = require("../models/dispatchProcess.model");
const account = require("../models/account.models");
const roles = require("../models/role.models");
const VendorPayment = require("../models/VendorPayment.models")
const DealerPayment = require('../models/DealerPayment.models')
const Installerpayments = require('../models/installerpayment.model')
const store = require('../models/store.models')
const DispatchProcess = require('../models/dispatchProcess.model')
const dealer = require('../models/dealerEntery.models')
const installerPayment = require('../models/installerpayment.model')
const assignInstaller = require('../models/assign.models')
const electrician = require('../models/electrician.modals')
const fabricator = require('../models/fabricator.models');
const technician = require('../models/technician.modals');

exports.getAggregatedData = async (req, res) => {
  try {
    const { selectedfilter, m, y } = req.query;

    let status = false

    let getRoleId = await roles.findById(req.user.role)

    if (getRoleId.roleName === 'Super Admin') {
      status = true
    }

    let matchStage;
    if (selectedfilter === "month") {
      matchStage = {
        createdAt: {
          $gte: new Date(y, m, 1),
          $lt: new Date(y, parseInt(m) + 1, 1),
        },
      };
    } else if (selectedfilter === "year") {

      matchStage = {
        createdAt: {
          $gte: new Date(y, 0, 1),
          $lt: new Date(parseInt(y) + 1, 0, 1),
        },
      };
    } else if (selectedfilter === "total") {
      matchStage = {};
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid selectedfilter. Use "month" or "year".',
      });
    }

    const marketData = await market.aggregate([
      {
        $match: matchStage,
      },
      {
        $group: {
          _id: null,
          totalSystemSizeKw: {
            $sum: { $toDouble: "$SystemSizeKw" },
          },
          totalAmount: {
            $sum: { $toDouble: "$TotalAmount" },
          },
          totalCount: {
            $sum: 1,
          },
        },
      },
    ]);

    const accountData = await account.aggregate([
      {
        $match: matchStage,
      },
      {
        $lookup: {
          from: "liasonings",
          localField: "matketId",
          foreignField: "marketId",
          as: "liasoningDetails",
        },
      },
      {
        $addFields: {
          excludeFromTotal: {
            $anyElementTrue: {
              $map: {
                input: "$liasoningDetails",
                as: "liasoning",
                in: { $eq: ["$$liasoning.status", "Enabled"] },
              },
            },
          },
        },
      },
      {
        $match: {
          excludeFromTotal: false,
        },
      },
      {
        $group: {
          _id: null,
          TotalAccountAmount: { $sum: { $toDouble: "$TotalAccountAmount" } },
        },
      },
    ]);

    const aggregatedData = {
      totalSystemSizeKw:
        marketData.length > 0 ? marketData[0].totalSystemSizeKw : 0,
      totalAmount: marketData.length > 0 ? marketData[0].totalAmount : 0,
      totalAccountAmount:
        accountData.length > 0 ? accountData[0].TotalAccountAmount : 0,
      totalCount: marketData.length > 0 ? marketData[0].totalCount : 0,
    };

    res.status(200).json({
      success: true,
      status: status,
      data: aggregatedData,
    });
  } catch (error) {
    console.error("Error while aggregating data:", error);
    res.status(500).json({ success: false, message: "An error occurred while fetching aggregated data", error: error.message, });
  }
};

exports.piechart = async (req, res) => {
  try {
    const { selectedfilter, m, y } = req.query;

    let status = false

    let getRoleId = await roles.findById(req.user.role)

    if (getRoleId.roleName === 'Super Admin') {
      status = true
    }

    let matchStage;
    if (selectedfilter === "month") {
      matchStage = {
        createdAt: {
          $gte: new Date(y, m, 1),
          $lt: new Date(y, parseInt(m) + 1, 1),
        },
      };
    } else if (selectedfilter === "year") {
      matchStage = {
        createdAt: {
          $gte: new Date(y, 0, 1),
          $lt: new Date(parseInt(y) + 1, 0, 1),
        },
      };
    } else if (selectedfilter === "total") {
      matchStage = {};
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid selectedfilter. Use "month" or "year".',
      });
    }
    const aggregation = await market.aggregate([
      {
        $match: matchStage,
      },
      {
        $group: {
          _id: "$MarketingType",
          totalSystemSizeKw: { $sum: { $toDouble: "$SystemSizeKw" } },
        },
      },
      {
        $group: {
          _id: null,
          totalSystemSizeKw: { $sum: "$totalSystemSizeKw" },
          marketingTypes: {
            $push: {
              type: "$_id",
              totalSystemSizeKw: "$totalSystemSizeKw",
            },
          },
        },
      },
      {
        $unwind: "$marketingTypes",
      },
      {
        $project: {
          type: "$marketingTypes.type",
          totalSystemSizeKw: "$marketingTypes.totalSystemSizeKw",
          percentage: {
            $multiply: [
              {
                $divide: [
                  "$marketingTypes.totalSystemSizeKw",
                  "$totalSystemSizeKw",
                ],
              },
              100,
            ],
          },
        },
      },
      {
        $sort: { type: 1 },
      },
    ]);

    return res.json({
      status: 200,
      totalSystemSizeKw:
        aggregation.length > 0 ? aggregation[0].totalSystemSizeKw : 0,
      data: aggregation,
      status: status,
      message: "Pie Chart Data Successfully Retrieved",
    });
  } catch (error) {
    res.json({ status: 500, message: error.message });
    console.error("Error while fetching pie chart data:", error);
  }
};

exports.linechart = async (req, res) => {
  try {
    let status = false

    let getRoleId = await roles.findById(req.user.role)

    if (getRoleId.roleName === 'Super Admin') {
      status = true
    }

    let selectedfilter = req.query.selectedfilter;
    let comdata = await market.find();
    let liasoningData = await liasoning.find();
    let dispatchData = await dispatch.find();
    let accountData = await account.find();

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const monthWiseData = {
      CommercialCountByMonth: {},
      ResidentialCountByMonth: {},
      applicationsSubmittedCountByMonth: {},
      subsidiesReceivedCountByMonth: {},
      dispatchCountByMonth: {},
      accountsWithPendingAmountByMonth: {},
    };

    const dayWiseData = {
      CommercialCountByDay: {},
      ResidentialCountByDay: {},
      applicationsSubmittedCountByDay: {},
      subsidiesReceivedCountByDay: {},
      dispatchCountByDay: {},
      accountsWithPendingAmountByDay: {},
    };

    // Populate month-wise data structures with zeros
    const months = [];
    for (let i = 0; i < 12; i++) {
      const month = new Date(currentYear, i).toLocaleString("default", {
        month: "long",
      });
      const monthKey = `${month} ${currentYear}`;
      months.push(monthKey);
      monthWiseData.CommercialCountByMonth[monthKey] = 0;
      monthWiseData.ResidentialCountByMonth[monthKey] = 0;
      monthWiseData.applicationsSubmittedCountByMonth[monthKey] = 0;
      monthWiseData.subsidiesReceivedCountByMonth[monthKey] = 0;
      monthWiseData.dispatchCountByMonth[monthKey] = 0;
      monthWiseData.accountsWithPendingAmountByMonth[monthKey] = 0;
    }

    // Populate day-wise data structures with zeros for the current month
    for (let i = 1; i <= daysInMonth; i++) {
      const dayKey = `${i} ${new Date(currentYear, currentMonth).toLocaleString(
        "default",
        { month: "long" }
      )} ${currentYear}`;
      dayWiseData.CommercialCountByDay[dayKey] = 0;
      dayWiseData.ResidentialCountByDay[dayKey] = 0;
      dayWiseData.applicationsSubmittedCountByDay[dayKey] = 0;
      dayWiseData.subsidiesReceivedCountByDay[dayKey] = 0;
      dayWiseData.dispatchCountByDay[dayKey] = 0;
      dayWiseData.accountsWithPendingAmountByDay[dayKey] = 0;
    }

    // Aggregate data month-wise and day-wise
    comdata.forEach((item) => {
      const date = new Date(item.createdAt);
      const monthKey = `${date.toLocaleString("default", {
        month: "long",
      })} ${date.getFullYear()}`;
      const dayKey = `${date.getDate()} ${date.toLocaleString("default", {
        month: "long",
      })} ${date.getFullYear()}`;

      if (item.MarketingType === "Commercial") {
        monthWiseData.CommercialCountByMonth[monthKey]++;
        dayWiseData.CommercialCountByDay[dayKey]++;
      } else if (item.MarketingType === "Residential") {
        monthWiseData.ResidentialCountByMonth[monthKey]++;
        dayWiseData.ResidentialCountByDay[dayKey]++;
      }
    });

    // Aggregate data for liasoningData
    liasoningData.forEach((item) => {
      // Use different date fields based on the application status
      const submissionDate = new Date(item.submissionTime);
      const subsidyDate = new Date(item.subSidyCalaimStatusChangeTime);

      const submissionMonthKey = `${submissionDate.toLocaleString("default", {
        month: "long",
      })} ${submissionDate.getFullYear()}`;
      const subsidyMonthKey = `${subsidyDate.toLocaleString("default", {
        month: "long",
      })} ${subsidyDate.getFullYear()}`;

      const submissionDayKey = `${submissionDate.getDate()} ${submissionDate.toLocaleString(
        "default",
        { month: "long" }
      )} ${submissionDate.getFullYear()}`;
      const subsidyDayKey = `${subsidyDate.getDate()} ${subsidyDate.toLocaleString(
        "default",
        { month: "long" }
      )} ${subsidyDate.getFullYear()}`;

      if (item.applicationStatus === "APPLICATION SUBMITTED") {
        monthWiseData.applicationsSubmittedCountByMonth[submissionMonthKey]++;
        dayWiseData.applicationsSubmittedCountByDay[submissionDayKey]++;
      }
      if (item.applicationStatus === "SUBSIDY RECEIVED STATUS") {
        monthWiseData.subsidiesReceivedCountByMonth[subsidyMonthKey]++;
        dayWiseData.subsidiesReceivedCountByDay[subsidyDayKey]++;
      }
    });

    // Aggregate data for dispatchData
    dispatchData.forEach((item) => {
      const date = new Date(item.createdAt);
      const monthKey = `${date.toLocaleString("default", {
        month: "long",
      })} ${date.getFullYear()}`;
      const dayKey = `${date.getDate()} ${date.toLocaleString("default", {
        month: "long",
      })} ${date.getFullYear()}`;

      monthWiseData.dispatchCountByMonth[monthKey]++;
      dayWiseData.dispatchCountByDay[dayKey]++;
    });

    // Aggregate data for accountData
    accountData.forEach((item) => {
      const date = new Date(item.createdAt);
      const monthKey = `${date.toLocaleString("default", {
        month: "long",
      })} ${date.getFullYear()}`;
      const dayKey = `${date.getDate()} ${date.toLocaleString("default", {
        month: "long",
      })} ${date.getFullYear()}`;

      if (item.pendingAmount <= 0) {
        monthWiseData.accountsWithPendingAmountByMonth[monthKey]++;
        dayWiseData.accountsWithPendingAmountByDay[dayKey]++;
      }
    });

    // Sort month-wise data
    const sortedMonthWiseData = {};
    Object.keys(monthWiseData)
      .sort((a, b) => new Date(a) - new Date(b))
      .forEach((key) => {
        sortedMonthWiseData[key] = monthWiseData[key];
      });

    // Sort day-wise data
    const sortedDayWiseData = {};
    Object.keys(dayWiseData)
      .sort((a, b) => new Date(a) - new Date(b))
      .forEach((key) => {
        sortedDayWiseData[key] = dayWiseData[key];
      });

    // Decide which data to return based on selected filter
    const responseData =
      selectedfilter === "day" ? sortedDayWiseData : sortedMonthWiseData;

    return res.json({
      status: 200,
      data: responseData,
      status: status,
      message: `${selectedfilter.charAt(0).toUpperCase() + selectedfilter.slice(1)
        }-wise data fetched successfully`,
    });
  } catch (error) {
    res.json({ status: 500, message: error.message });
    console.log(error);
  }
};

exports.chartData = async (req, res) => {
  try {
    let status = false

    let getRoleId = await roles.findById(req.user.role)

    if (getRoleId.roleName === 'Super Admin') {
      status = true
    }

    const selectedFilter = req.query.selectedfilter;
    if (!['day', 'month'].includes(selectedFilter)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid filter. Use 'day' or 'month'"
      });
    }

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const monthWiseData = initializeMonthData(currentYear);
    const dayWiseData = initializeDayData(currentYear, currentMonth, daysInMonth);

    const vendorPayments = await getVendorPayments();
    processVendorPayments(vendorPayments, monthWiseData, dayWiseData);

    const dealerPayments = await getDealerPayments();
    processDealerPayments(dealerPayments, monthWiseData, dayWiseData);

    const installerPayments = await getInstallerPayments();
    processInstallerPayments(installerPayments, monthWiseData, dayWiseData);

    const stockData = await getStockData();
    processStockData(stockData, monthWiseData, dayWiseData);

    const dispatchData = await getDispatchData();
    processDispatchData(dispatchData, monthWiseData, dayWiseData);

    const responseData = selectedFilter === 'day' ? dayWiseData : monthWiseData;

    return res.status(200).json({ status: 200, data: responseData, status: status, message: `${selectedFilter}-wise data fetched successfully`, });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500, message: error.message });
  }
};

function initializeMonthData(currentYear) {
  const data = {
    materialReceivedAmount: {},
    dealerAndInstellerAmount: {},
    stockValue: {},
    dispatchPendingAmount: {}
  };

  for (let i = 0; i < 12; i++) {
    const month = new Date(currentYear, i).toLocaleString("default", { month: "long" });
    const monthKey = `${month} ${currentYear}`;
    Object.keys(data).forEach(metric => {
      data[metric][monthKey] = 0;
    });
  }

  return data;
}

function initializeDayData(currentYear, currentMonth, daysInMonth) {
  const data = {
    materialReceivedAmount: {},
    dealerAndInstellerAmount: {},
    stockValue: {},
    dispatchPendingAmount: {}
  };

  const monthName = new Date(currentYear, currentMonth).toLocaleString("default", { month: "long" });
  for (let i = 1; i <= daysInMonth; i++) {
    const dayKey = `${i} ${monthName} ${currentYear}`;
    Object.keys(data).forEach(metric => {
      data[metric][dayKey] = 0;
    });
  }

  return data;
}

async function getVendorPayments() {
  const result = await store.aggregate([
    {
      $addFields: {
        totalQtySum: {
          $reduce: {
            input: "$multipleQty",
            initialValue: 0,
            in: {
              $add: [
                "$$value",
                {
                  $convert: {
                    input: { $ifNull: ["$$this.TotalQty", "0"] },
                    to: "double",
                    onError: 0
                  }
                }
              ]
            }
          }
        },
        receivedQtySum: {
          $reduce: {
            input: "$multipleQty",
            initialValue: 0,
            in: {
              $add: [
                "$$value",
                {
                  $convert: {
                    input: { $ifNull: ["$$this.recieveQtyforstore", "0"] },
                    to: "double",
                    onError: 0
                  }
                }
              ]
            }
          }
        }
      }
    },
    {
      $addFields: {
        materialReceivedPercentage: {
          $cond: [
            { $eq: ["$totalQtySum", 0] },
            0,
            {
              $multiply: [
                { $divide: ["$receivedQtySum", "$totalQtySum"] },
                100
              ]
            }
          ]
        }
      }
    },
    {
      $lookup: {
        from: "vendorpayments",
        localField: "purchase",
        foreignField: "VendorpurchaseId",
        as: "vendorPayment"
      }
    },
    {
      $addFields: {
        hasVendorPayment: { $gt: [{ $size: "$vendorPayment" }, 0] },
        vendorPaymentData: { $arrayElemAt: ["$vendorPayment", 0] },
        storeAmountTotal: {
          $convert: {
            input: { $ifNull: ["$amountTotal", "0"] },
            to: "double",
            onError: 0
          }
        }
      }
    },
    {
      $addFields: {
        pendingAmount: {
          $cond: {
            if: "$hasVendorPayment",
            then: {
              $convert: {
                input: {
                  $ifNull: ["$vendorPaymentData.VendorPendingAmount", "$amountTotal"]
                },
                to: "double",
                onError: {
                  $convert: {
                    input: { $ifNull: ["$amountTotal", "0"] },
                    to: "double",
                    onError: 0
                  }
                }
              }
            },
            else: "$storeAmountTotal"
          }
        }
      }
    },
    {
      $match: {
        $and: [
          { materialReceivedPercentage: { $gte: 99.99 } },
          { pendingAmount: { $gt: 0 } }
        ]
      }
    },
    {
      $group: {
        _id: {
          month: { $dateToString: { format: "%B %Y", date: "$createdAt" } },
          day: { $dateToString: { format: "%d %B %Y", date: "$createdAt" } }
        },
        totalPendingAmount: {
          $sum: {
            $ifNull: ["$pendingAmount", 0]
          }
        }
      }
    },
    {
      $sort: {
        "_id.month": 1,
        "_id.day": 1
      }
    }
  ]).exec();
  return result;
}

async function getDealerPayments() {
  const result = await DealerPayment.aggregate([
    {
      $lookup: {
        from: "dealers",
        localField: "userId",
        foreignField: "userId",
        as: "dealerInfo"
      }
    },
    {
      $unwind: {
        path: "$dealerInfo",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $unwind: {
        path: "$DealerPaymentDetails",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $addFields: {
        dealerCommission: {
          $convert: {
            input: "$dealerInfo.dealerCommission",
            to: "double",
            onError: 0
          }
        },
        paymentAmount: {
          $ifNull: ["$DealerPaymentDetails.DealerPaymentTotal", 0]
        }
      }
    },
    {
      $addFields: {
        commissionDifference: {
          $max: [
            {
              $subtract: ["$dealerCommission", "$paymentAmount"]
            },
            0
          ]
        }
      }
    },
    {
      $group: {
        _id: {
          month: { $dateToString: { format: "%B %Y", date: "$createdAt" } },
          day: { $dateToString: { format: "%d %B %Y", date: "$createdAt" } }
        },
        totalCommission: {
          $sum: "$commissionDifference"
        }
      }
    }
  ]).exec();
  return result;
}

async function getInstallerPayments() {
  const result = await assignInstaller.aggregate([
    {
      $lookup: {
        from: 'fabricators',
        localField: '_id',
        foreignField: 'assignId',
        as: 'fabricatorData'
      }
    },
    {
      $lookup: {
        from: 'electricians',
        localField: '_id',
        foreignField: 'assignId',
        as: 'electricianData'
      }
    },
    {
      $lookup: {
        from: 'technicians',
        localField: '_id',
        foreignField: 'assignId',
        as: 'technicianData'
      }
    },
    {
      $lookup: {
        from: 'installerpayments',
        localField: 'Fabricator',
        foreignField: 'userId',
        as: 'fabricatorPayments'
      }
    },
    {
      $lookup: {
        from: 'installerpayments',
        localField: 'Electrician',
        foreignField: 'userId',
        as: 'electricianPayments'
      }
    },
    {
      $lookup: {
        from: 'installerpayments',
        localField: 'Technician',
        foreignField: 'userId',
        as: 'technicianPayments'
      }
    },

    {
      $addFields: {
        fabricatorTotalAmount: {
          $sum: {
            $map: {
              input: "$fabricatorData",
              as: "fab",
              in: {
                $convert: {
                  input: "$$fab.TotalAmount",
                  to: "double",
                  onError: 0
                }
              }
            }
          }
        },
        electricianTotalAmount: {
          $sum: {
            $map: {
              input: "$electricianData",
              as: "elec",
              in: {
                $convert: {
                  input: "$$elec.TotalAmount",
                  to: "double",
                  onError: 0
                }
              }
            }
          }
        },
        technicianTotalAmount: {
          $sum: {
            $map: {
              input: "$technicianData",
              as: "tech",
              in: {
                $convert: {
                  input: "$$tech.Amount",
                  to: "double",
                  onError: 0
                }
              }
            }
          }
        },

        fabricatorPaidAmount: {
          $sum: {
            $reduce: {
              input: "$fabricatorPayments",
              initialValue: 0,
              in: {
                $add: [
                  "$$value",
                  {
                    $sum: {
                      $map: {
                        input: "$$this.fileDetails",
                        as: "file",
                        in: {
                          $convert: {
                            input: "$$file.PaymentTotal",
                            to: "double",
                            onError: 0
                          }
                        }
                      }
                    }
                  }
                ]
              }
            }
          }
        },
        electricianPaidAmount: {
          $sum: {
            $reduce: {
              input: "$electricianPayments",
              initialValue: 0,
              in: {
                $add: [
                  "$$value",
                  {
                    $sum: {
                      $map: {
                        input: "$$this.fileDetails",
                        as: "file",
                        in: {
                          $convert: {
                            input: "$$file.PaymentTotal",
                            to: "double",
                            onError: 0
                          }
                        }
                      }
                    }
                  }
                ]
              }
            }
          }
        },
        technicianPaidAmount: {
          $sum: {
            $reduce: {
              input: "$technicianPayments",
              initialValue: 0,
              in: {
                $add: [
                  "$$value",
                  {
                    $sum: {
                      $map: {
                        input: "$$this.fileDetails",
                        as: "file",
                        in: {
                          $convert: {
                            input: "$$file.PaymentTotal",
                            to: "double",
                            onError: 0
                          }
                        }
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    },
    {
      $addFields: {
        fabricatorPendingAmount: {
          $subtract: ["$fabricatorTotalAmount", "$fabricatorPaidAmount"]
        },
        electricianPendingAmount: {
          $subtract: ["$electricianTotalAmount", "$electricianPaidAmount"]
        },
        technicianPendingAmount: {
          $subtract: ["$technicianTotalAmount", "$technicianPaidAmount"]
        }
      }
    },
    {
      $group: {
        _id: {
          month: { $dateToString: { format: "%B %Y", date: "$createdAt" } },
          day: { $dateToString: { format: "%d %B %Y", date: "$createdAt" } }
        },
        totalAmount: {
          $sum: {
            $add: [
              { $max: ["$fabricatorPendingAmount", 0] },
              { $max: ["$electricianPendingAmount", 0] },
              { $max: ["$technicianPendingAmount", 0] }
            ]
          }
        }
      }
    },
    {
      $sort: {
        "_id.month": 1,
        "_id.day": 1
      }
    }
  ]).exec();

  return result;
}

async function getStockData() {
  const result = await store.aggregate([
    {
      $lookup: {
        from: "warehouses",
        localField: "warehouseId",
        foreignField: "_id",
        as: "warehouseData"
      }
    },
    { $unwind: "$warehouseData" },
    { $unwind: "$multipleQty" },
    {
      $lookup: {
        from: "storetransfers",
        let: { productId: "$multipleQty.productName", warehouseId: "$warehouseData._id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$productId", "$$productId"] },
                  {
                    $or: [
                      { $eq: ["$debitWarehouse", "$$warehouseId"] },
                      { $eq: ["$creditWarehouse", "$$warehouseId"] }
                    ]
                  }
                ]
              }
            }
          }
        ],
        as: "storeTransfers"
      }
    },
    {
      $addFields: {
        transferQty: {
          $reduce: {
            input: "$storeTransfers",
            initialValue: 0,
            in: {
              $cond: [
                { $eq: ["$$this.debitWarehouse", "$warehouseData._id"] },
                { $subtract: ["$$value", { $toDouble: "$$this.qty" }] },
                { $add: ["$$value", { $toDouble: "$$this.qty" }] }
              ]
            }
          }
        }
      }
    },
    {
      $group: {
        _id: {
          productName: "$multipleQty.productName",
          storeId: "$_id",
          warehouseId: "$warehouseData._id",
          month: { $dateToString: { format: "%B %Y", date: "$createdAt" } },
          day: { $dateToString: { format: "%d %B %Y", date: "$createdAt" } }
        },
        lastUnitPrice: { $last: "$multipleQty.unitPrice" },
        lastRecieveUnitPrice: { $last: "$multipleQty.recieveunitPrice" },
        totalRecieveQty: {
          $sum: {
            $add: [
              { $toDouble: "$multipleQty.recieveQty" },
              "$transferQty"
            ]
          }
        },
        minUnitPrice: { $min: { $toDouble: "$multipleQty.recieveunitPrice" } },
        maxUnitPrice: { $max: { $toDouble: "$multipleQty.recieveunitPrice" } },
        totalUnitPrice: {
          $sum: {
            $multiply: [
              { $toDouble: { $ifNull: ["$multipleQty.recieveQty", 0] } },
              { $toDouble: { $ifNull: ["$multipleQty.recieveunitPrice", 0] } }
            ]
          }
        },
        totalGSTAmount: {
          $sum: {
            $multiply: [
              { $toDouble: { $ifNull: ["$multipleQty.recieveQty", 0] } },
              { $toDouble: { $ifNull: ["$multipleQty.recieveunitPrice", 0] } },
              { $divide: [{ $toDouble: { $ifNull: ["$multipleQty.GSTAmount", 0] } }, 100] }
            ]
          }
        },
        storeData: { $last: "$$ROOT" }
      }
    },
    {
      $group: {
        _id: {
          month: "$_id.month",
          day: "$_id.day"
        },
        totalAmount: {
          $sum: "$totalUnitPrice"
        }
      }
    }
  ])
  return result;
}

async function getDispatchData() {
  const result = await DispatchProcess.aggregate([
    {
      $match: {
        PendingPayment: {
          $exists: true,
          $ne: null,
          $ne: ""
        }
      }
    },
    {
      $addFields: {
        numericAmount: {
          $convert: {
            input: "$PendingPayment",
            to: "double",
            onError: 0
          }
        }
      }
    },
    {
      $group: {
        _id: {
          month: { $dateToString: { format: "%B %Y", date: "$createdAt" } },
          day: { $dateToString: { format: "%d %B %Y", date: "$createdAt" } }
        },
        totalPending: { $sum: "$numericAmount" }
      }
    }
  ]).exec();
  return result;
}

function processVendorPayments(payments, monthWiseData, dayWiseData) {
  Object.keys(monthWiseData.materialReceivedAmount).forEach(month => {
    monthWiseData.materialReceivedAmount[month] = 0;
  });

  Object.keys(dayWiseData.materialReceivedAmount).forEach(day => {
    dayWiseData.materialReceivedAmount[day] = 0;
  });

  payments.forEach(payment => {
    if (payment._id?.month) {
      monthWiseData.materialReceivedAmount[payment._id.month] =
        (monthWiseData.materialReceivedAmount[payment._id.month] || 0) + payment.totalPendingAmount;
    }
    if (payment._id?.day) {
      dayWiseData.materialReceivedAmount[payment._id.day] =
        (dayWiseData.materialReceivedAmount[payment._id.day] || 0) + payment.totalPendingAmount;
    }
  });
}

function processDealerPayments(payments, monthWiseData, dayWiseData) {
  payments.forEach(payment => {
    if (payment._id?.month) {
      monthWiseData.dealerAndInstellerAmount[payment._id.month] =
        (monthWiseData.dealerAndInstellerAmount[payment._id.month] || 0) + payment.totalCommission;
    }
    if (payment._id?.day) {
      dayWiseData.dealerAndInstellerAmount[payment._id.day] =
        (dayWiseData.dealerAndInstellerAmount[payment._id.day] || 0) + payment.totalCommission;
    }
  });
}

function processInstallerPayments(payments, monthWiseData, dayWiseData) {
  payments.forEach(payment => {
    if (payment._id?.month) {
      monthWiseData.dealerAndInstellerAmount[payment._id.month] =
        (monthWiseData.dealerAndInstellerAmount[payment._id.month] || 0) + payment.totalAmount;
    }
    if (payment._id?.day) {
      dayWiseData.dealerAndInstellerAmount[payment._id.day] =
        (dayWiseData.dealerAndInstellerAmount[payment._id.day] || 0) + payment.totalAmount;
    }
  });
}

function processStockData(stockData, monthWiseData, dayWiseData) {
  stockData.forEach(stock => {
    if (stock._id?.month) {
      monthWiseData.stockValue[stock._id.month] =
        (monthWiseData.stockValue[stock._id.month] || 0) + stock.totalAmount;
    }
    if (stock._id?.day) {
      dayWiseData.stockValue[stock._id.day] =
        (dayWiseData.stockValue[stock._id.day] || 0) + stock.totalAmount;
    }
  });
}

function processDispatchData(dispatchData, monthWiseData, dayWiseData) {
  dispatchData.forEach(dispatch => {
    if (dispatch._id?.month) {
      monthWiseData.dispatchPendingAmount[dispatch._id.month] =
        (monthWiseData.dispatchPendingAmount[dispatch._id.month] || 0) + dispatch.totalPending;
    }
    if (dispatch._id?.day) {
      dayWiseData.dispatchPendingAmount[dispatch._id.day] =
        (dayWiseData.dispatchPendingAmount[dispatch._id.day] || 0) + dispatch.totalPending;
    }
  });
}

exports.getMarketBarChartData = async (req, res) => {
  try {
    const { selectedfilter, m, y } = req.query;

    let status = false

    let getRoleId = await roles.findById(req.user.role)
    console.log(getRoleId);

    if (getRoleId.permissions.includes('Marketing')) {
      status = true
    }

    let matchStage = {};
    if (selectedfilter === "month") {
      matchStage = {
        createdAt: {
          $gte: new Date(y, m, 1),
          $lt: new Date(y, parseInt(m) + 1, 1),
        },
      };
    } else if (selectedfilter === "year") {
      matchStage = {
        createdAt: {
          $gte: new Date(y, 0, 1),
          $lt: new Date(parseInt(y) + 1, 0, 1),
        },
      };
    } else if (selectedfilter !== "total") {
      return res.status(400).json({
        success: false,
        message: 'Invalid selectedfilter. Use "month", "year", or "total".',
      });
    }

    const aggregatedData = await market.aggregate([
      {
        $match: matchStage
      },
      {
        $lookup: {
          from: "commercialmarketings",
          let: { userId: "$userId" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$userId", "$$userId"] }
              }
            },
            {
              $project: {
                fillNo: 1,
                _id: 0
              }
            }
          ],
          as: "marketingFiles"
        }
      },
      {
        $group: {
          _id: "$userId",
          totalSystemSizeKw: {
            $sum: {
              $toDouble: "$SystemSizeKw"
            }
          },
          fileNumbers: {
            $addToSet: "$fillNo"
          },
          marketingFileNumbers: {
            $addToSet: "$marketingFiles.fillNo"
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          totalSystemSizeKw: 1,
          userName: {
            $arrayElemAt: ["$userDetails.name", 0]
          },
          allFileNumbers: {
            $setUnion: [
              "$fileNumbers",
              {
                $reduce: {
                  input: "$marketingFileNumbers",
                  initialValue: [],
                  in: { $concatArrays: ["$$value", "$$this"] }
                }
              }
            ]
          }
        }
      },
      {
        $sort: {
          totalSystemSizeKw: -1
        }
      }
    ]);

    return res.status(200).json({
      success: true,
      status: status,
      data: aggregatedData.map(item => ({
        ...item
      }))
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.marketingAndLiasoningLinechart = async (req, res) => {
  try {
    const { selectedfilter, m, y } = req.query;

    // Initialize data structure for the response
    const aggregatedData = {
      customerCount: 0,
      applicationSubmittedCount: 0,
      paymentReceivedCount: 0,
      fqPaidCount: 0,
      materialDispatchCount: 0,
      siteDetailsCount: 0,
      netMeterCount: 0,
      subsidyClaimedCount: 0,
      dealerCommissionPaidCount: 0,
      installerPaymentCount: 0,
      lostCustomerCount: 0
    };

    let status = false;

    let getRoleId = await roles.findById(req.user.role);

    const requiredPermissions = ['Marketing', 'Liasoning'];

    if (getRoleId.permissions.some(permission => requiredPermissions.includes(permission))) {
      status = true;
    }

    let matchStage;
    if (selectedfilter === "month") {
      matchStage = {
        createdAt: {
          $gte: new Date(y, m, 1),
          $lt: new Date(y, parseInt(m) + 1, 1),
        },
      };
    } else if (selectedfilter === "year") {
      matchStage = {
        createdAt: {
          $gte: new Date(y, 0, 1),
          $lt: new Date(parseInt(y) + 1, 0, 1),
        },
      };
    } else if (selectedfilter === "total") {
      matchStage = {}; // No date filtering, fetch all records
    } else {
      return res.status(400).json({
        status: 400,
        message: 'Invalid selectedfilter. Use "month", "year", or "total".',
      });
    }

    // Fetch and aggregate data with matchStage
    const comdata = await market.find(matchStage);
    const liasoningData = await liasoning.find(matchStage);
    const dispatchData = await dispatch.find(matchStage);
    const accountData = await account.find(matchStage);
    const dealerData = await dealer.find(matchStage);
    const installerData = await installerPayment.find(matchStage);

    // Aggregate customer count
    aggregatedData.customerCount = comdata.length;

    // Aggregate application submitted count
    liasoningData.forEach(item => {
      if (item.applicationStatus === "APPLICATION SUBMITTED") {
        aggregatedData.applicationSubmittedCount++;
      }
      if (item.applicationStatus === "FQ PAID") {
        aggregatedData.fqPaidCount++;
      }
      if (item.applicationStatus === "SITE DETAILS") {
        aggregatedData.siteDetailsCount++;
      }
      if (item.applicationStatus === "NET METER INSTALL") {
        aggregatedData.netMeterCount++;
      }
      if (item.applicationStatus === "SUBSIDY RECEIVED STATUS") {
        aggregatedData.subsidyClaimedCount++;
      }
    });

    // Aggregate payment received count
    accountData.forEach(item => {
      if (item.PendingPayment === "0") {
        aggregatedData.paymentReceivedCount++;
      }
    });

    // Aggregate material dispatch count
    aggregatedData.materialDispatchCount = dispatchData.length;

    // Aggregate dealer commission count
    dealerData.forEach(item => {
      if (item.dealerCommission) {
        aggregatedData.dealerCommissionPaidCount++;
      }
    });

    // Aggregate installer payment count
    installerData.forEach(item => {
      let totalPending = 0;
      for (let detail of item.fileDetails) {
        totalPending += (detail.totalCommission || 0) - (detail.PaymentTotal || 0);
      }
      if (totalPending === 0) {
        aggregatedData.installerPaymentCount++;
      }
    });

    // Aggregate lost customer count
    liasoningData.forEach(item => {
      if (item.status === "Enabled") {
        aggregatedData.lostCustomerCount++;
      }
    });

    return res.json({
      status: 200,
      message: "Data fetched successfully",
      data: aggregatedData,
      status: status
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 500, message: error.message });
  }
};

exports.systemSizeLineChart = async (req, res) => {
  try {
    const { selectedfilter, m, y } = req.query;

    // Initialize data structure for the response
    const aggregatedData = {
      totalSystemSize: 0,
      userWiseData: [],
    };

    let status = false;

    let getRoleId = await roles.findById(req.user.role);

    if (getRoleId.permissions.includes("Dealer")) {
      status = true;
    }

    let matchStage = {};

    // Apply date filter based on selectedfilter
    if (selectedfilter === "month") {
      matchStage = {
        createdAt: {
          $gte: new Date(y, m, 1),
          $lt: new Date(y, parseInt(m) + 1, 1),
        },
      };
    } else if (selectedfilter === "year") {
      matchStage = {
        createdAt: {
          $gte: new Date(y, 0, 1),
          $lt: new Date(parseInt(y) + 1, 0, 1),
        },
      };
    } else if (selectedfilter === "total") {
      matchStage = {}; // No date filtering, fetch all records
    } else {
      return res.status(400).json({
        status: 400,
        message: 'Invalid selectedfilter. Use "month", "year", or "total".',
      });
    }

    // Restrict data for non-super admin users
    if (getRoleId.roleName !== "Super Admin") {
      matchStage.userId = req.user.id; // Ensure only the logged-in user's data is fetched
    }

    // Aggregate dealer data
    const dealerData = await dealer.aggregate([
      {
        $match: matchStage,
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $unwind: "$userInfo",
      },
      {
        $addFields: {
          systemSizeNumber: {
            $convert: {
              input: "$SystemSize",
              to: "double",
              onError: 0,
            },
          },
        },
      },
      {
        $group: {
          _id: {
            userId: "$userId",
            userName: "$userInfo.name",
          },
          totalSystemSize: { $sum: "$systemSizeNumber" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { totalSystemSize: 1 }, // Sort in descending order
      },
    ]);

    // Aggregate data for response
    dealerData.forEach((item) => {
      aggregatedData.totalSystemSize += item.totalSystemSize;
      aggregatedData.userWiseData.push({
        userId: item._id.userId,
        userName: item._id.userName,
        systemSize: Number(item.totalSystemSize.toFixed(2)),
      });
    });

    aggregatedData.totalSystemSize = Number(
      aggregatedData.totalSystemSize.toFixed(2)
    );

    return res.json({
      status: 200,
      message: "Dealer data fetched successfully",
      data: aggregatedData,
      status: status,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 500, message: error.message });
  }
};

exports.electricianMonthlyReport = async (req, res) => {
  try {
    let selectedfilter = req.query.selectedfilter;
    let status = false
    const userId = req.user.id;

    let getRoleId = await roles.findById(req.user.role);

    const isAdmin = getRoleId.roleName === 'Super Admin';

    if (getRoleId.roleName === 'Electrician' || isAdmin) {
      status = true
    }

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Initialize data structures for both month and day
    const monthlyData = {
      workCount: {},
      paymentSum: {}
    };

    const dailyData = {
      workCount: {},
      paymentSum: {}
    };

    // Initialize month-wise data structures with zeros
    const months = [];
    for (let i = 0; i < 12; i++) {
      const month = new Date(currentYear, i).toLocaleString("default", {
        month: "long",
      });
      const monthKey = `${month} ${currentYear}`;
      months.push(monthKey);
      monthlyData.workCount[monthKey] = 0;
      monthlyData.paymentSum[monthKey] = 0;
    }

    // Initialize day-wise data structures with zeros for the current month
    for (let i = 1; i <= daysInMonth; i++) {
      const dayKey = `${i} ${new Date(currentYear, currentMonth).toLocaleString(
        "default",
        { month: "long" }
      )} ${currentYear}`;
      dailyData.workCount[dayKey] = 0;
      dailyData.paymentSum[dayKey] = 0;
    }

    // Modified aggregation pipeline
    const electricianData = await electrician.aggregate([
      {
        $match: {
          "electricianDetails.electricianSubCatogory": { $exists: true, $ne: null }
        }
      },
      {
        $lookup: {
          from: "assigninstallers",
          localField: "assignId",
          foreignField: "_id",
          as: "assignData"
        }
      },
      {
        $unwind: "$assignData"
      },
      {
        $match: {
          ...(isAdmin ? {} : { "assignData.Electrician": userId })
        }
      },
      {
        $addFields: {
          totalAmountNumber: {
            $convert: {
              input: "$TotalAmount",
              to: "double",
              onError: 0, // Default to 0 if conversion fails
              onNull: 0   // Default to 0 if field is null
            }
          }
        }
      },
      {
        $group: {
          _id: {
            month: { $dateToString: { format: "%B %Y", date: "$createdAt" } },
            day: { $dateToString: { format: "%d %B %Y", date: "$createdAt" } }
          },
          uniqueCount: { $sum: 1 },
          totalAmount: { $sum: "$totalAmountNumber" }
        }
      },
      {
        $sort: {
          "_id.month": 1,
          "_id.day": 1
        }
      }
    ]);

    electricianData.forEach((item) => {
      const monthKey = item._id.month;
      const dayKey = item._id.day;

      if (selectedfilter === "day") {
        if (dailyData.workCount.hasOwnProperty(dayKey)) {
          dailyData.workCount[dayKey] = item.uniqueCount || 0; // Ensure default value
          dailyData.paymentSum[dayKey] = Number(item.totalAmount?.toFixed(2)) || 0; // Safeguard against NaN
        }
      } else { // month is the default
        if (monthlyData.workCount.hasOwnProperty(monthKey)) {
          monthlyData.workCount[monthKey] = (monthlyData.workCount[monthKey] || 0) + (item.uniqueCount || 0);
          monthlyData.paymentSum[monthKey] = Number(
            ((monthlyData.paymentSum[monthKey] || 0) + (item.totalAmount || 0)).toFixed(2)
          );
        }
      }
    });

    const responseData = selectedfilter === "day" ? dailyData : monthlyData;

    return res.json({
      status: 200,
      message: `${selectedfilter.charAt(0).toUpperCase() + selectedfilter.slice(1)}-wise data fetched successfully`,
      data: responseData,
      status: status
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500, message: error.message });
  }
};

exports.fabricatorMonthlyReport = async (req, res) => {
  try {
    let selectedfilter = req.query.selectedfilter;
    let status = false
    const userId = req.user.id;

    let getRoleId = await roles.findById(req.user.role);

    const isAdmin = getRoleId.roleName === 'Super Admin';

    if (getRoleId.roleName === 'Electrician' || isAdmin) {
      status = true
    }

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Initialize data structures for both month and day
    const monthlyData = {
      workCount: {},
      paymentSum: {}
    };

    const dailyData = {
      workCount: {},
      paymentSum: {}
    };

    // Initialize month-wise data structures with zeros
    const months = [];
    for (let i = 0; i < 12; i++) {
      const month = new Date(currentYear, i).toLocaleString("default", {
        month: "long",
      });
      const monthKey = `${month} ${currentYear}`;
      months.push(monthKey);
      monthlyData.workCount[monthKey] = 0;
      monthlyData.paymentSum[monthKey] = 0;
    }

    // Initialize day-wise data structures with zeros for the current month
    for (let i = 1; i <= daysInMonth; i++) {
      const dayKey = `${i} ${new Date(currentYear, currentMonth).toLocaleString(
        "default",
        { month: "long" }
      )} ${currentYear}`;
      dailyData.workCount[dayKey] = 0;
      dailyData.paymentSum[dayKey] = 0;
    }

    const fabricatorData = await fabricator.aggregate([
      {
        $match: {
          "fabricatorDetails.fabricatorSubCatogory": { $exists: true, $ne: null }
        }
      },
      {
        $lookup: {
          from: "assigninstallers",
          localField: "assignId",
          foreignField: "_id",
          as: "assignData"
        }
      },
      {
        $unwind: "$assignData"
      },
      {
        $match: {
          ...(isAdmin ? {} : { "assignData.Fabricator": userId })
        }
      },
      {
        $addFields: {
          totalAmountNumber: {
            $convert: {
              input: "$TotalAmount",
              to: "double",
              onError: 0, // Default to 0 if conversion fails
              onNull: 0   // Default to 0 if field is null
            }
          }
        }
      },
      {
        $group: {
          _id: {
            month: { $dateToString: { format: "%B %Y", date: "$createdAt" } },
            day: { $dateToString: { format: "%d %B %Y", date: "$createdAt" } }
          },
          uniqueCount: { $sum: 1 },
          totalAmount: { $sum: "$totalAmountNumber" }
        }
      },
      {
        $sort: {
          "_id.month": 1,
          "_id.day": 1
        }
      }
    ]);

    fabricatorData.forEach((item) => {
      const monthKey = item._id.month;
      const dayKey = item._id.day;

      if (selectedfilter === "day") {
        if (dailyData.workCount.hasOwnProperty(dayKey)) {
          dailyData.workCount[dayKey] = item.uniqueCount || 0;
          dailyData.paymentSum[dayKey] = Number(item.totalAmount?.toFixed(2)) || 0;
        }
      } else { // month is the default
        if (monthlyData.workCount.hasOwnProperty(monthKey)) {
          monthlyData.workCount[monthKey] = (monthlyData.workCount[monthKey] || 0) + (item.uniqueCount || 0);
          monthlyData.paymentSum[monthKey] = Number(
            ((monthlyData.paymentSum[monthKey] || 0) + (item.totalAmount || 0)).toFixed(2)
          );
        }
      }
    });

    const responseData = selectedfilter === "day" ? dailyData : monthlyData;

    return res.json({
      status: 200,
      message: `${selectedfilter.charAt(0).toUpperCase() + selectedfilter.slice(1)}-wise data fetched successfully`,
      data: responseData,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500, message: error.message });
  }
}

exports.technicianMonthlyReport = async (req, res) => {
  try {
    let selectedfilter = req.query.selectedfilter;

    let status = false
    const userId = req.user.id;

    let getRoleId = await roles.findById(req.user.role);

    const isAdmin = getRoleId.roleName === 'Super Admin';

    if (getRoleId.roleName === 'Electrician' || isAdmin) {
      status = true
    }
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Initialize data structures for both month and day
    const monthlyData = {
      workCount: {},
      paymentSum: {}
    };

    const dailyData = {
      workCount: {},
      paymentSum: {}
    };

    // Initialize month-wise data structures with zeros
    const months = [];
    for (let i = 0; i < 12; i++) {
      const month = new Date(currentYear, i).toLocaleString("default", {
        month: "long",
      });
      const monthKey = `${month} ${currentYear}`;
      months.push(monthKey);
      monthlyData.workCount[monthKey] = 0;
      monthlyData.paymentSum[monthKey] = 0;
    }

    // Initialize day-wise data structures with zeros for the current month
    for (let i = 1; i <= daysInMonth; i++) {
      const dayKey = `${i} ${new Date(currentYear, currentMonth).toLocaleString(
        "default",
        { month: "long" }
      )} ${currentYear}`;
      dailyData.workCount[dayKey] = 0;
      dailyData.paymentSum[dayKey] = 0;
    }

    const technicianData = await technician.aggregate([
      {
        $match: {
          Amount: { $exists: true, $ne: null }
        }
      },
      {
        $lookup: {
          from: "assigninstallers",
          localField: "assignId",
          foreignField: "_id",
          as: "assignData"
        }
      },
      {
        $unwind: "$assignData"
      },
      {
        $match: {
          ...(isAdmin ? {} : { "assignData.Technician": userId })
        }
      },
      {
        $addFields: {
          amountNumber: {
            $convert: {
              input: "$Amount",
              to: "double",
              onError: 0,
              onNull: 0
            }
          }
        }
      },
      {
        $group: {
          _id: {
            month: { $dateToString: { format: "%B %Y", date: "$createdAt" } },
            day: { $dateToString: { format: "%d %B %Y", date: "$createdAt" } }
          },
          uniqueCount: { $sum: 1 },
          totalAmount: { $sum: "$amountNumber" }
        }
      },
      {
        $sort: {
          "_id.month": 1,
          "_id.day": 1
        }
      }
    ]);

    technicianData.forEach((item) => {
      const monthKey = item._id.month;
      const dayKey = item._id.day;

      if (selectedfilter === "day") {
        if (dailyData.workCount.hasOwnProperty(dayKey)) {
          dailyData.workCount[dayKey] = item.uniqueCount || 0;
          dailyData.paymentSum[dayKey] = Number(item.totalAmount?.toFixed(2)) || 0;
        }
      } else {
        if (monthlyData.workCount.hasOwnProperty(monthKey)) {
          monthlyData.workCount[monthKey] = (monthlyData.workCount[monthKey] || 0) + (item.uniqueCount || 0);
          monthlyData.paymentSum[monthKey] = Number(
            ((monthlyData.paymentSum[monthKey] || 0) + (item.totalAmount || 0)).toFixed(2)
          );
        }
      }
    });

    const responseData = selectedfilter === "day" ? dailyData : monthlyData;

    return res.json({
      status: 200,
      message: `${selectedfilter.charAt(0).toUpperCase() + selectedfilter.slice(1)}-wise data fetched successfully`, data: responseData,
      status
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500, message: error.message });
  }
};
