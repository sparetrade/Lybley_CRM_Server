
const express=require("express");
const router= new express.Router();
const Razorpay=require("razorpay");
const crypto=require("crypto");
 
const {UserModel}=require("../models/registration");
const Notification=require("../models/notification");
 
const { default: axios } = require("axios");
const WalletModel=require("../models/walletTransaction");
 
const fs=require("fs");
require("dotenv");
router.post("/walletPayment",async(req,res)=>{
    try{
     const pay=await instance.orders.create({
       amount: (+req.body.amount)*100,
       currency: "INR",
     });
     res.send(pay);
    }catch(err){
         res.status(400).send(err);
    }
  });
  
//   router.post("/paymentVerificationForWallet",async(req,res)=>{
//     const {razorpay_order_id,razorpay_payment_id,razorpay_signature,amount,_id}=req.body.response;
//     const body=razorpay_order_id + "|" + razorpay_payment_id;
//     const expectedSignature=crypto.createHmac('sha256',process.env.RAZORPAY_KEY_SECRET).update(body.toString()).digest("hex");
//     const isAuthentic=expectedSignature===razorpay_signature;
//     if(isAuthentic){
//       try{
//        let user=await UserModel.findById(_id);
//        user.wallet += +amount;
//        await user.save();
//        res.json({status:true,msg:"Added to wallet"});
//        let transaction=new WalletModel({userId:_id,userName:user.name,addedAmount:amount});
//        await transaction.save();
//       }catch(err){
//         res.status(400).send(err);
//       }
//     }else{
//       res.status(401).send("Not Authorized");
//     }
//   });
  
  
//   router.get("/getWalletTransaction/:id", async (req, res) => {
//     try {
//         let id=req.params.id;
//         let data = await WalletModel.find({userId:id});
//         res.send(data);
//     } catch (err) {
//         res.status(500).send(err);
//     }
//   });
  
//   router.post("/brandDuePayment",async(req,res)=>{
//         try{
//         let body=req.body;
//         let response = await axios.post("https://api.razorpay.com/v1/payouts",body,{headers:{Authorization:"Basic " +new Buffer.from(process.env.RAZORPAYX_KEY_ID + ":" +process.env.RAZORPAYX_KEY_SECRET ).toString("base64")}});
//         let {data}=response;
//         res.send(data);
//         }catch(err){
//          res.status(400).send(err); 
//         }
//   });

  module.exports=router;