const ProductWarrantyModal = require("../models/productWarranty")
const { UserModel } = require('../models/registration');
const QRCode = require('qrcode');
const mongoose = require('mongoose');


// const generateUniqueId = async () => {
//   let isUnique = false;
//   let uniqueId;

//   while (!isUnique) {
//     uniqueId = Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit number

//     // Check if this uniqueId already exists in the database
//     const existingRecord = await ProductWarrantyModal.findOne({ productId: uniqueId });

//     if (!existingRecord) {
//       isUnique = true;
//     }
//   }

//   return uniqueId;
// };

// TEN2520241024002
// const addProductWarranty = async (req, res) => {
//     try {
//       const { 
//         productName, productId, categoryId,  categoryName, 
//           year, numberOfGenerate, batchNo, warrantyInDays, brandName, brandId , 
//       } = req.body;
// //   console.log(req.body);

//       const numberOfRecords = +numberOfGenerate; // Number of records to create

//       // Validate input
//     //   if (!productName || !productId || !categoryCode || ! || !brandId,brandName,categoryName || !brandName || !brandId) {
//     //     return res.status(400).json({ status: false, msg: 'Missing required fields' });
//     //   }

//       // Generate multiple records with unique QR codes
//       const records = [];
//       for (let i = 0; i < numberOfRecords; i++) {
//         const uniqueId = await generateUniqueId();  
//         const qrCodeData = uniqueId;

//         try {

//         //   const qrCodeUrl1 = `https://crm.servsy.in/warranty?productId=${productId}&uniqueId=${uniqueId}`;
//           const qrCodeUrl1 = `https://crm.servsy.in/warrantyActivation?uniqueId=${uniqueId}`;

//           // Generate QR code with the URL
//         //   const qrCodeDataUrl = await QRCode.toDataURL(qrCodeUrl);
//           const qrCodeUrl = await QRCode.toDataURL(qrCodeUrl1);

//           // Create a new record with the QR code and additional fields
//           records.push({
//             productName,
//             productId,
//             productId  ,
//             categoryId,

//             brandId,brandName,categoryName,
//             uniqueId,
//             year,
//             batchNo,
//             warrantyInDays,
//             qrCodes: [{ qrCodeUrl, index: i + 1 }], // Add QR code URL and index
//           });
//         } catch (qrError) {
//           console.error(`Error generating QR code for ${uniqueId}:`, qrError);
//           // Handle QR code generation error
//         }
//       }

//       if (records.length === 0) {
//         return res.status(500).json({ status: false, msg: 'No records were created due to QR code generation errors' });
//       }

//       // Create metadata document with all records included
//       const metadata = new ProductWarrantyModal({
//         brandName,
//         brandId,
//         productName,
//         numberOfGenerate,
//         warrantyInDays,
//         year,
//         id: new mongoose.Types.ObjectId(), // Use a new unique ID for this metadata document
//         records,
//       });

//       // Save metadata
//       const savedMetadata = await metadata.save();

//       // Construct response data
//       const responseData = {
//         brandName,
//         brandId,
//         productName,
//         numberOfGenerate,
//         warrantyInDays,
//         year,
//         id: savedMetadata.id,
//         records: savedMetadata.records,
//       };

//       res.status(201).json({
//         status: true,
//         msg: 'Warranty Created',
//         data: responseData,
//       });
//     } catch (error) {
//       // Handle errors
//       if (error.name === 'ValidationError') {
//         return res.status(400).json({ status: false, msg: error.message });
//       }
//       res.status(500).json({ status: false, msg: error.message });
//     }
//   };
// const addProductWarranty = async (req, res) => {
//   try {
//     const { 
//       productName, productId, categoryId, categoryName, 
//       year, numberOfGenerate, batchNo, warrantyInDays, brandName, brandId
//     } = req.body;

//     const numberOfRecords = +numberOfGenerate; // Number of records to create

//     // Fetch all existing uniqueIds to ensure uniqueness in one go
//     const existingUniqueIds = new Set(
//       (await ProductWarrantyModal.find({}, 'records.uniqueId')).map(record => record.uniqueId)
//     );

//     const records = [];
//     const promises = [];

//     for (let i = 0; i < numberOfRecords; i++) {
//       promises.push(generateUniqueRecord(existingUniqueIds, i, req.body));
//     }

//     const generatedRecords = await Promise.all(promises);

//     if (generatedRecords.length === 0) {
//       return res.status(500).json({ status: false, msg: 'No records were created due to errors' });
//     }

//     // Create metadata document with all records
//     const metadata = new ProductWarrantyModal({
//       brandName,
//       brandId,
//       productName,
//       numberOfGenerate,
//       warrantyInDays,
//       year,
//       id: new mongoose.Types.ObjectId(),
//       records: generatedRecords,
//     });

//     const savedMetadata = await metadata.save();

