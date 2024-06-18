const express = require("express")

const {addFeedback, getAllFeedback, getFeedbackById, editFeedback, deleteFeedback}=require("../controllers/feedbackController")

const router=express.Router()

router.post("/addFeedback",addFeedback)
router.get("/getAllFeedback",getAllFeedback)
router.get("/getFeedbackById/:id",getFeedbackById)
router.patch("/editFeedback/:id",editFeedback)
router.delete("/deleteFeedback/:id",deleteFeedback)

module.exports=router