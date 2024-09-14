const mongoose = require("mongoose")
const { type } = require("os")

const complaintSchema = new mongoose.Schema({
  //     complaintName:{type:String },
  //     productCategory:{type:String },
  //     categoryId:{type:String },
  //     brand:{type:String },
  //     brandId:{type:String },
  //     adminId:{type:String },
  //     productName:{type:String }
  //     ,customerName:{type:String },
  //     customerMobile:{type:String },
  //     customerEmail:{type:String },
  //     zipCode:{type:String },
  //     address1:{type:String },
  //     address2:{type:String },
  //     listOfArea:{type:String },
  //     state:{type:String },
  //     district:{type:String },
  //     city:{type:String },
  //     locality:{type:String },
  //     lacdmark:{type:String },
  //     complaintNature:{type:String },
  //     complaintDetails:{type:String },
  //     complaintType:{type:String },
  //     status:{type:String,default:"PENDIND"}
  // },{timestamps:true})
  complaintId: { type: String },
  productName: { type: String },
  categoryName: { type: String },
  subCategoryName:{ type: String },
  productBrand: { type: String },
  productId: { type: String },
  categoryId: { type: String },
  brandId: { type: String },
  modelNo: { type: String },
  serialNo: { type: String },
  uniqueId: { type: String },
  purchaseDate: { type: Date },
  lat: { type: String  },
  long: { type: String  },
  warrantyStatus: { type: String },
  warrantyYears: { type: String },
  priorityLevel: { type: String },
  userName: { type: String },
  userId: { type: String },
  dealerName: { type: String },
  dealerId: { type: String },
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
  // images: { type: String }, 
  // issueType: { type: String }, 
  issueType: {
    type: Array
   
},
  
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
  statusComment: { type: String }
}, { timestamps: true });


complaintSchema.pre('save', function (next) {
  const complaint = this;

  // Add debug logging to check if the middleware is triggered
  // console.log("Running pre-save middleware for complaintId generation");

  // Ensure both productBrand and productName are defined before generating complaintId
  if (!complaint.complaintId) {
    const brandPart = complaint.productBrand ? complaint.productBrand.slice(0, 2).toUpperCase() : "XX"; // Default to 'XX' if undefined
    const date = new Date();
    const dayPart = date.getDate().toString().padStart(2, '0'); // Day in 2 digits
    const monthPart = (date.getMonth() + 1).toString().padStart(2, '0'); // Month in 2 digits
    const productPart = complaint.productName ? complaint.productName.slice(0, 2).toUpperCase() : "YY"; // Default to 'YY' if undefined

    // Generate complaintId (Example: BR0409PR or XX0409YY if productBrand or productName is missing)
    complaint.complaintId = `${brandPart}${dayPart}${monthPart}${productPart}`;

    // Log the generated complaintId
    // console.log("Generated complaintId:", complaint.complaintId);
  } else {
    console.log("complaintId already exists:", complaint.complaintId);
  }

  next();
});




const ComplaintModal = new mongoose.model("Complaints", complaintSchema)


module.exports = ComplaintModal