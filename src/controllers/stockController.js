const BrandStockModel =require("../models/brandStock")

const addStock = async (req, res) => {
   try {
       const { sparepartName } = req.body;

       // Check if the spare part name already exists
       const existingSparePart = await BrandStockModel.findOne({ sparepartName });
       if (existingSparePart) {
           return res.json({ status: false, msg: "Spare part name already exists in stocks" });
       }

       // If not, proceed to add the new spare part
       const data = new BrandStockModel(req.body);
       await data.save();
       res.json({ status: true, msg: "Stock Added" });
   } catch (err) {
       res.status(400).send(err);
   }
};


const getAllStock=async(req,res)=>{
    try{
        let data=await BrandStockModel.find({}).sort({ _id: -1 });
        res.send(data);
     }catch(err){
        res.status(400).send(err);
     }
}
const getStockById=async(req,res)=>{
    try{
        let _id=req.params.id;
        let data=await BrandStockModel.findById(_id);
        res.send(data);
     }catch(err){
        res.status(400).send(err);
     }
}

const editStock=async (req,res)=>{
    try{
        let _id=req.params.id;
        let body=req.body;
        let data=await BrandStockModel.findByIdAndUpdate(_id,body);
        res.json({status:true,msg:"Stock Updated"});
     }catch(err){
        res.status(500).send(err);
     }
}
 const deleteStock=async(req,res)=>{
    try{
        let _id=req.params.id;
        let data=await BrandStockModel.findByIdAndDelete(_id);
        res.json({status:true,msg:"Stock Deteled"});
     }catch(err){
        res.status(500).send(err);
     }
 }

module.exports = { addStock,getAllStock,getStockById,editStock,deleteStock };
