const mongoose = require("mongoose");

// Define the complaint schema
const complaintSchema = new mongoose.Schema({
  complaintId: { type: String, unique: true }, // Ensure complaintId is unique
  productName: { type: String },
  categoryName: { type: String },
  subCategoryName: { type: String },
  productBrand: { type: String },
  productId: { type: String },
  categoryId: { type: String },
  brandId: { type: String },
  modelNo: { type: String },
  serialNo: { type: String },
  uniqueId: { type: String },
  purchaseDate: { type: Date },
  lat: { type: String },
  long: { type: String },
  warrantyStatus: { type: String },
  warrantyYears: { type: String },
  priorityLevel: { type: String },
  userName: { type: String },
  userId: { type: String },
  dealerName: { type: String },
  dealerId: { type: String },
  updateComments: [
    {
      updatedAt: { type: Date, default: Date.now },
      changes: { type: Map, of: String },
    },
  ],
  updateHistory: [
    {
      updatedAt: { type: Date, default: Date.now },
      changes: { type: Map, of: String },
    },
  ],
  assignServiceCenter: { type: String },
  assignServiceCenterId: { type: String },
  assignServiceCenterTime: { type: Date },
  srerviceCenterResponseTime: { type: Date },
  assignTechnicianTime: { type: Date },
  technicianResposeTime: { type: Date },
  assignTechnician: { type: String },
  technicianId: { type: String },
  technicianContact: { type: String },
  comments: { type: String },
  issueType: { type: Array },
  detailedDescription: { type: String },
  issueImages: { type: String },
  warrantyImage: { type: String },
  errorMessages: { type: String },
  preferredServiceDate: { type: Date },
  preferredServiceTime: { type: String },
  serviceLocation: { type: String },
  fullName: { type: String },
  phoneNumber: { type: String },
  emailAddress: { type: String },
  alternateContactInfo: { type: String },
  pincode: { type: String },
  district: { type: String },
  state: { type: String },
  serviceAddress: { type: String },
  status: { type: String, default: "PENDING" },
  payment: { type: Number, default: 0 },
  paymentBrand: { type: Number, default: 0 },
  finalComments: { type: String },
  kilometer: { type: String },

  statusComment: { type: String }
}, { timestamps: true });

// Pre-save middleware to generate a unique complaintId
complaintSchema.pre('save', async function (next) {
  const complaint = this;

  // Generate complaintId if it doesn't exist
  if (!complaint.complaintId) {
    const brandPart = complaint.productBrand ? complaint.productBrand.slice(0, 2).toUpperCase() : "XX"; // Default to 'XX'
    const date = new Date();
    const dayPart = date.getDate().toString().padStart(2, '0'); // Day in 2 digits
    const monthPart = (date.getMonth() + 1).toString().padStart(2, '0'); // Month in 2 digits
    const productPart = complaint.productName ? complaint.productName.slice(0, 2).toUpperCase() : "YY"; // Default to 'YY'
    const randomPart = Math.floor(Math.random() * 1000).toString().padStart(3, '0'); // Random 3 digit number

    // Generate complaintId
    complaint.complaintId = `${brandPart}${dayPart}${monthPart}${productPart}${randomPart}`;

    // Ensure uniqueness
    const existingComplaint = await ComplaintModal.findOne({ complaintId: complaint.complaintId });
    if (existingComplaint) {
      // If the generated complaintId already exists, regenerate it
      return next();
    }
  } else {
    console.log("complaintId already exists:", complaint.complaintId);
  }

  next();
});

// Create the Complaint model
const ComplaintModal = mongoose.model("Complaints", complaintSchema);

module.exports = ComplaintModal;
