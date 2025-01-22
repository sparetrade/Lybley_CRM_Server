

const express=require("express");
const router=express.Router();
 
const {addProductWarranty,activateWarranty,getAllProductWarranty,editActivationWarranty,getAllProductWarrantyWithPage, getAllProductWarrantyByIdWithPage,getAllProductWarrantyByBrandIdTotal,getAllProductWarrantyById,getActivationWarrantyById,getAllActivationWarranty,getProductWarrantyByUniqueId,getProductWarrantyById,editProductWarranty,deleteProductWarranty }=require("../controllers/productWarrantyController")

router.post("/addProductWarranty",addProductWarranty );
router.post("/activateWarranty",activateWarranty );
router.get("/getAllProductWarranty",getAllProductWarranty );
router.get("/getAllProductWarrantyWithPage",getAllProductWarrantyWithPage );
router.get("/getAllProductWarrantyByIdWithPage/:id",getAllProductWarrantyByIdWithPage );
router.get("/getAllProductWarrantyById/:id",getAllProductWarrantyById );
router.get("/getAllProductWarrantyByBrandIdTotal/:id",getAllProductWarrantyByBrandIdTotal );
router.get("/getAllActivationWarranty",getAllActivationWarranty );
router.get("/getActivationWarrantyById/:id",getActivationWarrantyById );
router.get("/getProductWarranty/:id",getProductWarrantyById );
router.get("/getProductWarrantyByUniqueId/:id",getProductWarrantyByUniqueId );
router.patch("/editProductWarranty/:id",editProductWarranty );
router.patch("/editActivationWarranty/",editActivationWarranty );
router.delete("/deleteProductWarranty/:id",deleteProductWarranty );
module.exports=router;