const express = require("express");
const router = new express.Router();
const {
  BrandRegistrationModel,
  ServiceModel,
  TechnicianModal,
  EmployeeModel,
  DealerModel,
  UserModel
} = require('../models/registration');
const Orders = require("../models/order");
const SpareParts = require("../models/sparePart");
const ProductModel = require("../models/product");
const Complaints = require("../models/complaint");
const ComplaintModal = require("../models/complaint");

router.get("/dashboardDetails", async (req, res) => {
  try {
    const { now, oneDayAgo, fiveDaysAgo } = calculateDateRanges();

    const [
      customerCount,
      orderCount,
      serviceCount,
      technicianCount,
      dealerCount,
      sparePartCount,
      brandCount,
      allComplaintCount,
      complaintProdressCount,
      complaintAssignCount,
      complaintPendingCount,
      complaintCompleteCount,
      complaintCancelCount,
      complaintPartPendingCount,
      complaints0To1Days,
      complaints2To5Days,
      complaintsMoreThan5Days
    ] = await Promise.all([
      UserModel.countDocuments({}),
      Orders.countDocuments({}),
      ServiceModel.countDocuments({}),
      TechnicianModal.countDocuments({}),
      DealerModel.countDocuments({}),
      SpareParts.countDocuments({}),
      BrandRegistrationModel.countDocuments({}),
      Complaints.countDocuments({}),
      Complaints.countDocuments({ status: 'IN PROGRESS' }),
      Complaints.countDocuments({ status: 'ASSIGN' }),
      Complaints.countDocuments({ status: 'PENDING' }),
      Complaints.countDocuments({ status: 'COMPLETED' }),
      Complaints.countDocuments({ status: 'CANCELED' }),
      Complaints.countDocuments({ status: 'PART PENDING' }),
      Complaints.countDocuments({  createdAt: { $gte: oneDayAgo } }),
      Complaints.countDocuments({   createdAt: { $gte: fiveDaysAgo, $lt: oneDayAgo } }),
      Complaints.countDocuments({   createdAt: { $lt: fiveDaysAgo } })
    ]);

    res.json({
      customers: customerCount,
      orders: orderCount,
      services: serviceCount,
      technicians: technicianCount,
      dealers: dealerCount,
      spareParts: sparePartCount,
      brands: brandCount,
      complaints: {
        allComplaints: allComplaintCount,
        inProgress: complaintProdressCount,
        assign: complaintAssignCount,
        pending: complaintPendingCount,
        complete: complaintCompleteCount,
        cancel: complaintCancelCount,
        partPending: complaintPartPendingCount,
        zeroToOneDays: complaints0To1Days,
        twoToFiveDays: complaints2To5Days,
        moreThanFiveDays: complaintsMoreThan5Days
      }
    });
  } catch (err) {
    res.status(500).send(err);
  }
});


router.get('/getUserAndProduct', async (req, res) => {
  try {
    const [
      customers,
      services,
      technicians,
      dealers,
      brands,
      product
    ] = await Promise.all([
      UserModel.find({}),
      ServiceModel.find({}),
      TechnicianModal.find({}),
      DealerModel.find({}),
      BrandRegistrationModel.find({}),
      ProductModel.find({})
    ]);

    res.json({
      customers: customers,
      services: services,
      technicians: technicians,
      dealers: dealers,
      brands: brands,
      product: product,
    });
  } catch (err) {
    console.error('Error fetching dashboard details:', err);
    res.status(500).send(err);
  }
});

// router.get("/dashboardDetailsBySeviceCenterId/:id", async (req, res) => {
//   try {
//     const id = req.params.id;
//     const query = {assignServiceCenterId:id};
//     const [
//       allComplaintCount,
//       complaintNewCount,
//       complaintAssignCount,
//       complaintPendingCount,
//       complaintCompleteCount,
//       complaintCancelCount,
//       complaintPartPendingCount
//     ] = await Promise.all([
//       Complaints.countDocuments(query),
//       Complaints.countDocuments({ ...query, status: 'NEW' }),
//       Complaints.countDocuments({ ...query, status: 'ASSIGN' }),
//       Complaints.countDocuments({ ...query, status: 'PENDING' }),
//       Complaints.countDocuments({ ...query, status: 'COMPLETED' }),
//       Complaints.countDocuments({ ...query, status: 'CANCELED' }),
//       Complaints.countDocuments({ ...query, status: 'PART PENDING' })
//     ]);

