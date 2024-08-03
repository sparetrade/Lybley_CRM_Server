const axios = require('axios');
// {
//   "success": true,
//   "data": [
//       {
//           "name": "Lalit  Chauhan",
//           "email": "lybley@gmail.com",
//           "sellerId": 132125,
//           "companyId": "00a8dd6f-9a70-497e-b7bd-2c149521fdad",
//           "privateCompanyId": 130776,
//           "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imx5YmxleUBnbWFpbC5jb20iLCJzZWxsZXJJZCI6MTMyMTI1LCJjb21wYW55SWQiOiIwMGE4ZGQ2Zi05YTcwLTQ5N2UtYjdiZC0yYzE0OTUyMWZkYWQiLCJwcml2YXRlQ29tcGFueUlkIjoxMzA3NzYsImlhdCI6MTcyMjY2NTk5MCwiZXhwIjoxNzIzMjcwNzkwfQ.xkZp9QlQO_vYF0JYNYvCVkN2rhw2hDvZ9JEpGTQlCTA",
//           "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imx5YmxleUBnbWFpbC5jb20iLCJzZWxsZXJJZCI6MTMyMTI1LCJjb21wYW55SWQiOiIwMGE4ZGQ2Zi05YTcwLTQ5N2UtYjdiZC0yYzE0OTUyMWZkYWQiLCJwcml2YXRlQ29tcGFueUlkIjoxMzA3NzYsImlhdCI6MTcyMjY2NTk5MCwiZXhwIjoxNzIzMjcwNzkwfQ.xkZp9QlQO_vYF0JYNYvCVkN2rhw2hDvZ9JEpGTQlCTA",
//           "nextStep": {
//               "qna": true,
//               "kyc": true,
//               "bank": false,
//               "isChannelIntegrated": false
//           },
//           "contactNumber": 9953889657,
//           "isWalletRechage": true,
//           "isReturningUser": false,
//           "isMigrated": false,
//           "phpUserId": "",
//           "phpParentId": "",
//           "businessType": "COMPANY",
//           "kycDetails": {
//               "gstNumber": "09AAECL0443M1ZD",
//               "gstVerified": true,
//               "gstFile": "",
//               "panNumber": "AAECL0443M",
//               "panVerified": true,
//               "panFile": "",
//               "aadharNumber": 0,
//               "aadharVerified": false,
//               "aadharFile": "",
//               "address": {
//                   "plotNumber": "A-9, ",
//                   "locality": "sector-59, noida",
//                   "city": "GHAZIABAD",
//                   "district": "GHAZIABAD",
//                   "pincode": 201309,
//                   "state": "UTTAR PRADESH",
//                   "country": "INDIA"
//               },
//               "fullAddress": "A-9, sector-59, noida Noida Sec-62 201309 GHAZIABAD UTTAR PRADESH INDIA",
//               "isKYCDone": true,
//               "fullName": "LYBLEY INDIA PRIVATE LIMITED"
//           },
//           "isMaskedUser": false,
//           "isWalletBlackListed": false
//       }
//   ],
//   "message": "Seller Signed In Successfully."
// }
const SHIPYARI_API_BASE_URL = 'https://api-seller.shipyaari.com/api/v1'; // Replace with the actual base URL
const SHIPYARI_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imx5YmxleUBnbWFpbC5jb20iLCJzZWxsZXJJZCI6MTMyMTI1LCJjb21wYW55SWQiOiIwMGE4ZGQ2Zi05YTcwLTQ5N2UtYjdiZC0yYzE0OTUyMWZkYWQiLCJwcml2YXRlQ29tcGFueUlkIjoxMzA3NzYsImlhdCI6MTcyMjY2NTk5MCwiZXhwIjoxNzIzMjcwNzkwfQ.xkZp9QlQO_vYF0JYNYvCVkN2rhw2hDvZ9JEpGTQlCTA'; // Replace with your Shipyari API key

