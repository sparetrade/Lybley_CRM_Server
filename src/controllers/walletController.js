const WalletModel = require("../models/wallet")
const BankDetail = require("../models/bankDetails");
const { default: axios } = require("axios");

// const addWallet = async (req, res) => {
//   try {
//     const { serviceCenterName } = req.body;

//     // Check if the spare part name already exists
//     const existingserviceCente = await WalletModel.findOne({ serviceCenterName });
//     if (existingserviceCente) {
//       return res.json({ status: false, msg: "Service Center already exists in Wallets" });
//     }

//     // If not, proceed to add the new spare part
//     const walletData = new WalletModel(req.body);
    
// console.log(walletData);
//     const contactData = {
//       name: req.body.accountHolderName,
//       email: req.body.email,
//       contact: req.body.contact,
//       type: "employee",
//       reference_id: "Acme Contact ID 12345",
//       notes: {
//         random_key_1: "Make it so.",
//         random_key_2: "Tea. Earl Grey. Hot."
//       }
//     }
//     let response = await axios.post("https://api.razorpay.com/v1/contacts", contactData, { headers: { Authorization: "Basic " + new Buffer.from(process.env.RAZORPAYX_KEY_ID + ":" + process.env.RAZORPAYX_KEY_SECRET).toString("base64") } });
//     const { data } = response;
//     console.log("contacts data",data);
//     // cont_OY1HeeDKMAT7YO
//     if (data) {
//       const fundData = {
//         name: req.body.accountHolderName,
//         email: req.body.email,
//         contact: req.body.contact,
//         account_type: "bank_account",
//         // contact_id: data.id,
//         contact_id:  "cont_OY1HeeDKMAT7YO",
        
//       }
//     }
//       let response1 = await axios.post("https://api.razorpay.com/v1/fund_accounts", fundData, { headers: { Authorization: "Basic " + new Buffer.from(process.env.RAZORPAYX_KEY_ID + ":" + process.env.RAZORPAYX_KEY_SECRET).toString("base64") } });
//       const { data } = response1;
//       console.log("fund_accounts data",data);
//       const walletDetails = await BankDetail.findById(req.body.bankDetailId);
//       console.log("walletDetails data",walletDetails);

//       if (!walletDetails) {
//         return res.status(404).json({ status: false, msg: 'Bank Detail not found' });
//       }

//       walletDetails.fund_account_id =  data.fund_account_id;
//       await walletDetails.save();
//       res.send(data);
    
//     res.send(data);
//     await walletData.save();
//     res.json({ status: true, msg: "Wallet Added" });
//   } catch (err) {
//     res.status(400).send(err);
//   }
// };


const addWallet = async (req, res) => {
  try {
    const { serviceCenterName, accountHolderName, email, contact, bankDetailId, accountNumber, ifsc } = req.body;

    // Check if the service center name already exists
    const existingServiceCenter = await WalletModel.findOne({ serviceCenterName });
    if (existingServiceCenter) {
      return res.json({ status: false, msg: "Service Center already exists in Wallets" });
    }

    // Create new wallet data
    const walletData = new WalletModel(req.body);

    // Create contact data
    const contactData = {
      name: accountHolderName,
      email: email,
      contact: contact,
      type: "employee",
      reference_id: "Acme Contact ID 12345",
      notes: {
        random_key_1: "Make it so.",
        random_key_2: "Tea. Earl Grey. Hot."
      }
    };

    // Send request to create contact
    let response = await axios.post("https://api.razorpay.com/v1/contacts", contactData, { 
      headers: { 
        Authorization: "Basic " + Buffer.from(process.env.RAZORPAYX_KEY_ID + ":" + process.env.RAZORPAYX_KEY_SECRET).toString("base64") 
      } 
    });

    const { data: contactDataResponse } = response;
    // console.log("contacts data", contactDataResponse);

    // Check if contact creation was successful
    if (contactDataResponse && contactDataResponse.id) {
      // Create fund account data
      const fundData = {
        contact_id: contactDataResponse.id,
        account_type: "bank_account",
        bank_account: {
          name: accountHolderName,
          ifsc: ifsc,
          account_number: accountNumber,
        }
      };

      // Send request to create fund account
      let response1 = await axios.post("https://api.razorpay.com/v1/fund_accounts", fundData, { 
        headers: { 
          Authorization: "Basic " + Buffer.from(process.env.RAZORPAYX_KEY_ID + ":" + process.env.RAZORPAYX_KEY_SECRET).toString("base64") 
        } 
      });

      const { data: fundAccountData } = response1;
      // console.log("fund_accounts data", fundAccountData);

      const walletDetails = await BankDetail.findById(bankDetailId);
      console.log("walletDetails data", walletDetails);

      if (!walletDetails) {
        return res.status(404).json({ status: false, msg: 'Bank Detail not found' });
      }

      walletDetails.fund_account_id = fundAccountData.id;
      await walletDetails.save();
    }

    await walletData.save();
    res.json({ status: true, msg: "Wallet Added" });
  } catch (err) {
    console.error('Error:', err.response ? err.response.data : err.message); // Log detailed error
    res.status(400).send(err.response ? err.response.data : err.message);
  }
};

const getAllWallet = async (req, res) => {
  try {
    let data = await WalletModel.find({}).sort({ _id: -1 });
    res.send(data);
  } catch (err) {
    res.status(400).send(err);
  }
}
const getWalletById = async (req, res) => {
  try {
    let _id = req.params.id;
    let data = await WalletModel.findById(_id);
    res.send(data);
  } catch (err) {
    res.status(400).send(err);
  }
}
const getWalletByCenterId = async (req, res) => {
  try {
    let serviceCenterId = req.params.id;
    let data = await WalletModel.findOne({ serviceCenterId: serviceCenterId });
    if (!data) {
      return res.status(404).send({ message: "Wallet not found" });
    }
    res.send(data);
  } catch (err) {
    res.status(400).send(err);
  }
}

const editWallet = async (req, res) => {
  try {
    let _id = req.params.id;
    let body = req.body;
    let data = await WalletModel.findByIdAndUpdate(_id, body);
    res.json({ status: true, msg: "Wallet Updated" });
  } catch (err) {
    res.status(500).send(err);
  }
}
const deleteWallet = async (req, res) => {
  try {
    let _id = req.params.id;
    let data = await WalletModel.findByIdAndDelete(_id);
    res.json({ status: true, msg: "Wallet Deteled" });
  } catch (err) {
    res.status(500).send(err);
  }
}

module.exports = { addWallet, getAllWallet, getWalletById, getWalletByCenterId, editWallet, deleteWallet };