//     res.json({
//       complaints: {
//         allComplaints: allComplaintCount,
//         new: complaintNewCount,
//         assign: complaintAssignCount,
//         pending: complaintPendingCount,
//         complete: complaintCompleteCount,
//         cancel: complaintCancelCount,
//         partPending: complaintPartPendingCount
//       }
//     });
//   } catch (err) {
//     console.error('Error in /dashboardDetailsById/:id:', err);
//     res.status(500).send(err);
//   }
// });


// router.get("/dashboardDetailsBySeviceCenterId/:id", async (req, res) => {
//   try {
//     const id = req.params.id;

//     // Get the current date and calculate the start dates for the current month, week, and day
//     const now = new Date();
//     const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
//     const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
//     const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

//     // Query to filter complaints by assignServiceCenterId
//     const query = { assignServiceCenterId: id };

//     // Fetch counts for all complaints and complaints with specific statuses
//     const [
//       allComplaintCount,
//       complaintNewCount,
//       complaintAssignCount,
//       complaintPendingCount,
//       complaintCompleteCount,
//       complaintCancelCount,
//       complaintPartPendingCount,
//       monthlyNewCount,
//       monthlyAssignCount,
//       monthlyPendingCount,
//       monthlyCompleteCount,
//       monthlyCancelCount,
//       weeklyNewCount,
//       weeklyAssignCount,
//       weeklyPendingCount,
//       weeklyCompleteCount,
//       weeklyCancelCount,
//       dailyNewCount,
//       dailyAssignCount,
//       dailyPendingCount,
//       dailyCompleteCount,
//       dailyCancelCount
//     ] = await Promise.all([
//       // Total counts
//       Complaints.countDocuments(query),
//       Complaints.countDocuments({ ...query, status: 'NEW' }),
//       Complaints.countDocuments({ ...query, status: 'ASSIGN' }),
//       Complaints.countDocuments({ ...query, status: 'PENDING' }),
//       Complaints.countDocuments({ ...query, status: 'COMPLETED' }),
//       Complaints.countDocuments({ ...query, status: 'CANCELED' }),
//       Complaints.countDocuments({ ...query, status: 'PART PENDING' }),

//       // Monthly counts
//       Complaints.countDocuments({ ...query, status: 'NEW', createdAt: startOfMonth }),
//       Complaints.countDocuments({ ...query, status: 'ASSIGN', createdAt: { $gte: startOfMonth } }),
//       Complaints.countDocuments({ ...query, status: 'PENDING', createdAt: { $gte: startOfMonth } }),
//       Complaints.countDocuments({ ...query, status: 'COMPLETED', createdAt: { $gte: startOfMonth } }),
//       Complaints.countDocuments({ ...query, status: 'CANCELED', createdAt: { $gte: startOfMonth } }),

//       // Weekly counts
//       Complaints.countDocuments({ ...query, status: 'NEW', createdAt: { $gte: startOfWeek } }),
//       Complaints.countDocuments({ ...query, status: 'ASSIGN', createdAt: { $gte: startOfWeek } }),
//       Complaints.countDocuments({ ...query, status: 'PENDING', createdAt: { $gte: startOfWeek } }),
//       Complaints.countDocuments({ ...query, status: 'COMPLETED', createdAt: { $gte: startOfWeek } }),
//       Complaints.countDocuments({ ...query, status: 'CANCELED', createdAt: { $gte: startOfWeek } }),

//       // Daily counts
//       Complaints.countDocuments({ ...query, status: 'NEW', createdAt: { $gte: startOfDay } }),
//       Complaints.countDocuments({ ...query, status: 'ASSIGN', createdAt: { $gte: startOfDay } }),
//       Complaints.countDocuments({ ...query, status: 'PENDING', createdAt: { $gte: startOfDay } }),
//       Complaints.countDocuments({ ...query, status: 'COMPLETED', createdAt: { $gte: startOfDay } }),
//       Complaints.countDocuments({ ...query, status: 'CANCELED', createdAt: { $gte: startOfDay } })
//     ]);

