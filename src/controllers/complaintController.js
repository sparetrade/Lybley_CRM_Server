const ComplaintModal = require("../models/complaint")
const NotificationModel = require("../models/notification")
const { ServiceModel } = require("../models/registration")
const { UserModel } = require("../models/registration")
const SubCategoryModal = require("../models/subCategory")
const BrandRechargeModel = require("../models/brandRecharge")
const WalletModel = require("../models/wallet")
const ProductWarrantyModal = require("../models/productWarranty")

// const addComplaint = async (req, res) => {
//    try {
//       let body = req.body;
//       let { city, pincode } = body; // Extract city and pincode from request body

//       // Find a service center based on city or pincode
//       let serviceCenter;
//       if (pincode) {
//          // serviceCenter = await ServiceModel.findOne({ postalCode: pincode });
//          serviceCenter = await ServiceModel.findOne({
//             $or: [
//                { postalCode: pincode },
//                { pincodeSupported: { $in: [pincode] } }
//             ]
//          });
//       }
//        else if (city) {
//          serviceCenter = await ServiceModel.findOne({ city: city });
//       }
//       // console.log(serviceCenter);

//       if (!serviceCenter) {
//          let obj = {
//             ...body,
//             issueImages: req.file?.location,
//             assignServiceCenterId: serviceCenter?._id,
//             assignServiceCenter: serviceCenter?.serviceCenterName,
//             assignServiceCenterTime: new Date()
//          };
//          let data = new ComplaintModal(obj);
//          await data.save();


//          const notification = new NotificationModel({
//             complaintId: data._id,
//             userId: data.userId,
//             brandId: data.brandId,
//             serviceCenterId: serviceCenter?._id,
//             dealerId: data.dealerId,
//             userName: data.fullName,
//             title: `  Complaint`,
//             message: `Registered Your Complaint, ${req.body.fullName}!`,
//          });
//          await notification.save();
//          return res.json({ status: true, msg: "Complaint Added" });
//          // return res.status(404).json({ status: false, msg: 'No service center found for the provided city or pincode.' });
//       }

//       let obj = {
//          ...body,
//          issueImages: req.file?.location,
//          assignServiceCenterId: serviceCenter?._id,
//          assignServiceCenter: serviceCenter?.serviceCenterName,
//          assignServiceCenterTime: new Date()
//       };
//       let data = new ComplaintModal(obj);
//       await data.save();


//       const notification = new NotificationModel({
//          complaintId: data._id,
//          userId: data.userId,
//          brandId: data.brandId,
//          serviceCenterId: serviceCenter?._id,
//          dealerId: data.dealerId,
//          userName: data.fullName,
//          title: `  Complaint`,
//          message: `Registered Your Complaint, ${req.body.fullName}!`,
//       });
//       await notification.save();
//       res.json({ status: true, msg: "Complaint Added" });
//    } catch (err) {
//       console.error(err);
//       res.status(400).send(err);
//    }
// };

