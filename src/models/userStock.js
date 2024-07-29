const mongoose = require("mongoose");

const userStockSchema = new mongoose.Schema({
   serviceCenterId: { type: String },
   serviceCenterName: { type: String },
   sparepartName: { type: String },
   sparepartId: { type: String },
   freshStock: { type: String, default: '0' },
   defectiveStock: { type: String, default: '0' },
    // sparepart:{ type: String },
}, { timestamps: true })

const UserStockModel = new mongoose.model("userStock", userStockSchema);

module.exports = UserStockModel;