const express=require("express");
const router = express.Router();
const {getProfileById,adminLoginController,brandRegistration,serviceRegistration,empolyeeRegistration,dealerRegistration, adminRegistration,userRegistration,
  getAllBrand,getBrandById,editBrand,deleteBrand,getAllServiceCenter,getServiceCenterById,editServiceCenter,deleteServiceCenter,
getAllEmployee,getEmployeeById,editEmployee,deleteEmployee ,getAllDealer,getDealerById,editDealer,deleteDealer,getAllUser,
getUserById,editUser,deleteUser,otpVerification,otpVerificationSending,forgetPassword,mobileEmailVerification,
otpSending}=require("../controllers/registrationController")
const RegistrationModel=require("../models/registration");

 
router.post("/registration", adminRegistration
);

router.post("/brandRegistration", brandRegistration
);
router.post("/serviceRegistration", serviceRegistration
);
router.post("/employeeRegistration", empolyeeRegistration
);
router.post("/dealerRegistration", dealerRegistration
);
router.post("/userRegistration", userRegistration
); 

router.post("/login",adminLoginController )
router.get("/getAllBrand",getAllBrand )
router.get("/getBrandBy/:id",getBrandById )
router.patch("/editBrand/:id",editBrand )
router.delete("/deleteBrand/:id",deleteBrand )
 
router.get("/getProfileById/:id",getProfileById )


router.get("/getAllService",getAllServiceCenter )
router.get("/getServiceBy/:id",getServiceCenterById )
router.patch("/editService/:id",editServiceCenter )
router.delete("/deleteService/:id",deleteServiceCenter )

router.get("/getAllEmployee",getAllEmployee )
router.get("/getEmployeeBy/:id",getEmployeeById )
router.patch("/editEmployee/:id",editEmployee )
router.delete("/deleteEmployee/:id",deleteEmployee )

router.get("/getAllDealer",getAllDealer )
router.get("/getDealerBy/:id",getDealerById )
router.patch("/editDealer/:id",editDealer )
router.delete("/deleteDealer/:id",deleteDealer )

router.get("/getAllUser",getAllUser )
router.get("/getUserBy/:id",getUserById )
router.patch("/editUser/:id",editUser )
router.delete("/deleteUser/:id",deleteUser )


 
router.get("/getAllBrand",getAllBrand);

router.get("/getAllUser",async(req,res)=>{
    try{
      const data=await RegistrationModel.find({});
      res.send(data);
    }catch(err){
      res.status(400).send(err);
    }
});

 

router.patch("/editBrandBy/:id",async(req,res)=>{
  try{
    const body=req.body;
    let _id=req.params.id; 
    const data=await RegistrationModel.findByIdAndUpdate(_id,body);
    res.json({status:true,msg:"Updated"});
  }catch(err){
    res.status(500).send(err);
  }
});

 
router.delete("/deleteBrandBy/:id",async(req,res)=>{
  try{
    let _id=req.params.id; 
    const data=await RegistrationModel.findByIdAndDelete(_id);
    res.json({status:true,msg:"Delete"});
  }catch(err){
    res.status(500).send(err);
  }
});


router.post("/sendOtp",otpSending);
router.post("/otpVerification",otpVerification);
router.post("/mobileEmailSendOtp",otpVerificationSending);
router.post("/mobileEmailOtpVerification",mobileEmailVerification);

router.patch("/forgetPassword",forgetPassword )
 
module.exports=router;