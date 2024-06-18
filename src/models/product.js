const mongoose=require("mongoose");

const productSchema=new mongoose.Schema({
      productName:{type:String,required:true},
      productDescription:{type:String,required:true},
      categoryName:{type:String,required:true},
      userId:{type:String },
      userName:{type:String },
      modelNo:{type:String },
      serialNo:{type:String },
      purchaseDate:{type:String },
      categoryId:{type:String },
      sku:{type:String },
      applicableParts:{type:String },
      adminId:{type:String },
      brandId:{type:String },
      productBrand:{type:String },
      warrantyStatus: { type: Boolean },
      status:{ type:String,default:"ACTIVE"}

},{timestamps:true});

const ProductModel=new mongoose.model("Product",productSchema);
module.exports=ProductModel;