//     res.status(201).json({
//       status: true,
//       msg: 'Warranty Created',
//       data: {
//         brandName,
//         brandId,
//         productName,
//         numberOfGenerate,
//         warrantyInDays,
//         year,
//         id: savedMetadata.id,
//         records: savedMetadata.records,
//       },
//     });
//   } catch (error) {
//     if (error.name === 'ValidationError') {
//       return res.status(400).json({ status: false, msg: error.message });
//     }
//     res.status(500).json({ status: false, msg: error.message });
//   }
// };

const addProductWarranty = async (req, res) => {
  try {
    const {
      productName, productId, categoryId, categoryName,
      year, numberOfGenerate, batchNo, warrantyInDays, brandName, brandId
    } = req.body;

    const numberOfRecords = +numberOfGenerate;
    const records = [];
    const promises = [];

    for (let i = 0; i < numberOfRecords; i++) {
      promises.push(generateUniqueRecord(i, req.body));
    }

    const generatedRecords = await Promise.all(promises);

    if (generatedRecords.length === 0) {
      return res.status(500).json({ status: false, msg: 'No records were created due to errors' });
    }

    // Create metadata document with all records
    const metadata = new ProductWarrantyModal({
      brandName,
      brandId,
      productName,
      numberOfGenerate,
      warrantyInDays,
      year,
      id: new mongoose.Types.ObjectId(),
      records: generatedRecords,
    });

    const savedMetadata = await metadata.save();

    res.status(201).json({
      status: true,
      msg: 'Warranty Created',
      data: {
        brandName,
        brandId,
        productName,
        numberOfGenerate,
        warrantyInDays,
        year,
        id: savedMetadata.id,
        records: savedMetadata.records,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ status: false, msg: 'Duplicate uniqueId found' });
    }
    res.status(500).json({ status: false, msg: error.message });
  }
};

// Helper function to generate a unique record with retry logic
const generateUniqueRecord = async (index, data) => {
  let uniqueId;
  let qrCodeUrl;

  // Retry logic to handle duplicate key errors
  for (let retry = 0; retry < 5; retry++) {
    try {
      uniqueId = await generateUniqueId();

      // Check once more before using this uniqueId if it already exists in the database
      const existingRecord = await ProductWarrantyModal.findOne({ 'records.uniqueId': uniqueId });
      if (existingRecord) {
        console.log(`Duplicate uniqueId detected: ${uniqueId}, retrying...`);
        continue; // Retry if this uniqueId already exists
      }

      const qrCodeUrl1 = `https://crm.servsy.in/warrantyActivation?uniqueId=${uniqueId}`;
      qrCodeUrl = await QRCode.toDataURL(qrCodeUrl1);
      break; // Exit loop if successful
    } catch (error) {
      if (error.code === 11000 && retry < 4) {
        console.log(`Duplicate uniqueId during insert: ${uniqueId}, retrying...`);
        continue;
      }
      throw error; // Rethrow error if it's not a duplicate key error or retries exceeded
    }
  }

  return {
    productName: data.productName,
    productId: data.productId,
    categoryId: data.categoryId,
    brandId: data.brandId,
    brandName: data.brandName,
    categoryName: data.categoryName,
    uniqueId,
    year: data.year,
    batchNo: data.batchNo,
    warrantyInDays: data.warrantyInDays,
    qrCodes: [{ qrCodeUrl, index: index + 1 }],
  };
};

// Generates a uniqueId and checks database for uniqueness
const generateUniqueId = async () => {
  let uniqueId;
  let isUnique = false;

  while (!isUnique) {
    uniqueId = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit number

    // Check if this uniqueId already exists in the database
    const existingRecord = await ProductWarrantyModal.findOne({ 'records.uniqueId': uniqueId });
    if (!existingRecord) {
      isUnique = true;
    }
  }

  return uniqueId;
};






