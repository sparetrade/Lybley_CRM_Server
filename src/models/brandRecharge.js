const mongoose=require("mongoose");

const brandRechargeSchema=new mongoose.Schema({
    brandId:{type:String},
    brandName:{type:String},
     ammount:{type:String},
},{timestamps:true})

const BrandRechargeModel=new mongoose.model("brandRecharge",brandRechargeSchema);

module.exports=BrandRechargeModel;