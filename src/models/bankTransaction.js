const mongoose=require("mongoose");

const bankTransactionSchema=new mongoose.Schema({
    serviceCenterId:{type:String},
    serviceCenterName:{type:String},
    userId:{type:String},
    userName:{type:String},
    totalPay:{type:Number},
    // commission:{type:Number},
    paidAmount:{type:Number},
    // totalDue:{type:Number},
},{timestamps:true})

const BankTransactionModel=new mongoose.model("bankTransaction",bankTransactionSchema);

module.exports=BankTransactionModel;