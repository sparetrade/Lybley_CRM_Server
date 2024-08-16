

const express=require("express");
const router=express.Router();
 
const {addProductWarranty,activateWarranty,getAllProductWarranty,getProductWarrantyById,editProductWarranty,deleteProductWarranty }=require("../controllers/productWarrantyController")

router.post("/addProductWarranty",addProductWarranty );
router.post("/activateWarranty",activateWarranty );
router.get("/getAllProductWarranty",getAllProductWarranty );
router.get("/getProductWarranty/:id",getProductWarrantyById );
router.patch("/editProductWarranty/:id",editProductWarranty );
router.delete("/deleteProductWarranty/:id",deleteProductWarranty );
module.exports=router;