//     // Return aggregated data as JSON response
//     res.json({
//       complaints: {
//         allComplaints: allComplaintCount,
//         new: complaintNewCount,
//         assign: complaintAssignCount,
//         pending: complaintPendingCount,
//         complete: complaintCompleteCount,
//         cancel: complaintCancelCount,
//         partPending: complaintPartPendingCount,
//         monthly: {
//           new: monthlyNewCount,
//           assign: monthlyAssignCount,
//           pending: monthlyPendingCount,
//           complete: monthlyCompleteCount,
//           cancel: monthlyCancelCount
//         },
//         weekly: {
//           new: weeklyNewCount,
//           assign: weeklyAssignCount,
//           pending: weeklyPendingCount,
//           complete: weeklyCompleteCount,
//           cancel: weeklyCancelCount
//         },
//         daily: {
//           new: dailyNewCount,
//           assign: dailyAssignCount,
//           pending: dailyPendingCount,
//           complete: dailyCompleteCount,
//           cancel: dailyCancelCount
//         }
//       }
//     });

//   } catch (err) {
//     console.error('Error in /dashboardDetailsBySeviceCenterId/:id:', err);
//     res.status(500).send(err);
//   }
// });

router.get("/dashboardDetailsBySeviceCenterId/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // Get the current date
    const now1 = new Date();

    // Start of today (midnight of the current day)
    const startOfDay = new Date(now1.getFullYear(), now1.getMonth(), now1.getDate());

    // Start of the current week (Sunday)
    const startOfWeek = new Date(now1);
    startOfWeek.setDate(now1.getDate() - now1.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    // Start of the current month
    const startOfMonth = new Date(now1.getFullYear(), now1.getMonth(), 1);

    // Start of the last month
    const startOfLastMonth = new Date(now1.getFullYear(), now1.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now1.getFullYear(), now1.getMonth(), 0);

    // Start of the last week (previous week Sunday)
    const startOfLastWeek = new Date(startOfWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
    startOfLastWeek.setHours(0, 0, 0, 0);
    const endOfLastWeek = new Date(startOfWeek);
    const {  now, oneDayAgo, fiveDaysAgo } = calculateDateRanges();
    // Query to filter complaints by assignServiceCenterId
    const query = { assignServiceCenterId: id };

    // Fetch counts for all complaints and complaints with specific statuses
    const [
      allComplaintCount,
      complaintNewCount,
      complaintAssignCount,
      complaintPendingCount,
      complaintCompleteCount,
      complaintCancelCount,
      complaintPartPendingCount,
      allMonthComplaintCount,
      lastMonthNewCount,
      lastMonthAssignCount,
      lastMonthPendingCount,
      lastMonthCompleteCount,
      lastMonthCancelCount,
      lastMonthPartPendingCount,
      allWeekComplaintCount,
      complaints0To1Days,
      complaints2To5Days,
      complaintsMoreThan5Days,
      lastWeekNewCount,
      lastWeekAssignCount,
      lastWeekPendingCount,
      lastWeekCompleteCount,
      lastWeekCancelCount,
      lastWeekPartPendingCount,
      allDailyComplaintCount,
      dailyNewCount,
      dailyAssignCount,
      dailyPendingCount,
      dailyCompleteCount,
      dailyCancelCount,
      dailyPartPendingCount
    ] = await Promise.all([
      // Total counts
      Complaints.countDocuments(query),
      Complaints.countDocuments({ ...query, status: 'IN PROGRESS' }),
      Complaints.countDocuments({ ...query, status: 'ASSIGN' }),
      Complaints.countDocuments({ ...query, status: 'PENDING' }),
      Complaints.countDocuments({ ...query, status: 'COMPLETED' }),
      Complaints.countDocuments({ ...query, status: 'CANCELED' }),
      Complaints.countDocuments({ ...query, status: 'PART PENDING' }),
      Complaints.countDocuments({ ...query, createdAt: { $gte: oneDayAgo } }),
      Complaints.countDocuments({ ...query, createdAt: { $gte: fiveDaysAgo, $lt: oneDayAgo } }),
      Complaints.countDocuments({ ...query, createdAt: { $lt: fiveDaysAgo } }),
      // Last Month counts
      Complaints.countDocuments({ ...query, createdAt: { $gte: startOfLastMonth, $lt: startOfMonth } }),
      Complaints.countDocuments({ ...query, status: 'IN PROGRESS', createdAt: { $gte: startOfLastMonth, $lt: startOfMonth } }),
      Complaints.countDocuments({ ...query, status: 'ASSIGN', createdAt: { $gte: startOfLastMonth, $lt: startOfMonth } }),
      Complaints.countDocuments({ ...query, status: 'PENDING', createdAt: { $gte: startOfLastMonth, $lt: startOfMonth } }),
      Complaints.countDocuments({ ...query, status: 'COMPLETED', createdAt: { $gte: startOfLastMonth, $lt: startOfMonth } }),
      Complaints.countDocuments({ ...query, status: 'CANCELED', createdAt: { $gte: startOfLastMonth, $lt: startOfMonth } }),
      Complaints.countDocuments({ ...query, status: 'PART PENDING', createdAt: { $gte: startOfLastMonth, $lt: startOfMonth } }),

      // Last Week counts
      Complaints.countDocuments({ ...query, createdAt: { $gte: startOfLastMonth, $lt: startOfMonth } }),
      Complaints.countDocuments({ ...query, status: 'IN PROGRESS', createdAt: { $gte: startOfLastWeek, $lt: endOfLastWeek } }),
      Complaints.countDocuments({ ...query, status: 'ASSIGN', createdAt: { $gte: startOfLastWeek, $lt: endOfLastWeek } }),
      Complaints.countDocuments({ ...query, status: 'PENDING', createdAt: { $gte: startOfLastWeek, $lt: endOfLastWeek } }),
      Complaints.countDocuments({ ...query, status: 'COMPLETED', createdAt: { $gte: startOfLastWeek, $lt: endOfLastWeek } }),
      Complaints.countDocuments({ ...query, status: 'CANCELED', createdAt: { $gte: startOfLastWeek, $lt: endOfLastWeek } }),
      Complaints.countDocuments({ ...query, status: 'PART PENDING', createdAt: { $gte: startOfLastWeek, $lt: endOfLastWeek } }),


      // Daily counts
      Complaints.countDocuments({ ...query, createdAt: { $gte: startOfDay } }),
      Complaints.countDocuments({ ...query, status: 'IN PROGRESS', createdAt: { $gte: startOfDay } }),
      Complaints.countDocuments({ ...query, status: 'ASSIGN', createdAt: { $gte: startOfDay } }),
      Complaints.countDocuments({ ...query, status: 'PENDING', createdAt: { $gte: startOfDay } }),
      Complaints.countDocuments({ ...query, status: 'COMPLETED', createdAt: { $gte: startOfDay } }),
      Complaints.countDocuments({ ...query, status: 'CANCELED', createdAt: { $gte: startOfDay } }),
      Complaints.countDocuments({ ...query, status: 'PART PENDING', createdAt: { $gte: startOfDay } }),

    ]);

    // Return aggregated data as JSON response
    res.json({
      complaints: {
        allComplaints: allComplaintCount,
        inProgress: complaintNewCount,
        assign: complaintAssignCount,
        pending: complaintPendingCount,
        complete: complaintCompleteCount,
        cancel: complaintCancelCount,
        partPending: complaintPartPendingCount,
        zeroToOneDays: complaints0To1Days,
        twoToFiveDays: complaints2To5Days,
        moreThanFiveDays: complaintsMoreThan5Days,
        lastMonth: {
          allComplaints: allMonthComplaintCount,
          inProgress: lastMonthNewCount,
          assign: lastMonthAssignCount,
          pending: lastMonthPendingCount,
          complete: lastMonthCompleteCount,
          cancel: lastMonthCancelCount,
          partPending: lastMonthPartPendingCount,
          zeroToOneDays: complaints0To1Days,
          twoToFiveDays: complaints2To5Days,
          moreThanFiveDays: complaintsMoreThan5Days,
        },
        lastWeek: {
          allComplaints: allWeekComplaintCount,
          inProgress: lastWeekNewCount,
          assign: lastWeekAssignCount,
          pending: lastWeekPendingCount,
          complete: lastWeekCompleteCount,
          cancel: lastWeekCancelCount,
          partPending: lastWeekPartPendingCount
        },
        daily: {
          allComplaints: allDailyComplaintCount,
          inProgress: dailyNewCount,
          assign: dailyAssignCount,
          pending: dailyPendingCount,
          complete: dailyCompleteCount,
          cancel: dailyCancelCount,
          partPending: dailyPartPendingCount,
        }
      }
    });

  } catch (err) {
    console.error('Error in /dashboardDetailsBySeviceCenterId/:id:', err);
    res.status(500).send(err);
  }
});




