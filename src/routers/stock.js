const express = require("express")

const {addStock,getAllStock,getStockById,editStock,deleteStock}=require("../controllers/stockController")

const router=express.Router()

router.post("/addStock",addStock)
router.get("/getAllStock",getAllStock)
router.get("/getStockById/:id",getStockById)
router.patch("/editStock/:id",editStock)
router.delete("/deleteStock/:id",deleteStock)

module.exports=router;