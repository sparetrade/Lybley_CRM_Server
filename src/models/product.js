const mongoose = require("mongoose");
 

function generateAlphanumericId(length) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            result += chars[randomIndex];
      }
      return result;
}

const productSchema = new mongoose.Schema({
      shortId: {
            type: String,
            default: () => generateAlphanumericId(6),
            unique: true
          },
      productName: { type: String, required: true },
      productDescription: { type: String, required: true },
      categoryName: { type: String, required: true },
      userId: { type: String },
      userName: { type: String },
      modelNo: { type: String },
      serialNo: { type: String },
      purchaseDate: { type: String },
      categoryId: { type: String },
      sku: { type: String },
      applicableParts: { type: String },
      adminId: { type: String },
      brandId: { type: String },
      productBrand: { type: String },
      warrantyYears: { type: String },
      warrantyStatus: { type: Boolean },
      status: { type: String, default: "ACTIVE" }

}, { timestamps: true });

const ProductModel = new mongoose.model("Product", productSchema);
module.exports = ProductModel;