const activateWarranty = async (req, res) => {
  try {
    const { name, contact, email, address, lat, long, pincode, district, state, password, uniqueId } = req.body;

    if (!name || !contact || !address || !uniqueId) {
      return res.status(400).json({ status: false, msg: 'Missing required fields' });
    }

    // Check if the user already exists
    let user = await UserModel.findOne({ email });
    if (!user) {
      // Hash the password and create a new user

      user = new UserModel({
        _id,
        name,
        contact,
        email,
        address,
        password,
        lat, long, pincode
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
    lat, long, pincode,
      // Activate the warranty
      record.isActivated = true;
    record.userName = name;
    record.userId = user._id;
    record.email = email;
    record.contact = contact;
    record.address = address;
    record.lat = lat;
    record.long = long;
    record.district = district;
    record.state = state;
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




const getAllProductWarranty = async (req, res) => {
  try {
    let data = await ProductWarrantyModal.find({}).sort({ _id: -1 });
    res.send(data);
  } catch (err) {
    res.status(400).send(err);
  }
}

const getAllProductWarrantyById = async (req, res) => {
 
    try {
      const { id: brandId } = req.params;
  
      const warranties = await ProductWarrantyModal.aggregate([
        { $match: { brandId } }, // Filter by brandId
        { $sort: { _id: -1 } }, // Sort by _id in descending order
        { $project: { warrantyField1: 1, warrantyField2: 1, _id: 1 } } // Only include necessary fields
      ]);
  
      if (warranties.length === 0) {
        return res.status(404).send({ error: "No warranties found for this brand" });
      }
  
      res.status(200).send(warranties);
    } catch (err) {
      res.status(400).send({ error: "Error fetching product warranties", details: err.message });
    }
  };
  

const getAllProductWarrantyByBrandIdTotal = async (req, res) => {
  try {
    const { id } = req.params; // Get brandId from the URL params
    // console.log("brandId:", brandId);
    const brandId = id;
    // Find warranties matching the brandId
    const result = await ProductWarrantyModal.aggregate([
      { $match: { brandId } }, // Match documents with the specific brandId
      { $group: { _id: null, totalNumberOfGenerate: { $sum: "$numberOfGenerate" } } } // Sum up the numberOfGenerate
    ]);

    // If no data is found, return 0
    const totalNumberOfGenerate = result.length > 0 ? result[0].totalNumberOfGenerate : 0;

    res.status(200).send({ totalNumberOfGenerate });
  } catch (err) {
    res.status(400).send({ error: "Error fetching total number of generate", details: err.message });
  }
}


const getAllActivationWarranty = async (req, res) => {
  try {
    const data = await ProductWarrantyModal.aggregate([
      { $unwind: "$records" }, // Deconstruct the records array
      { $match: { "records.isActivated": true } }, // Filter only activated records
      {
        $project: {
          _id: "$records._id",
          brandName: "$records.brandName",
          brandId: "$records.brandId",
          productName: "$records.productName",
          productId: "$records.productId",
          categoryId: "$records.categoryId",
          uniqueId: "$records.uniqueId",
          year: "$records.year",
          batchNo: "$records.batchNo",
          warrantyInDays: "$records.warrantyInDays",
          qrCodes: "$records.qrCodes",
          userId: "$records.userId",
          userName: "$records.userName",
          email: "$records.email",
          contact: "$records.contact",
          address: "$records.address",
          lat: "$records.lat",
          long: "$records.long",
          pincode: "$records.pincode",
          district: "$records.district",
          state: "$records.state",
          complaintId: "$records.complaintId",
          activationDate: "$records.activationDate",
        },
      },
      { $sort: { _id: -1 } },
    ]);

    res.send(data);
  } catch (err) {
    res.status(400).send(err);
  }
};


const getActivationWarrantyById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ message: 'Invalid ID format' });
    }

    // console.log("Requested ID:", id); // Debug log

    // Use the `new` keyword to instantiate ObjectId
    const objectId = new mongoose.Types.ObjectId(id);

    // Use aggregate to find the matching record
    const data = await ProductWarrantyModal.aggregate([
      {
        $unwind: "$records"  // Deconstruct the records array
      },
      {
        $match: { "records._id": objectId }  // Correct usage of ObjectId
      },
      {
        $project: {
          _id: "$records._id",
          brandName: "$records.brandName",
          brandId: "$records.brandId",
          productName: "$records.productName",
          productId: "$records.productId",
          categoryId: "$records.categoryId",
          uniqueId: "$records.uniqueId",
          year: "$records.year",
          batchNo: "$records.batchNo",
          warrantyInDays: "$records.warrantyInDays",
          qrCodes: "$records.qrCodes",
          userId: "$records.userId",
          userName: "$records.userName",
          email: "$records.email",
          contact: "$records.contact",
          address: "$records.address",
          lat: "$records.lat",
          long: "$records.long",
          pincode: "$records.pincode",
          district: "$records.district",
          state: "$records.state",
          complaintId: "$records.complaintId",
          activationDate: "$records.activationDate",
        },
      },
    ]);

    // Check if no data is found
    if (!data || data.length === 0) {
      return res.status(404).send({ message: 'Record not found' });
    }

    // Return the found record
    res.status(200).json(data[0]);
  } catch (error) {
    // Handle any errors
    console.error('Error fetching data:', error);
    res.status(500).send({ message: "Error fetching data", error: error.message });
  }
};







const getProductWarrantyById = async (req, res) => {
  try {
    let _id = req.params.id;
    let data = await ProductWarrantyModal.findById(_id);
    res.send(data);
  } catch (err) {
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


const editProductWarranty = async (req, res) => {
  try {
    let _id = req.params.id;
    let body = req.body;
    let data = await ProductWarrantyModal.findByIdAndUpdate(_id, body);
    res.json({ status: true, msg: "Product warranty Updated" });
  } catch (err) {
    res.status(500).send(err);
  }
}
const deleteProductWarranty = async (req, res) => {
  try {
    let _id = req.params.id;
    let data = await ProductWarrantyModal.findByIdAndDelete(_id);
    res.json({ status: true, msg: "Product warranty Deteled" });
  } catch (err) {
    res.status(500).send(err);
  }
}

module.exports = { addProductWarranty, activateWarranty, getAllProductWarranty, getAllProductWarrantyByBrandIdTotal, getAllProductWarrantyById, getAllActivationWarranty, getActivationWarrantyById, getProductWarrantyByUniqueId, getProductWarrantyById, editProductWarranty, deleteProductWarranty };
