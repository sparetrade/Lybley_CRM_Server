const express=require("express");
const router=new express.Router();
const BankDetail=require("../models/bankDetails");
const { addBankDetails,updateBankDetails,bankDetailByBrand }=require("../controllers/bankController")
router.post("/addBankDetails",addBankDetails );

router.patch("/editBankDetails/:id",updateBankDetails );

router.get("/bankDetailByUser/:id",bankDetailByBrand );

module.exports=router;