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
        const userTypes = Object.keys(filters.userType).filter(type => filters.userType[type]);
        let responseData = {};
        let dateQuery = {};
  
        // Create date range query if both startDate and endDate are provided
        if (startDate && endDate) {
          dateQuery = {
            createdAt: { 
              $gte: new Date(startDate), 
              $lte: new Date(endDate) 
            }
          };
        }
  
        if (userTypes.includes('customer')) {
          const customers = await UserModel.find(dateQuery);
          responseData.customers = customers;
        }
  
        if (userTypes.includes('serviceCenter')) {
          const serviceCenters = await ServiceModel.find(dateQuery);
          responseData.serviceCenters = serviceCenters;
        }
  
        if (userTypes.includes('technician')) {
          const technicians = await TechnicianModal.find(dateQuery);
          responseData.technicians = technicians;
        }
  
        if (userTypes.includes('brand')) {
          const brands = await BrandRegistrationModel.find(dateQuery);
          responseData.brands = brands;
        }
  
        return res.json({ summary: 'User Report', data: responseData });
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
  
      let query = {};
      let dateQuery = {};
  
      if (startDate && endDate) {
        dateQuery.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
      }
  
      if (reportType === 'USER') {
        const userTypes = Object.keys(filters.userType).filter(type => filters.userType[type]);
        let responseData = {};
  
        if (userTypes.includes('customer')) {
          const customers = await UserModel.find(dateQuery);
          responseData.customers = customers;
        }
  
        if (userTypes.includes('serviceCenter')) {
          const serviceCenters = await ServiceModel.find(dateQuery);
          responseData.serviceCenters = serviceCenters;
        }
  
        if (userTypes.includes('technician')) {
          const technicians = await TechnicianModal.find(dateQuery);
          responseData.technicians = technicians;
        }
  
        if (userTypes.includes('brand')) {
          const brands = await BrandRegistrationModel.find(dateQuery);
          responseData.brands = brands;
        }
  
        return res.json({ summary: 'User Report', data: responseData });
      }
  
      if (reportType === 'COMPLAINT') {
        if (filters.status) {
          const statuses = Object.keys(filters.status).filter(status => filters.status[status]);
          if (statuses.length) {
            query.status = { $in: statuses };
          }
        }
  
        if (filters.product.length) {
          const products = await ProductModel.find({ name: { $in: filters.product } });
          const productIds = products.map(product => product._id);
          if (productIds.length) {
            query.productId = { $in: productIds };
          } else {
            return res.json({ summary: 'Complaint Report', complaints: [] });
          }
        }
  
        if (filters.brand.length) {
          const brands = await BrandRegistrationModel.find({ name: { $in: filters.brand } });
          const brandIds = brands.map(brand => brand._id);
          if (brandIds.length) {
            query.brandId = { $in: brandIds };
          } else {
            return res.json({ summary: 'Complaint Report', complaints: [] });
          }
        }
  
        if (filters.serviceCenter.length) {
          const services = await ServiceModel.find({ name: { $in: filters.serviceCenter } });
          const serviceIds = services.map(service => service._id);
          if (serviceIds.length) {
            query.serviceCenterId = { $in: serviceIds };
          } else {
            return res.json({ summary: 'Complaint Report', complaints: [] });
          }
        }
  
        if (filters.technician.length) {
          const technicians = await TechnicianModal.find({ name: { $in: filters.technician } });
          const technicianIds = technicians.map(technician => technician._id);
          if (technicianIds.length) {
            query.technicianId = { $in: technicianIds };
          } else {
            return res.json({ summary: 'Complaint Report', complaints: [] });
          }
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
  
        const complaints = await ComplaintModal.find(query);
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
  



  router.post('/filterData11', async (req, res) => {
    try {
      const { reportType, startDate, endDate, filters } = req.body;
      console.log('Received payload:', req.body);
  
      if (reportType === 'USER') {
        const userTypes = Object.keys(filters.userType).filter(type => filters.userType[type]);
        let responseData = {};
        let dateQuery = {};
  
        // Create date range query if both startDate and endDate are provided
        if (startDate && endDate) {
          dateQuery = {
            createdAt: { 
              $gte: new Date(startDate), 
              $lte: new Date(endDate) 
            }
          };
        }
  
        if (userTypes.includes('customer')) {
          const customers = await UserModel.find(dateQuery);
          responseData.customers = customers;
        }
  
        if (userTypes.includes('serviceCenter')) {
          const serviceCenters = await ServiceModel.find(dateQuery);
          responseData.serviceCenters = serviceCenters;
        }
  
        if (userTypes.includes('technician')) {
          const technicians = await TechnicianModal.find(dateQuery);
          responseData.technicians = technicians;
        }
  
        if (userTypes.includes('brand')) {
          const brands = await BrandRegistrationModel.find(dateQuery);
          responseData.brands = brands;
        }
  
        return res.json({ summary: 'User Report', data: responseData });
      }
  
      res.status(400).json({ error: 'Invalid report type' });
    } catch (error) {
      console.error('Error filtering data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

module.exports = router;