const shipyariInstance = axios.create({
  baseURL: SHIPYARI_API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${SHIPYARI_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

// Example function to get shipping rates
const getShippingRates = async (data) => {
  try {
    const response = await shipyariInstance.post('/order/placeOrderApiV3', data);
    return response.data;
  } catch (error) {
    console.error('Error fetching shipping rates:', error);
    throw error;
  }
};

// Example function to create a shipment
const createShipment = async (req, res) => {
  const data = req.body;
  // console.log(data);

 
  const pickupPincode = data?.pickupDetails?.pincode;
  const deliveryPincode = data?.deliveryDetails?.pincode;
  const firstBox = data?.boxInfo?.[0] || {}; // Default to an empty object if boxInfo is not available

  const weight = firstBox?.deadWeight; // Weight of the first box
  const dimension = {
    length: firstBox?.length,
    width: firstBox?.breadth,
    height: firstBox?.height
  };
 
  const orderType = "B2C";
  const paymentMode = "PREPAID";
  const invoiceValue = 10;
 

  try {
    // Validate the presence of all required fields
    if (!pickupPincode || !deliveryPincode || !invoiceValue || !paymentMode || !weight || !orderType || !dimension) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check serviceability
    // Uncomment if needed
    const responseAbility = await shipyariInstance.post(
      'order/checkServiceabilityV2',
      {
        pickupPincode,
        deliveryPincode,
        invoiceValue,
        paymentMode,
        weight,
        orderType,
        dimension
      }
    );

    // Check if serviceability was successful
    // Uncomment if needed
    if (responseAbility.data.success) {
      // Proceed with placing the order or any other subsequent actions
      const response = await shipyariInstance.post('/order/placeOrderApiV3', req.body);
      //  res.status(response.status).json(response.data);
      res.status(response.status).json(msg?.response.data.message);
    } else {
      // Handle serviceability failure
      return res.status(400).json({ message: 'Serviceability check failed' });
    }

  } catch (error) {
    // Log and handle errors
    console.error('Error creating shipment:', error);
    return res.status(500).json({ msg: error?.response?.data?.message });
  }
};




const fetchManifest = async (req, res) => {
  const { awbs } = req.body;

  try {
    const response = await shipyariInstance.post(
      'order/fetchManifest',
      { awbs }

    );

    // Forward the response from Shipyaari API to the client
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error fetching manifest:', error);
    res.status(error.response ? error.response.status : 500).json({
      message: 'An error occurred while fetching the manifest',
      error: error.response ? error.response.data : error.message
    });
  }
};
const fetchLabels = async (req, res) => {
  const { awbs } = req.body;

  try {
    const response = await shipyariInstance.post(
      'labels/fetchLabels',
      { awbs }
    );

    // Forward the response from Shipyaari API to the client
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error fetching labels:', error);
    res.status(error.response ? error.response.status : 500).json({
      message: 'An error occurred while fetching the labels',
      error: error.response ? error.response.data : error.message
    });
  }
};
const fetchTaxInvoices = async (req, res) => {
  const { awbs } = req.body;

  try {
    const response = await shipyariInstance.post(
      'labels/fetchTaxInvoices',
      { awbs }
    );

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error fetching tax invoices:', error);
    res.status(error.response ? error.response.status : 500).json({
      message: 'An error occurred while fetching the tax invoices',
      error: error.response ? error.response.data : error.message
    });
  }
};
const cancelShipment = async (req, res) => {
  const { awbs } = req.body;

  try {
    const response = await shipyariInstance.post(
      'order/cancelAWBs',
      { awbs }
    );

    res.status(response.status).json(response.data);
  } catch (error) {
    // Log the error for debugging
    console.error('Error canceling AWBs:', error.response ? error.response.data : error.message);

    // Determine the status code and error message to return
    const statusCode = error.response ? error.response.status : 500;
    const errorMessage = error.response ? error.response.data.message || 'An error occurred while canceling AWBs' : 'An unexpected error occurred';

    // Send the error response to the client
    res.status(statusCode).json({
      message: errorMessage,
      error: error.response ? error.response.data : error.message
    });
  }
};

const trackingShipment = async (req, res) => {
  const { trackingNo } = req.params;

  if (!trackingNo) {
    return res.status(400).json({ msg: 'Tracking number is required' });
  }

  try {
    const response = await shipyariInstance.post(
      `tracking/getTracking?trackingNo=${trackingNo}`,

    );

    res.status(response.status).json(response.data);
  } catch (error) {
    // Log the error for debugging
    console.error('Error fetching tracking information:', error.response ? error.response.data : error.message);

    // Determine the status code and error message to return
    const statusCode = error.response ? error.response.status : 500;
    const errorMessage = error.response ? error.response.data.message || 'An error occurred while fetching tracking information' : 'An unexpected error occurred';

    // Send the error response to the client
    res.status(statusCode).json({
      message: errorMessage,
      error: error.response ? error.response.data : error.message
    });
  }
};

const searchAvailability = async (req, res) => {
  const {
    pickupPincode,
    deliveryPincode,
    invoiceValue,
    paymentMode,
    weight,
    orderType,
    dimension
  } = req.body;

  if (!pickupPincode || !deliveryPincode || !invoiceValue || !paymentMode || !weight || !orderType || !dimension) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  // console.log("req.body",req.body)
  try {
    const response = await shipyariInstance.post(
      `order/checkServiceabilityV2`,
      {
        pickupPincode,
        deliveryPincode,
        invoiceValue,
        paymentMode,
        weight,
        orderType,
        dimension
      },
    );

    res.status(response.status).json(response.data);
  } catch (error) {
    // Log the error for debugging
    console.error('Error checking serviceability:', error.response ? error.response.data : error.message);

    // Determine the status code and error message to return
    const statusCode = error.response ? error.response.status : 500;
    const errorMessage = error.response ? error.response.data.message || 'An error occurred while checking serviceability' : 'An unexpected error occurred';

    // Send the error response to the client
    res.status(statusCode).json({
      message: errorMessage,
      error: error.response ? error.response.data : error.message
    });
  }
};
module.exports = {
  getShippingRates,
  createShipment,
  fetchLabels,
  fetchManifest,
  fetchTaxInvoices,
  cancelShipment, trackingShipment, searchAvailability

};
