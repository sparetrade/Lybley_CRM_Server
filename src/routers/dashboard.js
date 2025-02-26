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
const ServicePayment = require("../models/servicePaymentModel");

router.get("/dashboardDetails", async (req, res) => {
  try {
    const { now, oneDayAgo, fiveDaysAgo, todayStart } = calculateDateRanges();

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
      complaintFinalVerificationCount,
      complaints0To1Days,
      complaints2To5Days,
      complaintsMoreThan5Days,
      complaintsCompletedToday,
      complaints0To1PartPendingDays,
      complaints2To5PartPendingDays,
      complaintsMoreThan5PartPendingDays,
      scheduleUpcomming,
      centerPayment,
      centerPaidPayment,
      centerUnPaidPayment,
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
      Complaints.countDocuments({ status: 'FINAL VERIFICATION' }),

      // Complaints.countDocuments({  createdAt: { $gte: oneDayAgo } }),
      // Complaints.countDocuments({   createdAt: { $gte: fiveDaysAgo, $lt: oneDayAgo } }),
      // Complaints.countDocuments({   createdAt: { $lt: fiveDaysAgo } })
      // ]);
      // Complaints.countDocuments({ status: 'PENDING', createdAt: { $gte: oneDayAgo } }),
      // Complaints.countDocuments({ status: 'PENDING', createdAt: { $gte: fiveDaysAgo, $lt: oneDayAgo } }),
      // Complaints.countDocuments({ status: 'PENDING', createdAt: { $lt: fiveDaysAgo } })
      Complaints.countDocuments({
        $or: [{ status: 'PENDING' }, { status: 'IN PROGRESS' }],
        createdAt: { $gte: oneDayAgo }
      }),
      Complaints.countDocuments({
        $or: [{ status: 'PENDING' }, { status: 'IN PROGRESS' }],
        createdAt: { $gte: fiveDaysAgo, $lt: oneDayAgo }
      }),
      Complaints.countDocuments({
        $or: [{ status: 'PENDING' }, { status: 'IN PROGRESS' }],
        createdAt: { $lt: fiveDaysAgo }
      }),
      Complaints.countDocuments({ status: 'COMPLETED', updatedAt: { $gte: todayStart } }),

      Complaints.countDocuments({ status: 'PART PENDING', createdAt: { $gte: oneDayAgo } }),
      Complaints.countDocuments({ status: 'PART PENDING', createdAt: { $gte: fiveDaysAgo, $lt: oneDayAgo } }),
      Complaints.countDocuments({ status: 'PART PENDING', createdAt: { $lt: fiveDaysAgo } }),
      Complaints.countDocuments({  preferredServiceDate: { $gte: todayStart  } }),
      ServicePayment.countDocuments({} ),
      ServicePayment.countDocuments({ status: 'PAID' }),
      ServicePayment.countDocuments({ status: 'UNPAID' }),
     
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
        finalVerification: complaintFinalVerificationCount,
        zeroToOneDays: complaints0To1Days,
        twoToFiveDays: complaints2To5Days,
        moreThanFiveDays: complaintsMoreThan5Days,
        completedToday: complaintsCompletedToday,
        zeroToOneDaysPartPending: complaints0To1PartPendingDays,
        twoToFiveDaysPartPending: complaints2To5PartPendingDays,
        moreThanFiveDaysPartPending: complaintsMoreThan5PartPendingDays,
        completedToday: complaintsCompletedToday,
        scheduleUpcomming: scheduleUpcomming,
       
      },
      centerPayment:centerPayment,
      centerPaidPayment:centerPaidPayment,
      centerUnPaidPayment:centerUnPaidPayment,
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
router.get('/getCustomers/:id', async (req, res) => {
  try {
    const brandId = req.params.id; // Extract brandId from query parameters
    // console.log(brandId);

    // Find complaints based on the brandId
    const complaints = await Complaints.find(brandId ? { brandId } : {});

    // Extract unique user IDs (or other fields, such as email) from complaints
    const userIds = [...new Set(complaints.map(complaint => complaint.userId))];

    // Find users who match the extracted user IDs
    const customers = await UserModel.find({ _id: { $in: userIds } });

    res.json({
      customers,       // Users associated with complaints
      complaints,  // The complaints data
    });
  } catch (err) {
    console.error('Error fetching users and complaints by brandId:', err);
    res.status(500).send(err);
  }
});



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
    const { now, oneDayAgo, fiveDaysAgo } = calculateDateRanges();
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
      complaints0To1Days,
      complaints2To5Days,
      complaintsMoreThan5Days,
      lastMonthNewCount,
      lastMonthAssignCount,
      lastMonthPendingCount,
      lastMonthCompleteCount,
      lastMonthCancelCount,
      lastMonthPartPendingCount,
      allWeekComplaintCount,

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
      // Complaints.countDocuments({ ...query, status: 'PENDING', createdAt: { $gte: oneDayAgo } }),
      // Complaints.countDocuments({ ...query, status: 'PENDING', createdAt: { $gte: fiveDaysAgo, $lt: oneDayAgo } }),
      // Complaints.countDocuments({ ...query, status: 'PENDING', createdAt: { $lt: fiveDaysAgo } }),
      Complaints.countDocuments({ ...query, status: 'PENDING', createdAt: { $gte: oneDayAgo } }),
      Complaints.countDocuments({ ...query, status: 'PENDING', createdAt: { $gte: fiveDaysAgo, $lt: oneDayAgo } }),
      Complaints.countDocuments({ ...query, status: 'PENDING', createdAt: { $lt: fiveDaysAgo } }),
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


// const calculateDateRanges = () => {
//   const now = new Date();
//   const oneDayAgo = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
//   const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
//   const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);

//   return { now, oneDayAgo, twoDaysAgo, fiveDaysAgo };
// };
const calculateDateRanges = () => {
  const now = new Date();
  now.setHours(23, 59, 59, 999); // Ensure the current date is set to end of the day

  const oneDayAgo = new Date(now);
  oneDayAgo.setDate(now.getDate() - 1);
  oneDayAgo.setHours(0, 0, 0, 0); // Start of the day

  const twoDaysAgo = new Date(now);
  twoDaysAgo.setDate(now.getDate() - 2);
  twoDaysAgo.setHours(0, 0, 0, 0);

  const fiveDaysAgo = new Date(now);
  fiveDaysAgo.setDate(now.getDate() - 5);
  fiveDaysAgo.setHours(0, 0, 0, 0);
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  return { now, oneDayAgo, twoDaysAgo, fiveDaysAgo, todayStart };
};

// Example usage
// console.log(calculateDateRanges());

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
      complaintFinalVerificationCount,
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
      Complaints.countDocuments({ ...query, status: 'FINAL VERIFICATION' }),
      Complaints.countDocuments({ ...query, status: 'PENDING', createdAt: { $gte: oneDayAgo } }),
      Complaints.countDocuments({ ...query, status: 'PENDING', createdAt: { $gte: fiveDaysAgo, $lt: oneDayAgo } }),
      Complaints.countDocuments({ ...query, status: 'PENDING', createdAt: { $lt: fiveDaysAgo } })
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
        finalVerification: complaintFinalVerificationCount,
        zeroToOneDays: complaints0To1Days,
        twoToFiveDays: complaints2To5Days,
        moreThanFiveDays: complaintsMoreThan5Days,

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
      { $group: { _id: "$state", count: { $sum: 1 } } }, // Group by state and count
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
    // Aggregation pipeline to get count of pending complaints by state and district
    const complaints = await Complaints.aggregate([
      {
        $match: { status: 'PENDING' }  // Filter to include only pending complaints
      },
      {
        $group: {
          _id: { state: "$state", district: "$district" },  // Group by state and district
          count: { $sum: 1 }  // Count the number of complaints
        }
      },
      {
        $sort: { "count": -1 }  // Sort by count in descending order
      }
    ]);

    // Transform the output to a more readable format (optional)
    const transformedComplaints = complaints.map(item => ({
      state: item._id.state,
      district: item._id.district,
      count: item.count
    }));

    res.status(200).json(transformedComplaints);  // Send response with aggregated data
  } catch (error) {
    console.error('Error fetching district-wise pending complaints:', error);
    res.status(500).json({ error: 'Error fetching district-wise pending complaints' });
  }
});



