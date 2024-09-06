const express=require("express");
const router=express.Router();
 
 const { addRecharge,getAllRecharge,getRechargeById,editRecharge,deleteRecharge}=require("../controllers/brandRechargeController")

router.post("/addRecharge",addRecharge );
router.get("/getAllRecharge",getAllRecharge );
router.get("/getRecharge/:id",getRechargeById );
router.patch("/editRecharge/:id",editRecharge );
router.delete("/deleteRecharge/:id",deleteRecharge );

module.exports=router;