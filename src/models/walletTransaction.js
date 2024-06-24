const mongoose=require("mongoose");

const walletTransactionSchema=new mongoose.Schema({
    userId:{type:String},
    userName:{type:String},
    addedAmount:{type:Number},
},{timestamps:true})

const WalletModel=new mongoose.model("walletTransaction",walletTransactionSchema);

module.exports=WalletModel;