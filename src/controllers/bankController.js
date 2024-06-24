 
const BankDetail=require("../models/bankDetails");

const addBankDetails=async(req,res)=>{
       try{
        let body=req.body;
        let bank=new BankDetail(body);
        let bank1=await bank.save();
        res.json({status:true,msg:"Bank Details Added"});
       }catch(err){
        console.log(err);
       }
};

const updateBankDetails=async(req,res)=>{
       try{
        let _id=req.params.id;
        let body=req.body;
        let bank=await BankDetail.findByIdAndUpdate(_id,body);
        res.json({status:true,msg:"Updated"})
       }catch(err){
        res.status(500).send(err);
       }
};

const bankDetailByBrand=async(req,res)=>{
      try{
        let brandId=req.params.id;
        let bank=await BankDetail.findOne({brandId:brandId});
        res.send(bank);
      }catch(err){
        res.status(400).send(err);
      }
};

module.exports = { addBankDetails,updateBankDetails,bankDetailByBrand };