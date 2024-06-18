const express = require("express")

const {addNotification, getAllNotification, getNotificationById, editNotification, deleteNotification}=require("../controllers/notificationController")

const router=express.Router()

router.post("/addNotification",addNotification)
router.get("/getAllNotification",getAllNotification)
router.get("/getNotificationById/:id",getNotificationById)
router.patch("/editNotification/:id",editNotification)
router.delete("/deleteNotification/:id",deleteNotification)

module.exports=router