const express = require("express")

const {addOrder, getAllOrder, getOrderById, editOrder, deleteOrder}=require("../controllers/orderController")

const router=express.Router()

router.post("/addOrder",addOrder)
router.get("/getAllOrder",getAllOrder)
router.get("/getOrderById/:id",getOrderById)
router.patch("/editOrder/:id",editOrder)
router.delete("/deleteOrder/:id",deleteOrder)

module.exports=router