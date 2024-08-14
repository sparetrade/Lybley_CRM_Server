const ProductWarrantyModal =require("../models/productWarranty")
const QRCode = require('qrcode');
const mongoose = require('mongoose');
 
   
const addProductWarranty = async (req, res) => {
    try {
      const { 
        productName, productId, categoryId,  categoryName, 
          year, numberOfGenerate, batchNo, warrantyInDays, brandName, brandId 
      } = req.body;
//   console.log(req.body);
  
      const numberOfRecords = +numberOfGenerate; // Number of records to create
  
      // Validate input
    //   if (!productName || !productId || !categoryCode || ! || !brandId,brandName,categoryName || !brandName || !brandId) {
    //     return res.status(400).json({ status: false, msg: 'Missing required fields' });
    //   }
  
      // Generate multiple records with unique QR codes
      const records = [];
      for (let i = 0; i < numberOfRecords; i++) {
        const uniqueId = `${productId}-${i + 1}`;  
        const qrCodeData = uniqueId;
  
        try {
           
        //   const qrCodeUrl1 = `https://crm.servsy.in/warranty?productId=${productId}&uniqueId=${uniqueId}`;
          const qrCodeUrl1 = `https://crm.servsy.in`;

          // Generate QR code with the URL
        //   const qrCodeDataUrl = await QRCode.toDataURL(qrCodeUrl);
          const qrCodeUrl = await QRCode.toDataURL(qrCodeUrl1);
  
          // Create a new record with the QR code and additional fields
          records.push({
            productName,
            productId,
            productId  ,
            categoryId,
           
            brandId,brandName,categoryName,
            
            year,
            batchNo,
            warrantyInDays,
            qrCodes: [{ qrCodeUrl, index: i + 1 }], // Add QR code URL and index
          });
        } catch (qrError) {
          console.error(`Error generating QR code for ${uniqueId}:`, qrError);
          // Handle QR code generation error
        }
      }
  
      if (records.length === 0) {
        return res.status(500).json({ status: false, msg: 'No records were created due to QR code generation errors' });
      }
  
      // Create metadata document with all records included
      const metadata = new ProductWarrantyModal({
        brandName,
        brandId,
        productName,
        numberOfGenerate,
        warrantyInDays,
        year,
        id: new mongoose.Types.ObjectId(), // Use a new unique ID for this metadata document
        records,
      });
  
      // Save metadata
      const savedMetadata = await metadata.save();
  
      // Construct response data
      const responseData = {
        brandName,
        brandId,
        productName,
        numberOfGenerate,
        warrantyInDays,
        year,
        id: savedMetadata.id,
        records: savedMetadata.records,
      };
  
      res.status(201).json({
        status: true,
        msg: 'Warranty Created',
        data: responseData,
      });
    } catch (error) {
      // Handle errors
      if (error.name === 'ValidationError') {
        return res.status(400).json({ status: false, msg: error.message });
      }
      res.status(500).json({ status: false, msg: error.message });
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