router.get("/dashboardDetailsByTechnicianId/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { technicianId: id };

    const { now, oneDayAgo, fiveDaysAgo } = calculateDateRanges();
    const [
      allComplaintCount,
      complaintProdressCount,
      complaintAssignCount,
      complaintPendingCount,
      complaintCompleteCount,
      complaintCancelCount,
      complaintPartPendingCount,
      complaints0To1Days,
      complaints2To5Days,
      complaintsMoreThan5Days
    ] = await Promise.all([
      Complaints.countDocuments(query),
      Complaints.countDocuments({ ...query, status: 'IN PROGRESS' }),
      Complaints.countDocuments({ ...query, status: 'ASSIGN' }),
      Complaints.countDocuments({ ...query, status: 'PENDING' }),
      Complaints.countDocuments({ ...query, status: 'COMPLETED' }),
      Complaints.countDocuments({ ...query, status: 'CANCELED' }),
      Complaints.countDocuments({ ...query, status: 'PART PENDING' }),
      Complaints.countDocuments({ ...query, createdAt: { $gte: oneDayAgo } }),
      Complaints.countDocuments({ ...query, createdAt: { $gte: fiveDaysAgo, $lt: oneDayAgo } }),
      Complaints.countDocuments({ ...query, createdAt: { $lt: fiveDaysAgo } })
    ]);

    res.json({
      complaints: {
        allComplaints: allComplaintCount,
        inProgress: complaintProdressCount,
        assign: complaintAssignCount,
        pending: complaintPendingCount,
        complete: complaintCompleteCount,
        cancel: complaintCancelCount,
        partPending: complaintPartPendingCount,
        zeroToOneDays: complaints0To1Days,
        twoToFiveDays: complaints2To5Days,
        moreThanFiveDays: complaintsMoreThan5Days
      }
    });
  } catch (err) {
    console.error('Error in /dashboardDetailsById/:id:', err);
    res.status(500).send(err);
  }
});

    

