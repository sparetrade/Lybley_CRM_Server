

const express=require("express");
const router=express.Router();
 
const {addProductWarranty,activateWarranty,getAllProductWarranty,getActivationWarrantyById,getAllActivationWarranty,getProductWarrantyByUniqueId,getProductWarrantyById,editProductWarranty,deleteProductWarranty }=require("../controllers/productWarrantyController")

router.post("/addProductWarranty",addProductWarranty );
router.post("/activateWarranty",activateWarranty );
router.get("/getAllProductWarranty",getAllProductWarranty );
router.get("/getAllActivationWarranty",getAllActivationWarranty );
router.get("/getActivationWarrantyById/:id",getActivationWarrantyById );
router.get("/getProductWarranty/:id",getProductWarrantyById );
router.get("/getProductWarrantyByUniqueId/:id",getProductWarrantyByUniqueId );
router.patch("/editProductWarranty/:id",editProductWarranty );
router.delete("/deleteProductWarranty/:id",deleteProductWarranty );
module.exports=router;