router.get('/getServiceCenterWisePendingComplaints', async (req, res) => {
  try {
    // Aggregation pipeline to get count of pending complaints by service center
    const complaints = await Complaints.aggregate([
      { $match: { status: 'PENDING', assignServiceCenter: { $ne: null } } }, // Filter to include only pending complaints with a valid service center
      { $group: { _id: "$assignServiceCenter", count: { $sum: 1 } } },       // Group by service center and count
      { $sort: { count: -1 } }                                              // Sort by count in descending order
    ]);

    res.status(200).json(complaints); // Send response with sorted data
  } catch (error) {
    console.error('Error fetching service-center-wise pending complaints:', error);
    res.status(500).json({ error: 'Error fetching service-center-wise pending complaints' });
  }
});

router.get('/getNoServiceableAreaComplaints', async (req, res) => {
  try {
    // Aggregation pipeline to get pending complaints with no associated service center, including userName and district
    const complaints = await Complaints.aggregate([
      { $match: { status: 'PENDING', assignServiceCenter: { $exists: false } } },  // Filter for pending complaints without service center
      { $project: { userName: 1, district: 1, state: 1, phoneNumber: 1 } }                             // Project only userName and district fields
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
      commonFaults,
      pendingComplaintsByBrand
    ] = await Promise.all([
      Complaints.aggregate([
        // Group complaints by productBrand and count them
        { $group: { _id: "$productBrand", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Complaints.aggregate([
        // Group complaints by both product and productBrand
        {
          $group: {
            _id: { product: "$productName", productBrand: "$productBrand" },
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]),
      Complaints.aggregate([
        // Unwind the issueType array
        { $unwind: { path: "$issueType", preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: "$issueType",
            productBrand: { $first: "$productBrand" },
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]),
      Complaints.aggregate([
        // Filter only complaints with 'pending' status and group by brand
        { $match: { status: "PENDING" } },
        { $group: { _id: "$productBrand", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    ]);

    res.status(200).json({
      complaintsByBrand,
      complaintsByLocationAndProduct,
      commonFaults,
      pendingComplaintsByBrand
    });
  } catch (error) {
    console.error('Error fetching complaint insights:', error);
    res.status(500).json({ error: 'Error fetching complaint insights' });
  }
});


router.get('/getAllUnAssignComplaint', async (req, res) => {
  try {
    const unassignedComplaints = await Complaints.find({
      $or: [
        { assignServiceCenterId: null },
        { assignServiceCenterId: { $exists: false } }
      ],
      status: { $in: ["PENDING", "IN PROGRESS", "PART PENDING"] } // Filtering based on status
    });

    res.status(200).json({ success: true, data: unassignedComplaints });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error retrieving complaints", error });
  }
});



router.get('/getComplaintCountByCityState', async (req, res) => {
  try {
    const complaintCounts = await Complaints.aggregate([
      {
        $group: {
          _id: { city: "$district" }, // Group by city (district)
          TOTAL: { $sum: 1 },
          state: { $first: "$state" },  
          PENDING: { $sum: { $cond: [{ $eq: [{ $toUpper: "$status" }, "PENDING"] }, 1, 0] } },
          INPROGRESS: { $sum: { $cond: [{ $eq: [{ $toUpper: "$status" }, "IN PROGRESS"] }, 1, 0] } },
          PART_PENDING: { $sum: { $cond: [{ $eq: [{ $toUpper: "$status" }, "PART PENDING"] }, 1, 0] } },
          ASSIGN: { $sum: { $cond: [{ $eq: [{ $toUpper: "$status" }, "ASSIGN"] }, 1, 0] } },
          CANCEL: { $sum: { $cond: [{ $eq: [{ $toUpper: "$status" }, "CANCELED"] }, 1, 0] } },
          COMPLETE: { $sum: { $cond: [{ $eq: [{ $toUpper: "$status" }, "COMPLETED"] }, 1, 0] } },
          FINAL_VERIFICATION: { $sum: { $cond: [{ $eq: [{ $toUpper: "$status" }, "FINAL VERIFICATION"] }, 1, 0] } }
        }
      },
      {
        $sort: { PENDING: -1 } // Sort by PENDING complaints in descending order
      }  
    ]);

    res.status(200).json({ success: true, data: complaintCounts });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error retrieving complaints", error });
  }
});

 
 
router.get("/getComplaintCountByServiceCenter", async (req, res) => {
  try {
    const complaintCounts = await Complaints.aggregate([
      {
        $match: { assignServiceCenterId: { $ne: null } } // Exclude complaints without assignServiceCenterId
      },
      {
        $group: {
          _id: "$assignServiceCenterId",
          assignServiceCenter: { $first: "$assignServiceCenter" },
          city: { $first: "$district" },
          TOTAL: { $sum: 1 },
          PENDING: { $sum: { $cond: [{ $eq: [{ $toUpper: "$status" }, "PENDING"] }, 1, 0] } },
          INPROGRESS: { $sum: { $cond: [{ $eq: [{ $toUpper: "$status" }, "IN PROGRESS"] }, 1, 0] } },
          PART_PENDING: { $sum: { $cond: [{ $eq: [{ $toUpper: "$status" }, "PART PENDING"] }, 1, 0] } },
          ASSIGN: { $sum: { $cond: [{ $eq: [{ $toUpper: "$status" }, "ASSIGN"] }, 1, 0] } },
          CANCEL: { $sum: { $cond: [{ $eq: [{ $toUpper: "$status" }, "CANCELED"] }, 1, 0] } },
          COMPLETE: { $sum: { $cond: [{ $eq: [{ $toUpper: "$status" }, "COMPLETED"] }, 1, 0] } },
          FINAL_VERIFICATION: { $sum: { $cond: [{ $eq: [{ $toUpper: "$status" }, "FINAL VERIFICATION"] }, 1, 0] } }
        }
      },
      {
        $sort: { PENDING: -1 } // Sort by PENDING complaints in descending order
      }
    ]);

    res.status(200).json({ success: true, data: complaintCounts });
  } catch (error) {
    console.error("Error fetching complaint count:", error);
    res.status(500).json({ success: false, message: "Error retrieving complaints", error });
  }
});


 
router.get('/getComplaintCountByBrand', async (req, res) => {
  try {
    const complaintCounts = await Complaints.aggregate([
      {
        $group: {
          _id: { brandId: "$brandId" }, // Group by city (district)
          TOTAL: { $sum: 1 },
          productBrand: { $first: "$productBrand" },  
          PENDING: { $sum: { $cond: [{ $eq: [{ $toUpper: "$status" }, "PENDING"] }, 1, 0] } },
          INPROGRESS: { $sum: { $cond: [{ $eq: [{ $toUpper: "$status" }, "IN PROGRESS"] }, 1, 0] } },
          PART_PENDING: { $sum: { $cond: [{ $eq: [{ $toUpper: "$status" }, "PART PENDING"] }, 1, 0] } },
          ASSIGN: { $sum: { $cond: [{ $eq: [{ $toUpper: "$status" }, "ASSIGN"] }, 1, 0] } },
          CANCEL: { $sum: { $cond: [{ $eq: [{ $toUpper: "$status" }, "CANCELED"] }, 1, 0] } },
          COMPLETE: { $sum: { $cond: [{ $eq: [{ $toUpper: "$status" }, "COMPLETED"] }, 1, 0] } },
          FINAL_VERIFICATION: { $sum: { $cond: [{ $eq: [{ $toUpper: "$status" }, "FINAL VERIFICATION"] }, 1, 0] } }
        }
      },
      {
        $sort: { PENDING: -1 } // Sort by PENDING complaints in descending order
      } 
    ]);



    res.status(200).json({ success: true, data: complaintCounts });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error retrieving complaints", error });
  }
});













module.exports = router;