router.get("/dashboardDetailsByDealerId/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { dealerId: id };
 const { now, oneDayAgo, fiveDaysAgo } = calculateDateRanges();
    const [
      allComplaintCount,
      complaintProdressCount,
      complaintAssignCount,
      complaintPendingCount,
      complaintCompleteCount,
      complaintCancelCount,
      complaintPartPendingCount,
      complaints0To1Days,
      complaints2To5Days,
      complaintsMoreThan5Days
    ] = await Promise.all([
      Complaints.countDocuments(query),
      Complaints.countDocuments({ ...query, status: 'IN PROGRESS' }),
      Complaints.countDocuments({ ...query, status: 'ASSIGN' }),
      Complaints.countDocuments({ ...query, status: 'PENDING' }),
      Complaints.countDocuments({ ...query, status: 'COMPLETED' }),
      Complaints.countDocuments({ ...query, status: 'CANCELED' }),
      Complaints.countDocuments({ ...query, status: 'PART PENDING' }),
      Complaints.countDocuments({ ...query, createdAt: { $gte: oneDayAgo } }),
      Complaints.countDocuments({ ...query, createdAt: { $gte: fiveDaysAgo, $lt: oneDayAgo } }),
      Complaints.countDocuments({ ...query, createdAt: { $lt: fiveDaysAgo } })
    ]);

    res.json({
      complaints: {
        allComplaints: allComplaintCount,
        inProgress: complaintProdressCount,
        assign: complaintAssignCount,
        pending: complaintPendingCount,
        complete: complaintCompleteCount,
        cancel: complaintCancelCount,
        partPending: complaintPartPendingCount,
        zeroToOneDays: complaints0To1Days,
        twoToFiveDays: complaints2To5Days,
        moreThanFiveDays: complaintsMoreThan5Days
      }
    });
  } catch (err) {
    console.error('Error in /dashboardDetailsById/:id:', err);
    res.status(500).send(err);
  }
});


