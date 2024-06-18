
const ProductCategoryModel = require("../models/productCategory")

const addProductCategory = async (req, res) => {
   try {
      let body = req.body;
      let check = await ProductCategoryModel.findOne({ 
         categoryName: { 
            $regex: new RegExp('^' + body.categoryName.trim() + '$', 'i') 
         } 
      });

      if (check) {
         res.json({ status: false, msg: "Product Category already exists" });
      } else {
         let data = new ProductCategoryModel(body);
         await data.save();
         res.json({ status: true, msg: "Product Category Added" });
      }
   } catch (err) {
      res.status(400).send(err);
   }
};

 





const getAllProductCategory = async (req, res) => {
   try {
      let data = await ProductCategoryModel.find({}).sort({ _id: -1 });
      res.send(data);
   } catch (err) {
      res.status(400).send(err);
   }
}
const getProductCategoryById = async (req, res) => {
   try {
      let _id = req.params.id;
      let data = await ProductCategoryModel.findById(_id);
      res.send(data);
   } catch (err) {
      res.status(400).send(err);
   }
}

const editProductCategory = async (req, res) => {
   try {
      let _id = req.params.id;
      let body = req.body;
      let data = await ProductCategoryModel.findByIdAndUpdate(_id, body);
      res.json({ status: true, msg: "Product Updated" });
   } catch (err) {
      res.status(500).send(err);
   }
}
const deleteProductCategory = async (req, res) => {
   try {
      let _id = req.params.id;
      let data = await ProductCategoryModel.findByIdAndDelete(_id);
      res.json({ status: true, msg: "Product Deteled" });
   } catch (err) {
      res.status(500).send(err);
   }
}

module.exports = { addProductCategory, getAllProductCategory, getProductCategoryById, editProductCategory, deleteProductCategory };

