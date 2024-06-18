const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const moment = require('moment');
const ComplaintModal = require("../models/complaint");

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

router.post('/bulkServiceRequests', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const filePath = req.file.path;

  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const results = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    // Define expected headers and map them to MongoDB schema fields
    const expectedHeaders = [
      "productName", "categoryName", "productBrand", "modelNo", "serialNo", 
      "purchaseDate", "warrantyStatus", "issueType", "detailedDescription", 
      "issueImages", "errorMessages", "preferredServiceDate", 
      "preferredServiceTime", "serviceLocation", "fullName", 
      "phoneNumber", "emailAddress", "alternateContactInfo", "serviceAddress"
    ];

    // Map data to match the expected headers and convert necessary fields
    const mappedResults = results.slice(1).map(row => {
      let rowData = {};
      expectedHeaders.forEach((header, index) => {
        if (header === "purchaseDate" || header === "preferredServiceDate") {
          // Convert date fields to Date objects using moment
          rowData[header] = row[index] ? moment(row[index], ["MM-DD-YYYY", "YYYY-MM-DD", "DD-MM-YYYY"]).toDate() : null;
          if (!moment(row[index], ["MM-DD-YYYY", "YYYY-MM-DD", "DD-MM-YYYY"], true).isValid()) {
            rowData[header] = null;
          }
        } else {
          rowData[header] = row[index] || null;
        }
      });
      return rowData;
    });

    // Insert mapped data into MongoDB
    ComplaintModal.insertMany(mappedResults)
      .then(() => {
        res.send({status:true,msg:'Excel data successfully uploaded and saved to DataBase!'});
      })
      .catch((error) => {
        console.error({status:false,msg:'Error saving data to MongoDB:'}, error);
        res.status(500).send({status:false,msg:'Error saving data to MongoDB.'});
      })
      .finally(() => {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.error('Error deleting the file:', err);
        }
      });
  } catch (error) {
    console.error('Error reading the Excel file:', error);
    res.status(500).send('Error reading the Excel file.');
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error('Error deleting the file:', err);
    }
  }
});

module.exports = router;