router.get("/dashboardDetailsByUserId/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { userId: id };
    const { now, oneDayAgo, fiveDaysAgo } = calculateDateRanges();
    const [
      allComplaintCount,
      complaintProdressCount,
      complaintAssignCount,
      complaintPendingCount,
      complaintCompleteCount,
      complaintCancelCount,
      complaintPartPendingCount,
      complaints0To1Days,
      complaints2To5Days,
      complaintsMoreThan5Days
    ] = await Promise.all([
      Complaints.countDocuments(query),
      Complaints.countDocuments({ ...query, status: 'IN PROGRESS' }),
      Complaints.countDocuments({ ...query, status: 'ASSIGN' }),
      Complaints.countDocuments({ ...query, status: 'PENDING' }),
      Complaints.countDocuments({ ...query, status: 'COMPLETED' }),
      Complaints.countDocuments({ ...query, status: 'CANCELED' }),
      Complaints.countDocuments({ ...query, status: 'PART PENDING' }),
      Complaints.countDocuments({ ...query, createdAt: { $gte: oneDayAgo } }),
      Complaints.countDocuments({ ...query, createdAt: { $gte: fiveDaysAgo, $lt: oneDayAgo } }),
      Complaints.countDocuments({ ...query, createdAt: { $lt: fiveDaysAgo } })
    ]);

    res.json({
      complaints: {
        allComplaints: allComplaintCount,
        inProgress: complaintProdressCount,
        assign: complaintAssignCount,
        pending: complaintPendingCount,
        complete: complaintCompleteCount,
        cancel: complaintCancelCount,
        partPending: complaintPartPendingCount,
        zeroToOneDays: complaints0To1Days,
        twoToFiveDays: complaints2To5Days,
        moreThanFiveDays: complaintsMoreThan5Days
      }
    });
  } catch (err) {
    console.error('Error in /dashboardDetailsById/:id:', err);
    res.status(500).send(err);
  }
});


const calculateDateRanges = () => {
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
  const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);

  return { now, oneDayAgo, twoDaysAgo, fiveDaysAgo };
};
router.get("/dashboardDetailsByBrandId/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { brandId: id };
    const { now, oneDayAgo, fiveDaysAgo } = calculateDateRanges();
    const [
      allComplaintCount,
      complaintProdressCount,
      complaintAssignCount,
      complaintPendingCount,
      complaintCompleteCount,
      complaintCancelCount,
      complaintPartPendingCount,
      complaints0To1Days,
      complaints2To5Days,
      complaintsMoreThan5Days
    ] = await Promise.all([
      Complaints.countDocuments(query),
      Complaints.countDocuments({ ...query, status: 'IN PROGRESS' }),
      Complaints.countDocuments({ ...query, status: 'ASSIGN' }),
      Complaints.countDocuments({ ...query, status: 'PENDING' }),
      Complaints.countDocuments({ ...query, status: 'COMPLETED' }),
      Complaints.countDocuments({ ...query, status: 'CANCELED' }),
      Complaints.countDocuments({ ...query, status: 'PART PENDING' }),
      Complaints.countDocuments({ ...query, createdAt: { $gte: oneDayAgo } }),
      Complaints.countDocuments({ ...query, createdAt: { $gte: fiveDaysAgo, $lt: oneDayAgo } }),
      Complaints.countDocuments({ ...query, createdAt: { $lt: fiveDaysAgo } })
    ]);

    res.json({
      complaints: {
        allComplaints: allComplaintCount,
        inProgress: complaintProdressCount,
        assign: complaintAssignCount,
        pending: complaintPendingCount,
        complete: complaintCompleteCount,
        cancel: complaintCancelCount,
        partPending: complaintPartPendingCount,
        zeroToOneDays: complaints0To1Days,
        twoToFiveDays: complaints2To5Days,
        moreThanFiveDays: complaintsMoreThan5Days
      }
    });
  } catch (err) {
    console.error('Error in /dashboardDetailsById/:id:', err);
    res.status(500).send(err);
  }
});



