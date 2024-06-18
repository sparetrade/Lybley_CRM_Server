const express = require("express")

const {addComplaint,getAllComplaint,getComplaintById,editComplaint,deleteComplaint,updateComplaint}=require("../controllers/complaintController")
const {upload}  = require("../services/service");
const router=express.Router()

// router.post("/createComplaint", upload.single("issueImages"), addComplaint);
router.post("/createComplaint",  addComplaint);
router.get("/getAllComplaint",getAllComplaint)
router.get("/getComplaintById/:id",getComplaintById)
router.patch("/editComplaint/:id",editComplaint)
router.delete("/deleteComplaint/:id",deleteComplaint)
router.patch("/updateComplaint/:id",updateComplaint )

module.exports=router