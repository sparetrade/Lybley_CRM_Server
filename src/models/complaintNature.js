
const mongoose=require("mongoose")
 

const complaintNatureSchema=new mongoose.Schema({
 
  nature:{type:String,required:true},
  products: [
    {
      productName:{type:String },
      productId:{type:String },
    },
  ],
},{timestamps:true})

const ComplaintNatureModal=new mongoose.model("ComplaintNature",complaintNatureSchema);

module.exports=ComplaintNatureModal;