router.get('/getStatewisePendingComplaints', async (req, res) => {
  try {
    // Aggregation pipeline to get count of pending complaints by state
    const complaints = await Complaints.aggregate([
      { $match: { status: 'PENDING' } },  // Filter to include only pending complaints
      { $group: { _id: "$state", count: { $sum: 1 } } } , // Group by state and count
      { $sort: { count: -1 } } 
    ]);

    res.status(200).json(complaints);  // Send response with aggregated data
  } catch (error) {
    console.error('Error fetching state-wide pending complaints:', error);
    res.status(500).json({ error: 'Error fetching state-wide pending complaints' });
  }
});

router.get('/getDistrictWisePendingComplaints', async (req, res) => {
  try {
    // Aggregation pipeline to get count of pending complaints by district
    const complaints = await Complaints.aggregate([
      { $match: { status: 'PENDING' } },  // Filter to include only pending complaints
      { $group: { _id: "$district", count: { $sum: 1 } } },  // Group by district and count
      { $sort: { count: -1 } } 
    ]);

    res.status(200).json(complaints);  // Send response with aggregated data
  } catch (error) {
    console.error('Error fetching district-wise pending complaints:', error);
    res.status(500).json({ error: 'Error fetching district-wise pending complaints' });
  }
});

router.get('/getServiceCenterWisePendingComplaints', async (req, res) => {
  try {
    // Aggregation pipeline to get count of pending complaints by service center, sorted by count in descending order
    const complaints = await Complaints.aggregate([
      { $match: { status: 'PENDING' } },                    // Filter to include only pending complaints
      { $group: { _id: "$assignServiceCenter", count: { $sum: 1 } } },  // Group by service center and count
      { $sort: { count: -1 } }                              // Sort by count in descending order
    ]);

    res.status(200).json(complaints);  // Send response with sorted data
  } catch (error) {
    console.error('Error fetching service-center-wise pending complaints:', error);
    res.status(500).json({ error: 'Error fetching service-center-wise pending complaints' });
  }
});
router.get('/getNoServiceableAreaComplaints', async (req, res) => {
  try {
    // Aggregation pipeline to get pending complaints with no associated service center, including userName and district
    const complaints = await Complaints.aggregate([
      { $match: { status: 'PENDING', serviceCenter: { $exists: false } } },  // Filter for pending complaints without service center
      { $project: { userName: 1, district: 1 } }                             // Project only userName and district fields
    ]);

    res.status(200).json(complaints);  // Send response with list of complaints
  } catch (error) {
    console.error('Error fetching no serviceable area complaints:', error);
    res.status(500).json({ error: 'Error fetching no serviceable area complaints' });
  }
});
router.get('/getComplaintInsights', async (req, res) => {
  try {
    const [
      complaintsByBrand,
      complaintsByLocationAndProduct,
      commonFaults
    ] = await Promise.all([
      Complaints.aggregate([
        { $group: { _id: "$productBrand", count: { $sum: 1 } } }, // No $match to filter status
        { $sort: { count: -1 } }
      ]),
      Complaints.aggregate([
        { $group: { _id: {   product: "$productName" }, count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Complaints.aggregate([
        { $unwind: "$issueType" },  // Unwind the issueType array
        { $group: { _id: "$issueType", count: { $sum: 1 } } },  // Group by individual issue types
        { $sort: { count: -1 } }
      ])
    ]);

    res.status(200).json({
      complaintsByBrand,
      complaintsByLocationAndProduct,
      commonFaults
    });
  } catch (error) {
    console.error('Error fetching complaint insights:', error);
    res.status(500).json({ error: 'Error fetching complaint insights' });
  }
});








module.exports = router;
