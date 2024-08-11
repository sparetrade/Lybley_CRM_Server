const ComplaintModal = require("../models/complaint")
const NotificationModel = require("../models/notification")
const { ServiceModel } = require("../models/registration")

// const addComplaint = async (req, res) => {
//    try {
//       let body = req.body;
//       let obj = { ...body, issueImages: req.file.location   };

//       let data = new ComplaintModal(obj);
//       await data.save();
//       const notification = new NotificationModel({
//          complaintId: data?._id,
//          userId: data.userId,
//          brandId: data.brandId,
//          dealerId: data.dealerId,
//          userName: data.fullName,
//          title: `User Complaint`,
//          message: `Registred Your Complaint, ${req.body.fullName}!`,
//       });
//       await notification.save();
//       res.json({ status: true, msg: "Complaint   Added" });
//    } catch (err) {
//       res.status(400).send(err);
//    }

// };
const addComplaint = async (req, res) => {
   try {
      let body = req.body;
      let { city, pincode } = body; // Extract city and pincode from request body

      // Find a service center based on city or pincode
      let serviceCenter;
      if (pincode) {
         serviceCenter = await ServiceModel.findOne({ postalCode: pincode });
      } else if (city) {
         serviceCenter = await ServiceModel.findOne({ city: city });
      }
      // console.log(serviceCenter);

      if (!serviceCenter) {
         let obj = {
            ...body,
            issueImages: req.file?.location,
            assignServiceCenterId: serviceCenter?._id,
            assignServiceCenter: serviceCenter?.serviceCenterName,
            assignServiceCenterTime: new Date()
         };
         let data = new ComplaintModal(obj);
         await data.save();


         const notification = new NotificationModel({
            complaintId: data._id,
            userId: data.userId,
            brandId: data.brandId,
            serviceCenterId: serviceCenter?._id,
            dealerId: data.dealerId,
            userName: data.fullName,
            title: `  Complaint`,
            message: `Registered Your Complaint, ${req.body.fullName}!`,
         });
         await notification.save();
         return res.json({ status: true, msg: "Complaint Added" });
         // return res.status(404).json({ status: false, msg: 'No service center found for the provided city or pincode.' });
      }

      let obj = {
         ...body,
         issueImages: req.file?.location,
         assignServiceCenterId: serviceCenter?._id,
         assignServiceCenter: serviceCenter?.serviceCenterName,
         assignServiceCenterTime: new Date()
      };
      let data = new ComplaintModal(obj);
      await data.save();


      const notification = new NotificationModel({
         complaintId: data._id,
         userId: data.userId,
         brandId: data.brandId,
         serviceCenterId: serviceCenter?._id,
         dealerId: data.dealerId,
         userName: data.fullName,
         title: `  Complaint`,
         message: `Registered Your Complaint, ${req.body.fullName}!`,
      });
      await notification.save();
      res.json({ status: true, msg: "Complaint Added" });
   } catch (err) {
      console.error(err);
      res.status(400).send(err);
   }
};


const addAPPComplaint = async (req, res) => {
   try {
      // let body = req.body;
      // let obj = { ...body, issueImages: req.file.location };
      // console.log(obj);
      let body = req.body;


      let { city, pincode } = body; // Extract city and pincode from request body

      // Find a service center based on city or pincode
      let serviceCenter;
      if (pincode) {
         serviceCenter = await ServiceModel.findOne({ postalCode: pincode });
      } else if (city) {
         serviceCenter = await ServiceModel.findOne({ city: city });
      }
      if (!serviceCenter) {
         let obj = {
            ...body,

            assignServiceCenterId: serviceCenter?._id,
            assignServiceCenter: serviceCenter?.serviceCenterName,
            assignServiceCenterTime: new Date()
         };
         let data = new ComplaintModal(obj);
         await data.save();
         const notification = new NotificationModel({
            complaintId: data?._id,
            userId: data.userId,
            brandId: data.brandId,
            serviceCenterId: serviceCenter?._id,
            dealerId: data.dealerId,
            userName: data.fullName,
            title: `User Complaint`,
            message: `Registred Your Complaint, ${req.body.fullName}!`,
         });
         await notification.save();

         return res.json({ status: true, msg: "Complaint Added" });
      }
      let obj = {
         ...body,
         // issueImages: req.file ? req.file.location : "", 
         // warrantyImage: req.file ? req.file.location : "", 
         assignServiceCenterId: serviceCenter?._id,
         assignServiceCenter: serviceCenter?.serviceCenterName,
         assignServiceCenterTime: new Date()
      };
      let data = new ComplaintModal(obj);
      await data.save();


      const notification = new NotificationModel({
         complaintId: data._id,
         userId: data.userId,
         brandId: data.brandId,
         serviceCenterId: serviceCenter?._id,
         dealerId: data.dealerId,
         userName: data.fullName,
         title: `  Complaint`,
         message: `Registered Your Complaint, ${req.body.fullName}!`,
      });
      await notification.save();
      res.json({ status: true, msg: "Complaint Added" });

   } catch (err) {
      console.error('Error in createShipment:', err);
      res.status(400).send(err);
   }

};
// const addDealerComplaint = async (req, res) => {
//    try {
//       let body = req.body;
//       let warrantyImage = req.file ? req.file.location : "";
//       let issueImages = req.file ? req.file.location : "";
//       let obj = { ...body, issueImages, warrantyImage };

