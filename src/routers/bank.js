const express=require("express");
const router=new express.Router();
const BankDetail=require("../models/bankDetails");
const { addBankDetails,updateBankDetails,bankDetailByBrand }=require("../controllers/bank")
router.post("/addBankDetails",addBankDetails );

router.patch("/updateBankDetails/:id",updateBankDetails );

router.get("/bankDetailByBrand/:id",bankDetailByBrand );

module.exports=router;