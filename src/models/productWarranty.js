
const mongoose=require("mongoose")
 

const productWarrantySchema=new mongoose.Schema({
  productName:{type:String,required:true},
  productId:{type:String },
  nature:{type:String,required:true},
},{timestamps:true})

const ProductWarrantyModal=new mongoose.model("ProductWarranty",productWarrantySchema);

module.exports=ProductWarrantyModal;