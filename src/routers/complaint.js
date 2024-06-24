const express = require("express")

const {addComplaint,getAllComplaint,getComplaintById,editIssueImage ,editComplaint,deleteComplaint,updateComplaint}=require("../controllers/complaintController")
const {upload}  = require("../services/service");
const router=express.Router()

router.post("/createComplaint",upload().single("issueImages")  , addComplaint);
// router.post("/createComplaint",  addComplaint);
router.get("/getAllComplaint",getAllComplaint)
router.get("/getComplaintById/:id",getComplaintById)
router.patch("/editImage/:id", upload().single("issueImages"),editIssueImage );
router.patch("/editComplaint/:id",editComplaint)
router.delete("/deleteComplaint/:id",deleteComplaint)
router.patch("/updateComplaint/:id",updateComplaint )

// router.post('/createComplaint', upload().array('images'), async (req, res) => {
//     try {
//       let body = req.body;
//       let files = req.files;
//       let images = files.map(file => file.location);
//       let obj = new SparePartModal({ ...body, images });
//       let data = await obj.save();
//       res.json({ status: true, msg: "Spare part added successfully", data });
//     } catch (err) {
//       res.status(400).send(err);
//     }
//   });
module.exports=router