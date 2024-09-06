const ProductWarrantyModal =require("../models/productWarranty")
const {UserModel } = require('../models/registration');
const QRCode = require('qrcode');
const mongoose = require('mongoose');


const generateUniqueId = async () => {
  let isUnique = false;
  let uniqueId;

  while (!isUnique) {
    uniqueId = Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit number

    // Check if this uniqueId already exists in the database
    const existingRecord = await ProductWarrantyModal.findOne({ productId: uniqueId });

    if (!existingRecord) {
      isUnique = true;
    }
  }

  return uniqueId;
};

   
const addProductWarranty = async (req, res) => {
    try {
      const { 
        productName, productId, categoryId,  categoryName, 
          year, numberOfGenerate, batchNo, warrantyInDays, brandName, brandId , 
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
        const uniqueId = await generateUniqueId();  
        const qrCodeData = uniqueId;
  
        try {
           
        //   const qrCodeUrl1 = `https://crm.servsy.in/warranty?productId=${productId}&uniqueId=${uniqueId}`;
          const qrCodeUrl1 = `https://crm.servsy.in/warrantyActivation?uniqueId=${uniqueId}`;

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
            uniqueId,
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
  const activateWarranty = async (req, res) => {
    try {
      const { name, contact, email, address,lat,long,pincode , password, uniqueId } = req.body;
  
      if (!name || !contact || !email || !address || !password || !uniqueId) {
        return res.status(400).json({ status: false, msg: 'Missing required fields' });
      }
  
      // Check if the user already exists
      let user = await UserModel.findOne({ email });
      if (!user) {
        // Hash the password and create a new user
        
        user = new UserModel({
          name,
          contact,
          email,
          address,
          password ,
          lat,long,pincode 
        });
        await user.save();
      }
  
      // Find the warranty record based on the unique ID
      const warranty = await ProductWarrantyModal.findOne({ 'records.uniqueId': uniqueId });
      if (!warranty) {
        return res.status(404).json({ status: false, msg: 'Warranty not found' });
      }
  
      // Find the specific record with the matching uniqueId
      const record = warranty.records.find(record => record.uniqueId === uniqueId);
      if (!record) {
        return res.status(404).json({ status: false, msg: 'Warranty record not found' });
      }
  
      // Check if the warranty has already been activated
      if (record.isActivated) {
        return res.status(400).json({ status: false, msg: 'This warranty has already been activated' });
      }
      lat,long,pincode ,
      // Activate the warranty
      record.isActivated = true;
      record.userName =name;  
      record.email = email;  
      record.contact = contact;  
      record.address = address;  
      record.lat = lat;  
      record.long = long;  
      record.pincode = pincode;  
      record.activationDate = new Date();
  
      // Save the updated warranty
      await warranty.save();
  
      res.status(200).json({
        status: true,
        msg: 'Warranty activated successfully',
        data: record, // Return only the activated record
      });
    } catch (error) {
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
const getProductWarrantyByUniqueId = async (req, res) => {
  try {
    const uniqueId = req.params.id;   
    // console.log("Searching for uniqueId:", uniqueId);
    
    // Search for a document where the `uniqueId` exists in the `records` array
    const data = await ProductWarrantyModal.findOne({ 
      'records.uniqueId': uniqueId 
    });  
    
    if (!data) {
      return res.status(404).send({ message: "Product warranty not found" });
    }

    res.send(data);
  } catch (err) {
    console.error("Error:", err);
    res.status(400).send({ error: err.message });
  }
};


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

module.exports = { addProductWarranty,activateWarranty,getAllProductWarranty,getProductWarrantyByUniqueId,getProductWarrantyById,editProductWarranty,deleteProductWarranty };