//       let data = new ComplaintModal(obj);
//       await data.save();
//       const notification = new NotificationModel({
//          complaintId: data?._id,
//          userId: data.userId,
//          brandId: data.brandId,
//          dealerId: data.dealerId,
//          userName: data.fullName,
//          title: `Dealer Complaint`,
//          message: `Registred Your Complaint, ${req.body.fullName}!`,
//       });
//       await notification.save();
//       res.json({ status: true, msg: "Complaint   Added" });
//    } catch (err) {
//       res.status(400).send(err);
//    }

// };

const addDealerComplaint = async (req, res) => {
   try {
      let body = req.body;


      let { city, pincode } = body; // Extract city and pincode from request body

      // Find a service center based on city or pincode
      let serviceCenter;
      if (pincode) {
         serviceCenter = await ServiceModel.findOne({ postalCode: pincode });
      } else if (city) {
         serviceCenter = await ServiceModel.findOne({ city: city });
      }
      // console.log(serviceCenter);

      if (!serviceCenter) {
         let obj = {
            ...body,
            issueImages: req.file ? req.file.location : "",
            warrantyImage: req.file ? req.file.location : "",
            assignServiceCenterId: serviceCenter?._id,
            assignServiceCenter: serviceCenter?.serviceCenterName,
            assignServiceCenterTime: new Date()
         };
         let data = new ComplaintModal(obj);
         await data.save();


         const notification = new NotificationModel({
            complaintId: data._id,
            userId: data.userId,
            brandId: data.brandId,
            serviceCenterId: serviceCenter?._id,
            dealerId: data.dealerId,
            userName: data.fullName,
            title: `  Complaint`,
            message: `Registered Your Complaint, ${req.body.fullName}!`,
         });
         await notification.save();
         return res.json({ status: true, msg: "Complaint Added" });
         // return res.status(404).json({ status: false, msg: 'No service center found for the provided city or pincode.' });
      }

      let obj = {
         ...body,
         issueImages: req.file ? req.file.location : "",
         warrantyImage: req.file ? req.file.location : "",
         assignServiceCenterId: serviceCenter?._id,
         assignServiceCenter: serviceCenter?.serviceCenterName,
         assignServiceCenterTime: new Date()
      };
      let data = new ComplaintModal(obj);
      await data.save();


      const notification = new NotificationModel({
         complaintId: data._id,
         userId: data.userId,
         brandId: data.brandId,
         serviceCenterId: serviceCenter?._id,
         dealerId: data.dealerId,
         userName: data.fullName,
         title: `  Complaint`,
         message: `Registered Your Complaint, ${req.body.fullName}!`,
      });
      await notification.save();
      res.json({ status: true, msg: "Complaint Added" });
   } catch (err) {
      console.error(err);
      res.status(400).send(err);
   }
};

const editIssueImage = async (req, res) => {
   try {
      let _id = req.params.id;
      let obj = await ComplaintModal.findById(_id);
      obj.images = req.file.location;

      let obj1 = await ComplaintModal.findByIdAndUpdate(_id, { issueImages: obj.images }, { new: true });
      res.json({ status: true, msg: "Update Image", data: obj1 });
   } catch (err) {
      res.status(500).send(err);
   }
};

