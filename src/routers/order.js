const express = require("express")

const {addOrder,addDefectiveOrder, getAllOrder,getAllOrderById, getOrderById, editOrder, deleteOrder}=require("../controllers/orderController")

const router=express.Router()

router.post("/addOrder",addOrder)
router.post("/addDefectiveOrder",addDefectiveOrder)
router.get("/getAllOrder",getAllOrder)
router.get("/getAllOrderById",getAllOrderById)
router.get("/getOrderById/:id",getOrderById)
router.patch("/editOrder/:id",editOrder)
router.delete("/deleteOrder/:id",deleteOrder)

module.exports=router