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
  productName: { type: String },
  categoryName: { type: String },
  productBrand: { type: String },
  productId: { type: String },
  categoryId: { type: String },
  brandId: { type: String },
  modelNo: { type: String },
  serialNo: { type: String },
  purchaseDate: { type: Date },
  warrantyStatus: { type: String },
  priorityLevel: { type: String },
  userName: { type: String },
  userId: { type: String },
  dealerName: { type: String },
  dealerId: { type: String },
  assignServiceCenter: { type: String },
  assignServiceCenterId: { type: String },
  assignTechnician: { type: String },
  technicianId: { type: String },
  technicianContact: { type: String },
  comments: { type: String },
  // images: { type: String }, 
  issueType: { type: String },
  detailedDescription: { type: String },
  issueImages: { type: String },  
  errorMessages: { type: String },
  preferredServiceDate: { type: Date },
  preferredServiceTime: { type: String },
  serviceLocation: { type: String },
  fullName: { type: String },
  phoneNumber: { type: String },
  emailAddress: { type: String },
  alternateContactInfo: { type: String },
  serviceAddress: { type: String },
  status: { type: String, default: "PENDING" },
  statusComment: { type: String }
}, { timestamps: true });

const ComplaintModal = new mongoose.model("Complaints", complaintSchema)


module.exports = ComplaintModal