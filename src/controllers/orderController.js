const OrderModel = require("../models/order")
const BrandStockModel = require("../models/brandStock")
const UserStockModel = require("../models/userStock")

// const addOrder = async (req, res) => {

//     try {
//         let body = req.body;
//         let data = new OrderModel(body);
//         await data.save();
//         res.json({ status: true, msg: "Order   Added" });
//     } catch (err) {
//         res.status(400).send(err);
//     }

// };


// const addOrder = async (req, res) => {
//     try {
//       let body = req.body;
//       let { quantity, sparepartId } = body;
  
//       // Retrieve the product to check the stock quantity
//       const sparePart = await BrandStockModel.findOne({ sparepartId: sparepartId });
  
//       if (!sparePart) {
//         return res.status(404).json({ status: false, msg: "Spare part not found" });
//       }
  
//       // Check if there is enough stock to fulfill the order
//       if (parseInt(sparePart.freshStock) < quantity) {
//         return res.json({ status: false, msg: "Insufficient stock" });
//       }
  
//       // Deduct the order quantity from the stock
//       sparePart.freshStock = parseInt(sparePart.freshStock) - quantity;
  
//       // Save the updated product stock
//       await sparePart.save();
  
//       // Create a new order
//       let data = new OrderModel(req.body);
//       await data.save();
  
//       res.json({ status: true, msg: "Order Added" });
//     } catch (err) {
//       console.error('Error in addOrder:', err);
//       res.status(400).send(err);
//     }
//   };

const addOrder = async (req, res) => {
    try {
      let body = req.body;
      let { quantity, sparepartId, serviceCenterId,serviceCenter } = body;
  
      // Retrieve the spare part to check the stock quantity
      const sparePart = await BrandStockModel.findOne({ sparepartId: sparepartId });
  
      if (!sparePart) {
        return res.status(404).json({ status: false, msg: "Spare part not found" });
      }
  
      // Check if there is enough stock to fulfill the order
      if (parseInt(sparePart.freshStock) < quantity) {
        return res.json({ status: false, msg: "Insufficient stock" });
      }
  
      // Deduct the order quantity from the stock
      sparePart.freshStock = parseInt(sparePart.freshStock) - quantity;
  
      // Save the updated product stock
      await sparePart.save();
  
      // Update the service center stock if serviceCenterId is provided
      if (serviceCenterId) {
        const serviceCenterStock = await UserStockModel.findOne({ serviceCenterId: serviceCenterId, sparepartId: sparepartId });
  
        if (serviceCenterStock) {
          // If the spare part is already in the service center stock, update the quantity
          serviceCenterStock.freshStock = parseInt(serviceCenterStock.freshStock) + quantity;
        //   serviceCenterStock.freshStock += quantity;
        await serviceCenterStock.save();
        } else {
          // If the spare part is not in the service center stock, create a new entry
          await UserStockModel.create({
            serviceCenterId: serviceCenterId,
            serviceCenterName: serviceCenter,
            sparepartId: sparepartId,
            sparepartName: sparePart.name,
            freshStock: quantity,
          });
        }
  
       
      }
  
      // Create a new order
      let data = new OrderModel(req.body);
      await data.save();
  
      res.json({ status: true, msg: "Order Added" });
    } catch (err) {
      console.error('Error in addOrder:', err);
      res.status(400).send(err);
    }
  };
  const addDefectiveOrder = async (req, res) => {
    try {
      let body = req.body;
      let { quantity, sparepartId, serviceCenterId,serviceCenter } = body;
  
      // Retrieve the spare part to check the stock quantity
      const sparePart = await BrandStockModel.findOne({ sparepartId: sparepartId });
  
      if (!sparePart) {
        return res.status(404).json({ status: false, msg: "Spare part not found" });
      }
  
      // Check if there is enough stock to fulfill the order
    //   if (parseInt(sparePart.defectiveStock) < quantity) {
    //     return res.json({ status: false, msg: "Insufficient stock" });
    //   }
  
      // Deduct the order quantity from the stock
      sparePart.defectiveStock = parseInt(sparePart.defectiveStock) + quantity;
  
      // Save the updated product stock
      await sparePart.save();
  
      // Update the service center stock if serviceCenterId is provided
      if (serviceCenterId) {
        const serviceCenterStock = await UserStockModel.findOne({ serviceCenterId: serviceCenterId, sparepartId: sparepartId });
  
        if (serviceCenterStock) {
          // If the spare part is already in the service center stock, update the quantity
          serviceCenterStock.defectiveStock = parseInt(serviceCenterStock.defectiveStock) + quantity;
        //   serviceCenterStock.freshStock += quantity;
        await serviceCenterStock.save();
        } else {
          // If the spare part is not in the service center stock, create a new entry
          await UserStockModel.create({
            serviceCenterId: serviceCenterId,
            serviceCenterName: serviceCenter,
            sparepartId: sparepartId,
            sparepartName: sparePart.name,
            defectiveStock: quantity,
          });
        }
  
       
      }
  
      // Create a new order
      let data = new OrderModel(req.body);
      await data.save();
  
      res.json({ status: true, msg: "Order Added" });
    } catch (err) {
      console.error('Error in addOrder:', err);
      res.status(400).send(err);
    }
  };

const getAllOrder = async (req, res) => {
    try {
        let data = await OrderModel.find({}).sort({ _id: -1 });
        res.send(data);
    } catch (err) {
        res.status(400).send(err);
    }
}
const getAllOrderById = async (req, res) => {
    try {
      const { brandId, serviceCenterId } = req.query;
    
      let query = {};
      if (brandId) {
        query.brandId = brandId;
      }
      if (serviceCenterId) {
        query.serviceCenterId = serviceCenterId;
      }
   
 
      let data = await OrderModel.find(query).sort({ _id: -1 });
  
     
  
      res.send(data);
    } catch (err) {
      console.error('Error in getAllOrderById:', err);
      res.status(400).send(err);
    }
  };
  
  
const getOrderById = async (req, res) => {
    try {
        let _id = req.params.id;
        let data = await OrderModel.findById(_id);
        res.send(data);
    } catch (err) {
        res.status(400).send(err);
    }
}

const editOrder = async (req, res) => {
    try {
        let _id = req.params.id;
        let body = req.body;
        let data = await OrderModel.findByIdAndUpdate(_id, body);
        res.json({ status: true, msg: "Order Updated" });
    } catch (err) {
        res.status(500).send(err);
    }
}
const deleteOrder = async (req, res) => {
    try {
        let _id = req.params.id;
        let data = await OrderModel.findByIdAndDelete(_id);
        res.json({ status: true, msg: "Order Deteled" });
    } catch (err) {
        res.status(500).send(err);
    }
}

module.exports = { addOrder,addDefectiveOrder, getAllOrder,getAllOrderById, getOrderById, editOrder, deleteOrder };
