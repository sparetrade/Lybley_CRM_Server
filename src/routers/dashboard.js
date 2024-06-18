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
const Complaints = require("../models/complaint");

router.get("/dashboardDetails", async (req, res) => {
  try {
    const [
      customerCount, 
      orderCount, 
      serviceCount, 
      technicianCount, 
      dealerCount, 
      sparePartCount, 
      brandCount,
      allComplaintCount,
      complaintNewCount,
      complaintAssignCount,
      complaintPendingCount,
      complaintCompleteCount,
      complaintCancelCount,
      complaintPartPendingCount
    ] = await Promise.all([
      UserModel.countDocuments({}),
      Orders.countDocuments({}),
      ServiceModel.countDocuments({}),
      TechnicianModal.countDocuments({}),
      DealerModel.countDocuments({}),
      SpareParts.countDocuments({}),
      BrandRegistrationModel.countDocuments({}),
      Complaints.countDocuments({ }),
      Complaints.countDocuments({ status: 'NEW' }),
      Complaints.countDocuments({ status: 'ASSIGN' }),
      Complaints.countDocuments({ status: 'PENDIND' }),
      Complaints.countDocuments({ status: 'COMPLETED' }),
      Complaints.countDocuments({ status: 'CANCELED' }),
      Complaints.countDocuments({ status: 'PART PENDIND' })
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
        new: complaintNewCount,
        assign: complaintAssignCount,
        pending: complaintPendingCount,
        complete: complaintCompleteCount,
        cancel: complaintCancelCount,
        partPending: complaintPartPendingCount
      }
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
