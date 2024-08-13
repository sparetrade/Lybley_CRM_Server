const ProductWarrantyModal =require("../models/productWarranty")

const addProductWarranty  = async (req, res) => {
  
        try{
            let body=req.body;
            let data=new ProductWarrantyModal(body);
            await data.save();
            res.json({status:true,msg:"ProductWarranty   Added"});
        }catch(err){
            res.status(400).send(err);
        }
 
};

const getAllProductWarranty=async(req,res)=>{
    try{
        let data=await ProductWarrantyModal.find({}).sort({ _id: -1 });
        res.send(data);
     }catch(err){
        res.status(400).send(err);
     }
}
const getProductWarrantyById=async(req,res)=>{
    try{
        let _id=req.params.id;
        let data=await ProductWarrantyModal.findById(_id);
        res.send(data);
     }catch(err){
        res.status(400).send(err);
     }
}

const editProductWarranty=async (req,res)=>{
    try{
        let _id=req.params.id;
        let body=req.body;
        let data=await ProductWarrantyModal.findByIdAndUpdate(_id,body);
        res.json({status:true,msg:"Complaint Nature Updated"});
     }catch(err){
        res.status(500).send(err);
     }
}
 const deleteProductWarranty=async(req,res)=>{
    try{
        let _id=req.params.id;
        let data=await ProductWarrantyModal.findByIdAndDelete(_id);
        res.json({status:true,msg:"Complaint Nature Deteled"});
     }catch(err){
        res.status(500).send(err);
     }
 }

module.exports = { addProductWarranty,getAllProductWarranty,getProductWarrantyById,editProductWarranty,deleteProductWarranty };
