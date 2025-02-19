const  ServicePaymentModel = require("../models/servicePaymentModel")

// const addServicePayment = async (req, res) => {

//     try {
//         let body = req.body;
//         let data = new ServicePaymentModel(body);
//         await data.save();
//         res.json({ status: true, msg: "Service Payment   Added" });
//     } catch (err) {
//         res.status(400).send(err);
//     }

// };
const addServicePayment = async (req, res) => {
    try {
        let body = req.body;
        if (req.file) {
            body.qrCode = req.file?.location; // Store the file path for qrCode
        }

        let data = new ServicePaymentModel(body);
        await data.save();
        res.json({ status: true, msg: "Service Payment Added Successfully" });
    } catch (err) {
        res.status(400).send({ status: false, msg: "Error while adding service payment", error: err });
    }
};

const getAllServicePayment = async (req, res) => {
    try {
        let data = await ServicePaymentModel.find({}).sort({ _id: -1 });
        res.send(data);
    } catch (err) {
        res.status(400).send(err);
    }
}
const getServicePaymentById = async (req, res) => {
    try {
        let _id = req.params.id;
        let data = await ServicePaymentModel.findById(_id);
        res.send(data);
    } catch (err) {
        res.status(400).send(err);
    }
}

// const editServicePayment = async (req, res) => {
//     try {
//         let _id = req.params.id;
//         let body = req.body;
//         let data = await ServicePaymentModel.findByIdAndUpdate(_id, body);
//         res.json({ status: true, msg: "Service Payment Updated" });
//     } catch (err) {
//         res.status(500).send(err);
//     }
// }
const editServicePayment = async (req, res) => {
    try {
      let _id = req.params.id;
  
      // console.log("Transaction ID:", _id);
  
      let obj = await ServicePaymentModel.findById(_id);
      if (!obj) {
        return res.json({ status: false, msg: "Transaction not found" });
      }
  
      // Check if file is uploaded
      const payScreenshot = req.file?.location;
      if (!payScreenshot) {
        return res.status(400).json({ status: false, msg: "File upload failed" });
      }
  
      // console.log("Uploaded Screenshot URL:", payScreenshot);
  
      let obj1 = await ServicePaymentModel.findByIdAndUpdate(
        _id,
        { payScreenshot: payScreenshot, status: "PAID" },
        { new: true }
      );
  
      // console.log("Updated Transaction:", obj1);
  
      if (!obj1) {
        return res.json({ status: false, msg: "Payment status not updated" });
      }

  
      return res.json({ status: true, msg: "Payment status updated successfully", data: obj1 });
  
    } catch (err) {
      console.error("Error in updateTransaction:", err);
      res.status(500).json({ status: false, msg: "Internal Server Error", error: err.message });
    }
  };
const deleteServicePayment = async (req, res) => {
    try {
        let _id = req.params.id;
        let data = await ServicePaymentModel.findByIdAndDelete(_id);
        res.json({ status: true, msg: "Service Payment Deteled" });
    } catch (err) {
        res.status(500).send(err);
    }
}

module.exports = { addServicePayment, getAllServicePayment, getServicePaymentById, editServicePayment, deleteServicePayment };
