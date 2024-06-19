const express = require('express');
const router = express.Router();
const  ComplaintModal  = require('../models/complaint');
const { BrandRegistrationModel, ServiceModel, TechnicianModal, UserModel } = require('../models/registration');
const  ProductModel  = require('../models/product');
router.post('/filterUserData', async (req, res) => {
    try {
      const { reportType, startDate, endDate, filters, includeCharts } = req.body;
    //   console.log('Received payload:', req.body);
  
      let query = {};
  
      if (reportType === 'USER') {
        if (filters.userType) {
          const userTypes = Object.keys(filters.userType).filter((type) => filters.userType[type]);
          if (userTypes==='customer') {
            const users = await UserModel.find({});
            query._id = { $in: users.map((user) => user._id) };
          }
          if (userTypes==='serviceCenter') {
              const services = await ServiceModel.find({});
              query._id = { $in: services.map((user) => user._id) };
            }
            if (userTypes==='technician') {
              const technicians = await TechnicianModal.find({});
              query._id = { $in: technicians.map((user) => user._id) };
            }
            if (userTypes==='brand') {
              const brands = await BrandRegistrationModel.find({});
              query._id = { $in: brands.map((user) => user._id) };
            }
        }
  
        const users = await UserModel.find(query);
        const technicians = await TechnicianModal.find(query);
        const brands = await BrandRegistrationModel.find(query);
        const services = await ServiceModel.find(query);
      //   console.log('Filtered user data:', users);
        return res.json({ summary: `User Report`, users: users,brands:brands,services:services,technicians:technicians });
      }
    }
      catch (error) {
        console.error('Error filtering data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
   } );

   router.post('/filterData', async (req, res) => {
    try {
      const { reportType, startDate, endDate, filters, includeCharts } = req.body;
    //   console.log('Received payload:', req.body)
  
      let query = {};
  
     let userData={};
     
      if (reportType === 'USER') {
        if (filters.userType) {
          const userTypes = Object.keys(filters.userType).filter(type => filters.userType[type]);
              
          if (userTypes.includes('customer')) {
            const customers = await UserModel.find({});
            userData={...userData,customers}
          }
  
          if (userTypes.includes('serviceCenter')) {
            const serviceCenters = await ServiceModel.find({});
            userData={...userData,serviceCenters}

          }
  
          if (userTypes.includes('technician')) {
            const technicians = await TechnicianModal.find({});
            userData={...userData,technicians}


          }
  
          if (userTypes.includes('brand')) {
            const brands = await BrandRegistrationModel.find({});
            userData={...userData,brands}


          }
        

        }
        // console.log(userData);
        return res.json({ summary: `User Report`, userData });
      }
      if (reportType === 'COMPLAINT') {
       
      
        if (filters.status) {
          const statuses = Object.keys(filters.status).filter((status) => filters.status[status]);
          console.log('Filtered statuses:', statuses);
          if (statuses.length) {
            query.status = { $in: statuses };
          }
        }
  
        if (filters.product.length) {
          const products = await ProductModel.find({ name: { $in: filters.product } });
          console.log('Matched products:', products);
          query.productId = { $in: products.map((product) => product._id) };
        }
  
        if (filters.brand.length) {
          const brands = await BrandRegistrationModel.find({ name: { $in: filters.brand } });
          console.log('Matched brands:', brands);
          query.brandId = { $in: brands.map((brand) => brand._id) };
        }
  
        if (filters.serviceCenter.length) {
          const services = await ServiceModel.find({ name: { $in: filters.serviceCenter } });
          console.log('Matched service centers:', services);
          query.serviceCenterId = { $in: services.map((service) => service._id) };
        }
  
        if (filters.technician.length) {
          const technicians = await TechnicianModal.find({ name: { $in: filters.technician } });
          console.log('Matched technicians:', technicians);
          query.technicianId = { $in: technicians.map((technician) => technician._id) };
        }
  
        if (filters.country) {
          query.country = filters.country;
        }
  
        if (filters.state) {
          query.state = filters.state;
        }
  
        if (filters.city) {
          query.city = filters.city;
        }
  
        if (startDate && endDate) {
          query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }
  
        console.log('Constructed query:', query);
  
        const complaints = await ComplaintModal.find(query)
        //   .populate('userId')
        //   .populate('productId')
        //   .populate('brandId')
        //   .populate('serviceCenterId')
        //   .populate('technicianId');
  
        console.log('Matched complaints:', complaints);
  
        const reportData = {
          summary: `Report from ${startDate} to ${endDate}`,
          complaints: complaints,
          labels: [], // Populate as necessary for charts
          data: [], // Populate as necessary for charts
        };
  
        return res.json(reportData);
      }
  
      res.status(400).json({ error: 'Invalid report type' });
    } catch (error) {
      console.error('Error filtering data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = router;
