const mongoose = require("mongoose");

const brandStockSchema = new mongoose.Schema({
   brandId: { type: String },
    brandName: { type: String },
    freshStock: { type: String, default: '0' },
    defectiveStock: { type: String, default: '0' },
    sparepartName:{ type: String },
    sparepartId:{ type: String },
    stock: [
        {
          fresh:{type:String },
          title:{type:String },
          createdAt: { type: Date, default: Date.now },
          updatedAt: { type: Date, default: Date.now },
        },
      ],
}, { timestamps: true })

const BrandStockModel = new mongoose.model("brandStock", brandStockSchema);

module.exports = BrandStockModel;