const getAllComplaint = async (req, res) => {
   try {
      let data = await ComplaintModal.find({}).sort({ _id: -1 });
      res.send(data);
   } catch (err) {
      res.status(400).send(err);
   }
}
const getComplaintById = async (req, res) => {
   try {
      let _id = req.params.id;
      let data = await ComplaintModal.findById(_id);
      res.send(data);
   } catch (err) {
      res.status(400).send(err);
   }
}
const getComplaintByUserId = async (req, res) => {
   try {
      const userId = req.params.userId;
      const complaints = await ComplaintModal.find({ userId }).populate('userId');
      res.send(complaints);
   } catch (err) {
      res.status(400).send(err);
   }
};
const getComplaintByTechId = async (req, res) => {
   try {
      const technicianId = req.params.userId;
      const complaints = await ComplaintModal.find({ technicianId }).populate('technicianId');
      res.send(complaints);
   } catch (err) {
      res.status(400).send(err);
   }
};

// const editComplaint = async (req, res) => {
//    try {
//       let _id = req.params.id;
//       let body = req.body;

//       let data = await ComplaintModal.findByIdAndUpdate(_id, body);
//       if (body.assignServiceCenterId) {
//          const notification = new NotificationModel({
//             complaintId: data?._id,
//             userId: data.userId,
//             technicianId: body.technicianId,
//             serviceCenterId: body.assignServiceCenterId,
//             brandId: data.brandId,
//             dealerId: data.dealerId,
//             userName: data.productBrand,
//             title: `Brand Assign Service Center  `,
//             message: `Assign Service Center on Your Complaint !`,
//          });
//          await notification.save();
//       }
//       if (body.technicianId) {
//          const notification = new NotificationModel({
//             complaintId: data?._id,
//             userId: data.userId,
//             technicianId: body.technicianId,
//             serviceCenterId: body.assignServiceCenterId,
//             brandId: data.brandId,
//             dealerId: data.dealerId,
//             userName: data.assignServiceCenter,
//             title: ` Service Center Assign Technician  `,
//             message: `Assign Technician on  Your Complaint !`,
//          });
//          await notification.save();
//       }
//       res.json({ status: true, msg: "Complaint Updated" });
//    } catch (err) {
//       res.status(500).send(err);
//    }
// }

const editComplaint = async (req, res) => {
   try {
      let _id = req.params.id;
      let body = req.body;

      // Prepare the changes to be logged in updateHistory
      const changes = {};
      for (const key in body) {
         if (body.hasOwnProperty(key) && key !== 'updateHistory') {
            changes[key] = body[key];
         }
      }

      // Find the complaint and update it
      let data = await ComplaintModal.findById(_id);
      if (!data) {
         return res.status(404).json({ status: false, msg: "Complaint not found" });
      }

      // Push the update details into updateHistory
      data.updateHistory.push({
         updatedAt: new Date(),
         changes: changes,
      });

      // Update the complaint with new data
      Object.assign(data, body);
      await data.save();

      if (body.assignServiceCenterId) {
         const notification = new NotificationModel({
            complaintId: data._id,
            userId: data.userId,
            technicianId: body.technicianId,
            serviceCenterId: body.assignServiceCenterId,
            brandId: data.brandId,
            dealerId: data.dealerId,
            userName: data.productBrand,
            title: `Brand Assign Service Center`,
            message: `Assign Service Center on Your Complaint!`,
         });
         await notification.save();
      }
      if (body.technicianId) {
         const notification = new NotificationModel({
            complaintId: data._id,
            userId: data.userId,
            technicianId: body.technicianId,
            serviceCenterId: body.assignServiceCenterId,
            brandId: data.brandId,
            dealerId: data.dealerId,
            userName: data.assignServiceCenter,
            title: `Service Center Assign Technician`,
            message: `Assign Technician on Your Complaint!`,
         });
         await notification.save();
      }

      res.json({ status: true, msg: "Complaint Updated" });
   } catch (err) {
      res.status(500).send(err);
   }
};

const deleteComplaint = async (req, res) => {
   try {
      let _id = req.params.id;
      let data = await ComplaintModal.findByIdAndDelete(_id);
      res.json({ status: true, msg: "Complaint Deteled" });
   } catch (err) {
      res.status(500).send(err);
   }
}

const updateComplaint = async (req, res) => {
   try {
      let _id = req.params.id;
      let body = req.body;
      let data = await ComplaintModal.findByIdAndUpdate(_id, body);
      res.json({ status: true, msg: "Complaint Updated" });
   } catch (err) {
      res.status(500).send(err);
   }
}

module.exports = { addComplaint, addDealerComplaint, addAPPComplaint, getAllComplaint, getComplaintByUserId, getComplaintByTechId, getComplaintById, editIssueImage, editComplaint, deleteComplaint, updateComplaint };