const addComplaint = async (req, res) => {
   try {
      let body = req.body;
      let { city, pincode, emailAddress, fullName, phoneNumber, serviceAddress, brandId } = body; // Extract email and fullName from request body
      const email = emailAddress;
      const uniqueId = body?.uniqueId;
      // Check if user is already registered based on email
      let user = await UserModel.findOne({ email });

      // If user is not registered, register them
      if (!user) {
         user = new UserModel({ email: emailAddress, name: fullName, contact: phoneNumber, address: serviceAddress, password: "12345678" });
         await user.save();
      }
      // console.log(uniqueId);

      if (uniqueId) {
         const warranty = await ProductWarrantyModal.findOne({ 'records.uniqueId': uniqueId });
         if (!warranty) {
            return res.status(404).json({ status: false, msg: 'Warranty not found' });
         }

         // Find the specific record with the matching uniqueId
         const record = warranty.records.find(record => record.uniqueId === uniqueId);
         if (!record) {
            return res.status(404).json({ status: false, msg: 'Warranty record not found' });
         }



         // Activate the warranty
         record.isActivated = true;
         record.userName = fullName;
         record.email = email;
         record.contact = phoneNumber;
         record.address = serviceAddress;
         record.district = body?.district;
         record.state = body?.state;
         record.pincode = pincode;
         record.activationDate = new Date();

         // Save the updated warranty
         await warranty.save();
      }

      // Find a service center based on city or pincode
      let serviceCenter;
      // if (pincode) {
      //    serviceCenter = await ServiceModel.findOne({
      //       $or: [
      //          { postalCode: pincode },
      //          { pincodeSupported: { $in: [pincode] } }
      //       ]
      //    });
      // } 
      if (pincode) {
         serviceCenter = await ServiceModel.findOne({
            $and: [
               {
                  $or: [
                     { postalCode: pincode },
                     { pincodeSupported: { $in: [pincode] } }
                  ]
               },
               { brandsSupported: { $in: [brandId] } }
            ]
         });

      }
      // else if (city) {
      //    serviceCenter = await ServiceModel.findOne({ city: city });
      // }

      // let serviceCenter;
      // if (pincode) {
      //     serviceCenter = await ServiceModel.findOne({
      //         $or: [
      //             { postalCode: pincode },
      //             { pincodeSupported: { $in: [pincode] } }
      //         ],
      //         "brandsSupported.value": req?.body?.brandId // Matching inside array of objects
      //     });
      // } else if (city) {
      //     serviceCenter = await ServiceModel.findOne({
      //         city: city,
      //         "brandsSupported.value": req?.body?.brandId
      //     });
      // }



      // Prepare the complaint object
      let obj = {
         ...body,
         userId: user._id,
         userName: user.name,
         issueImages: req.file?.location,
         assignServiceCenterId: serviceCenter?._id,
         assignServiceCenter: serviceCenter?.serviceCenterName,
         serviceCenterContact: serviceCenter?.contact,
         assignServiceCenterTime: new Date()
      };
      //  && serviceCenter.serviceCenterType === "Independent"
      if (serviceCenter) {
         obj.status = "ASSIGN";
      }
      // Save the complaint
      let data = new ComplaintModal(obj);
      await data.save();

      // Create a notification for the user
      const notification = new NotificationModel({
         complaintId: data._id,
         userId: data.userId,
         brandId: data.brandId,
         serviceCenterId: serviceCenter?._id,
         dealerId: data.dealerId,
         userName: fullName,
         title: `Complaint`,
         message: `Registered Your Complaint, ${fullName}!`,
      });
      await notification.save();
      res.json({ status: true, msg: "Complaint Added", user: user });
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


      let { city, pincode, brandId } = body; // Extract city and pincode from request body

      // Find a service center based on city or pincode
      let serviceCenter;
      if (pincode) {
         // serviceCenter = await ServiceModel.findOne({
         //    $or: [
         //       { postalCode: pincode },
         //       { pincodeSupported: { $in: [pincode] } }
         //    ]

         // });
         // serviceCenter = await ServiceModel.findOne({
         //    $or: [
         //      { postalCode: pincode },
         //      { pincodeSupported: { $in: [pincode] } }
         //    ],
         //    brandsSupported: { $in: [brandId] }
         //  });
         serviceCenter = await ServiceModel.findOne({
            $and: [
               {
                  $or: [
                     { postalCode: pincode },
                     { pincodeSupported: { $in: [pincode] } }
                  ]
               },
               { brandsSupported: { $in: [brandId] } }
            ]
         });

      }
      // else if (city) {
      //    serviceCenter = await ServiceModel.findOne({ city: city });
      // }
      // let serviceCenter;
      // if (pincode) {
      //     serviceCenter = await ServiceModel.findOne({
      //         $or: [
      //             { postalCode: pincode },
      //             { pincodeSupported: { $in: [pincode] } }
      //         ],
      //         "brandsSupported.value": req?.body?.brandId // Matching inside array of objects
      //     });
      // } else if (city) {
      //     serviceCenter = await ServiceModel.findOne({
      //         city: city,
      //         "brandsSupported.value": req?.body?.brandId
      //     });
      // }


      if (!serviceCenter) {
         let obj = {
            ...body,

            assignServiceCenterId: serviceCenter?._id,
            assignServiceCenter: serviceCenter?.serviceCenterName,
            serviceCenterContact: serviceCenter?.contact,
            // assignServiceCenterTime: new Date()
         };
         if (serviceCenter) {
            obj.status = "ASSIGN";
         }
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
         serviceCenterContact: serviceCenter?.contact,
         assignServiceCenterTime: new Date()
      };
      if (serviceCenter) {
         obj.status = "ASSIGN";
      }
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
      console.error('Error in  :', err);
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


      let { city, pincode, brandId } = body; // Extract city and pincode from request body

      // Find a service center based on city or pincode
      let serviceCenter;
      if (pincode) {
         // serviceCenter = await ServiceModel.findOne({ postalCode: pincode });
         serviceCenter = await ServiceModel.findOne({
            $and: [
               {
                  $or: [
                     { postalCode: pincode },
                     { pincodeSupported: { $in: [pincode] } }
                  ]
               },
               { brandsSupported: { $in: [brandId] } }
            ]
         });
      }

      console.log("serviceCenter", serviceCenter);

      // else if (city) {
      //    serviceCenter = await ServiceModel.findOne({ city: city });
      // }
      // console.log(serviceCenter);

      if (!serviceCenter) {
         let obj = {
            ...body,
            issueImages: req.file ? req.file.location : "",
            warrantyImage: req.file ? req.file.location : "",
            assignServiceCenterId: serviceCenter?._id,
            assignServiceCenter: serviceCenter?.serviceCenterName,
            serviceCenterContact: serviceCenter?.contact,
            // assignServiceCenterTime: new Date()
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
         serviceCenterContact: serviceCenter?.contact,
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
const getComplaintsByPending = async (req, res) => {
   try {
      let data = await ComplaintModal.find({ status: "PENDING" }).sort({ _id: -1 }); // Find all complaints with status "PENDING"
      if (data.length === 0) {
         return res.status(404).send({ status: false, msg: "No pending complaints found." });
      }
      res.send(data);
   } catch (err) {
      res.status(400).send(err);
   }
};
const getComplaintsByAssign = async (req, res) => {
   try {
      let data = await ComplaintModal.find({ status: "ASSIGN" }).sort({ _id: -1 }); // Find all complaints with status "PENDING"
      if (data.length === 0) {
         return res.status(404).send({ status: false, msg: "No pending complaints found." });
      }
      res.send(data);
   } catch (err) {
      res.status(400).send(err);
   }
};
const getComplaintsByInProgress = async (req, res) => {
   try {
      let data = await ComplaintModal.find({ status: "IN PROGRESS" }).sort({ _id: -1 }); // Find all complaints with status "PENDING"
      if (data.length === 0) {
         return res.status(404).send({ status: false, msg: "No pending complaints found." });
      }
      res.send(data);
   } catch (err) {
      res.status(400).send(err);
   }
};
const getComplaintsByComplete = async (req, res) => {
   try {
      let data = await ComplaintModal.find({ status: "COMPLETED" }).sort({ _id: -1 }); // Find all complaints with status "PENDING"
      if (data.length === 0) {
         return res.status(404).send({ status: false, msg: "No pending complaints found." });
      }
      res.send(data);
   } catch (err) {
      res.status(400).send(err);
   }
};
const getComplaintsByCancel = async (req, res) => {
   try {
      let data = await ComplaintModal.find({ status: "CANCELED" }).sort({ _id: -1 }); // Find all complaints with status "PENDING"
      if (data.length === 0) {
         return res.status(404).send({ status: false, msg: "No pending complaints found." });
      }
      res.send(data);
   } catch (err) {
      res.status(400).send(err);
   }
};

// getComplaintsByUpcomming
const getComplaintsByUpcomming = async (req, res) => {
   try {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Start of today

      const endOfToday = new Date();
      endOfToday.setHours(23, 59, 59, 999); // End of today

      // Find complaints where preferredServiceDate is strictly in the future
      let data = await ComplaintModal.find({ 
         preferredServiceDate: { $gt: endOfToday }, // Future complaints only (not today)
         status: { $nin: ["COMPLETED", "FINAL VERIFICATION", "CANCELED"] }// Exclude unwanted statuses
      }).sort({ preferredServiceDate: 1 });

      if (data.length === 0) {
         return res.status(404).json({ status: false, msg: "No upcoming complaints found." });
      }

      res.send(data);
   } catch (err) {
      console.error("Error fetching upcoming complaints:", err);
      res.status(500).json({ status: false, msg: "Server error", error: err });
   }
};






const getComplaintsByFinalVerification = async (req, res) => {
   try {
      let data = await ComplaintModal.find({ status: "FINAL VERIFICATION" }).sort({ _id: -1 }); // Find all complaints with status "PENDING"
      if (data.length === 0) {
         return res.status(404).send({ status: false, msg: "No pending complaints found." });
      }
      res.send(data);
   } catch (err) {
      res.status(400).send(err);
   }
};
const getComplaintsByPartPending = async (req, res) => {
   try {
      let data = await ComplaintModal.find({ status: "PART PENDING" }).sort({ _id: -1 }); // Find all complaints with status "PENDING"
      if (data.length === 0) {
         return res.status(404).send({ status: false, msg: "No pending complaints found." });
      }
      res.send(data);
   } catch (err) {
      res.status(400).send(err);
   }
};
// const getPendingComplaints = async (req, res) => {
//    try {
//      const { days } = req.params; // Get days filter from params
//      let startDate, endDate;
//      const currentDate = new Date();

//    //   console.log("Received days:", days);

//      if (days === "0-1") {
//        startDate = new Date();
//        startDate.setDate(currentDate.getDate() - 1);
//        startDate.setHours(0, 0, 0, 0);

//        endDate = new Date();
//        endDate.setHours(23, 59, 59, 999);
//      } else if (days === "2-5") {
//        startDate = new Date();
//        startDate.setDate(currentDate.getDate() - 5);
//        startDate.setHours(0, 0, 0, 0);

//        endDate = new Date();
//        endDate.setDate(currentDate.getDate() - 2);
//        endDate.setHours(23, 59, 59, 999);
//      } else if (days === "more-than-week") {
//        endDate = new Date();
//        endDate.setDate(currentDate.getDate() - 6);
//        endDate.setHours(23, 59, 59, 999);
//      }

//    //   console.log("Start Date:", startDate);
//    //   console.log("End Date:", endDate);

//      let filter = { status: "PENDING" };

//      if (days === "0-1" || days === "2-5") {
//        filter.createdAt = { $gte: startDate, $lte: endDate };
//      } else if (days === "more-than-week") {
//        filter.createdAt = { $lte: endDate }; // Fetch complaints **older** than 7 days
//      }

//    //   console.log("Filter Query:", JSON.stringify(filter, null, 2));

//      const complaints = await ComplaintModal.find(filter).sort({ createdAt: -1 });

//    //   console.log("Found complaints:", complaints.length);

//      res.status(200).json({ success: true, data: complaints });
//    } catch (error) {
//      console.error("Error fetching pending complaints:", error);
//      res.status(500).json({ success: false, message: "Server error" });
//    }
//  };

const getPendingComplaints = async (req, res) => {
   try {
      const { days } = req.params; // Get days filter from params
      const now = new Date();
      let startDate, endDate;

      if (days === "0-1") {
         startDate = new Date(now);
         startDate.setDate(now.getDate() - 1);
         startDate.setHours(0, 0, 0, 0);

         endDate = new Date(now);
         endDate.setHours(23, 59, 59, 999);
      } else if (days === "2-5") {
         startDate = new Date(now);
         startDate.setDate(now.getDate() - 5);
         startDate.setHours(0, 0, 0, 0);

         endDate = new Date(now);
         endDate.setDate(now.getDate() - 2);
         endDate.setHours(23, 59, 59, 999);
      } else if (days === "more-than-week") {
         endDate = new Date(now);
         endDate.setDate(now.getDate() - 5); // Ensure correct range
         endDate.setHours(23, 59, 59, 999);
      }

      //   let filter = { status: "PENDING"||"IN PROGRESS" };
      let filter = { status: { $in: ["PENDING", "IN PROGRESS"] } };

      if (days === "0-1" || days === "2-5") {
         filter.createdAt = { $gte: startDate, $lte: endDate };
      } else if (days === "more-than-week") {
         filter.createdAt = { $lte: endDate };
      }
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Start of today

      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() +2);

      const complaintsForToday = await ComplaintModal.find({
         $or: [
            
            {
               preferredServiceDate: { $lt: today },
               status: { $nin: ["COMPLETED", "FINAL VERIFICATION", "CANCELED"] }
            } // Past but not completed
         ]
      }).sort({ preferredServiceDate: 1 });
      const complaints = await ComplaintModal.find(filter).sort({ createdAt: -1 });

      res.status(200).json({ success: true, data: complaints, scheduleToday: complaintsForToday });
   } catch (error) {
      console.error("Error fetching pending complaints:", error);
      res.status(500).json({ success: false, message: "Server error" });
   }
};

const getPartPendingComplaints = async (req, res) => {
   try {
      const { days } = req.params; // Get days filter from params
      const now = new Date();
      let startDate, endDate;

      if (days === "0-1") {
         startDate = new Date(now);
         startDate.setDate(now.getDate() - 1);
         startDate.setHours(0, 0, 0, 0);

         endDate = new Date(now);
         endDate.setHours(23, 59, 59, 999);
      } else if (days === "2-5") {
         startDate = new Date(now);
         startDate.setDate(now.getDate() - 5);
         startDate.setHours(0, 0, 0, 0);

         endDate = new Date(now);
         endDate.setDate(now.getDate() - 2);
         endDate.setHours(23, 59, 59, 999);
      } else if (days === "more-than-week") {
         endDate = new Date(now);
         endDate.setDate(now.getDate() - 6); // Ensure correct range
         endDate.setHours(23, 59, 59, 999);
      }

      let filter = { status: "PART PENDING" };


      if (days === "0-1" || days === "2-5") {
         filter.createdAt = { $gte: startDate, $lte: endDate };
      } else if (days === "more-than-week") {
         filter.createdAt = { $lte: endDate };
      }

      const complaints = await ComplaintModal.find(filter).sort({ createdAt: -1 });

      res.status(200).json({ success: true, data: complaints });
   } catch (error) {
      console.error("Error fetching pending complaints:", error);
      res.status(500).json({ success: false, message: "Server error" });
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
      // Object.assign(data, body);
      // await data.save();
      if (body.status === "FINAL VERIFICATION") {
         data.complaintCloseTime = new Date();

      }

      // Apply updates to the complaint object
      Object.assign(data, body);

      // Save the updated complaint
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
      if (body.status === "COMPLETED") {
         // let subCatData = await SubCategoryModal.findById({categoryId:data.categoryId});
         let subCatData = await SubCategoryModal.findOne({ categoryId: data.categoryId });

         if (subCatData) {

            const brandTrans = new BrandRechargeModel({
               brandId: data.brandId,
               brandName: data.productBrand,
               amount: -body?.paymentBrand,
               complaintId: data._id,
               description: "Complaint Close  Payout"
            });
            await brandTrans.save();
            const serviceCenterWallet = await WalletModel.findOne({ serviceCenterId: data.assignServiceCenterId }).exec();

            if (!serviceCenterWallet) {
               // Handle case where wallet is not found
               console.error('Wallet not found for service center:',);
               // return;
               return res.json({ status: true, msg: "Complaint Updated" });
            }

            serviceCenterWallet.totalCommission = (parseInt(serviceCenterWallet.totalCommission || 0) + parseInt(subCatData.payout));
            serviceCenterWallet.dueAmount = (parseInt(serviceCenterWallet.dueAmount || 0) + parseInt(subCatData.payout));
            await serviceCenterWallet.save();


            const dealerWallet = await WalletModel.findOne({ serviceCenterId: data.dealerId }).exec();

            if (!dealerWallet) {
               // Handle case where wallet is not found
               console.error('Wallet not found for dealer:',);
               return res.json({ status: true, msg: "Complaint Updated" });
            }

            const payout = parseInt(subCatData.payout);

            // If dealerId is present, add 20% of payout, else add full payout
            const commissionToAdd = data.dealerId ? payout * 0.2 : payout;

            // Update service center's total commission and due amount
            dealerWallet.totalCommission = (parseInt(dealerWallet.totalCommission || 0) + commissionToAdd);
            dealerWallet.dueAmount = (parseInt(dealerWallet.dueAmount || 0) + commissionToAdd);

            await dealerWallet.save();
         }

      }
      res.json({ status: true, msg: "Complaint Updated" });
   } catch (err) {
      res.status(500).send(err);
   }
};
const updateFinalVerification = async (req, res) => {
   try {
      let _id = req.params.id;
      let body = req.body;
      let image = req.file ? req.file.location : null;

      // console.log("Received Image:", image);
      // console.log("Complaint ID:", _id);
      // console.log("Request Body:", body);

      // Validate ID
      if (!_id) {
         return res.status(400).json({ status: false, msg: "Invalid ID" });
      }

      // Find the complaint
      let data = await ComplaintModal.findById(_id);
      // console.log("data ID:", data);
      if (!data) {
         return res.status(404).json({ status: false, msg: "Complaint not found" });
      }

      // Prepare update object
      let updateFields = { ...body };
      if (image) {
         updateFields.partImage = image;
      }

      // Append update history
      const changes = { ...updateFields };
      delete changes.updateHistory;

      data.updateHistory.push({
         updatedAt: new Date(),
         changes,
      });

      // Update document safely
      Object.assign(data, updateFields);
      await data.save();

      // Handle notifications
      if (body.assignServiceCenterId) {
         await NotificationModel.create({
            complaintId: data._id,
            userId: data.userId,
            technicianId: body.technicianId,
            serviceCenterId: body.assignServiceCenterId,
            brandId: data.brandId,
            dealerId: data.dealerId,
            userName: data.productBrand,
            title: "Brand Assign Service Center",
            message: "Assign Service Center on Your Complaint!",
         });
      }

      if (body.technicianId) {
         await NotificationModel.create({
            complaintId: data._id,
            userId: data.userId,
            technicianId: body.technicianId,
            serviceCenterId: body.assignServiceCenterId,
            brandId: data.brandId,
            dealerId: data.dealerId,
            userName: data.assignServiceCenter,
            title: "Service Center Assign Technician",
            message: "Assign Technician on Your Complaint!",
         });
      }

      // Handle completed complaint logic
      if (body.status === "COMPLETED") {
         let subCatData = await SubCategoryModal.findOne({ categoryId: data.categoryId });

         if (subCatData) {
            let payout = parseInt(subCatData.payout || 0);
            if (isNaN(payout) || payout <= 0) {
               console.error("Invalid payout amount:", subCatData.payout);
               return res.json({ status: true, msg: "Complaint Updated with invalid payout" });
            }




            // Service Center Wallet Update
            let serviceCenterWallet = await WalletModel.findOne({ serviceCenterId: data.assignServiceCenterId });
            if (serviceCenterWallet) {
               serviceCenterWallet.totalCommission += payout;
               serviceCenterWallet.dueAmount += payout;
               await serviceCenterWallet.save();
            } else {
               console.warn("No wallet found for service center:", data.assignServiceCenterId);
            }

            // Dealer Wallet Update
            let dealerWallet = await WalletModel.findOne({ dealerId: data.dealerId });
            if (dealerWallet) {
               let commissionToAdd = data.dealerId ? payout * 0.2 : payout;
               dealerWallet.totalCommission += commissionToAdd;
               dealerWallet.dueAmount += commissionToAdd;
               await dealerWallet.save();
            } else {
               console.warn("No wallet found for dealer:", data.dealerId);
            }
         }
         let serviceCenterWallet = await WalletModel.findOne({ serviceCenterId: data.assignServiceCenterId });
         if (serviceCenterWallet) {
            serviceCenterWallet.totalCommission += payout;
            serviceCenterWallet.dueAmount += payout;
            await serviceCenterWallet.save();
         } else {
            console.warn("No wallet found for service center:", data.assignServiceCenterId);
         }
         // Brand transaction
         await BrandRechargeModel.create({
            brandId: data.brandId,
            brandName: data.productBrand,
            amount: -(body?.paymentBrand) || 0,
            complaintId: data._id,
            description: "Complaint Close Payout",
         });
      }

      res.json({ status: true, msg: "Complaint Updated" });
   } catch (err) {
      console.error("Error updating complaint:", err);
      res.status(500).json({ status: false, msg: "Internal Server Error", error: err.message });
   }
};


const updateComplaintComments = async (req, res) => {
   try {
      const _id = req.params.id;
      const body = req.body;

      // Prepare the changes to be logged in updateComments
      const changes = {};
      for (const key in body) {
         if (body.hasOwnProperty(key) && key !== 'updateComments') {
            changes[key] = body[key];
         }
      }

      // Find the complaint by ID
      const complaint = await ComplaintModal.findById(_id);
      if (!complaint) {
         return res.status(404).json({ status: false, msg: "Complaint not found" });
      }

      // Push the update details into updateComments
      complaint.updateComments.push({
         updatedAt: new Date(),
         changes: changes,
      });

      // Update the complaint fields
      Object.assign(complaint, body);

      // Save the updated complaint
      await complaint.save();

      res.json({ status: true, msg: "Complaint Updated" });
   } catch (err) {
      res.status(500).send({ status: false, msg: "Error updating complaint", error: err.message });
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

module.exports = {
   addComplaint, addDealerComplaint, getComplaintsByAssign, getComplaintsByCancel, getComplaintsByComplete
   , getComplaintsByInProgress,getComplaintsByUpcomming, getComplaintsByPartPending, getComplaintsByPending, getComplaintsByFinalVerification,
   getPendingComplaints, getPartPendingComplaints, addAPPComplaint, getAllComplaint, getComplaintByUserId, getComplaintByTechId, getComplaintById, updateComplaintComments, editIssueImage, updateFinalVerification, editComplaint, deleteComplaint, updateComplaint
};
