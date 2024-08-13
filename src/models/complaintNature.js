
const mongoose=require("mongoose")
 

const complaintNatureSchema=new mongoose.Schema({
  productName:{type:String,required:true},
  productId:{type:String },
  nature:{type:String,required:true},
},{timestamps:true})

const ComplaintNatureModal=new mongoose.model("ComplaintNature",complaintNatureSchema);

module.exports=ComplaintNatureModal;