const mongoose = require("mongoose");


const adminRegistrationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    contact: { type: Number, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "ADMIN" },
},
    { timestamps: true });

const bradRegistrationSchema = new mongoose.Schema({
    brandName: {
        type: String,
        required: true
      },
      username: {
        type: String,
        // required: true
      },
      brandID: {
        type: String,
        required: true
      },
      brandDescription: {
        type: String,
        required: true
      },
      contactPersonName: {
        type: String,
        required: true
      },
      contactPersonEmail: {
        type: String,
        // required: true,
        // unique: true
      },
      contactPersonPhoneNumber: {
        type: String,
        required: true
      },
      streetAddress: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      postalCode: {
        type: String,
        required: true
      },
      country: {
        type: String,
        required: true
      },
      email: {
        type: String,
        // required: true,
        // unique: true
      },
      password: {
        type: String,
        required: true
      },
      websiteURL: {
        type: String
      },
      industry: {
        type: [String],
        required: true
      },
      companySize: {
        type: String,
        required: true
      },
      termsAndConditions: {
        type: Boolean,
        // required: true
      },
      privacyPolicy: {
        type: Boolean,
        // required: true
      },
      role: { type: String, default: "BRAND" },
      verification: { type: String, default: "VERIFIED" }
      , otp: { type: Number },
  
      status: { type: String, default: "ACTIVE" },
    }, { timestamps: true });
 
    const technicianSchema=new mongoose.Schema({
 
        name:{type:String,required:true},
        contact:{type:String,required:true},
        serviceName:{type:String },
        email:{type:String,required:true},
        password:{type:String },
        image:{type:String },
        serviceId:{type:String },
        address:{type:String },
        certificate:{type:String },
        skill:{type:String },
        liveStatus:{type:String,default:"AVAILABLE"},
        role: { type: String, default: "TECHNICIAN" },
        verification: { type: String, default: "VERIFIED" }
        , otp: { type: Number },
        status: { type: String, default: "ACTIVE" },
        totalAmount: { type: Number, default: 0 },
        walletAmount: { type: Number, default: 0 },
        acceptedTerms: {
          type: Boolean,
          
        },
  },{timestamps:true}
);


const serviceCenterRegistrationSchema = new mongoose.Schema({
    serviceCenterName: {
        type: String,
        required: true
    },
    serviceCenterType: {
        type: String,
        required: true
    },
    registrationNumber: {
        type: String,
        required: true
    },
    tin: {
        type: String,
        required: true
    },
    contactPersonName: {
        type: String,
        required: true
    },
    contactPersonPosition: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        // match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    },
    contact: {
        type: String,
        required: true
    },
    streetAddress: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    postalCode: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    serviceCategories: {
        type: [String],
        required: true
    },
    brandsSupported: {
        type: [String],
        required: true
    },
    technicianCertifications: {
        type: String,
        required: true
    },
    operatingHours: {
        type: String,
        required: true
    },
    yearsInOperation: {
        type: String,
        required: true
    },
    numberOfTechnicians: {
        type: String,
        required: true
    },
    averageTurnaroundTime: {
        type: String,
        required: true
    },
    insuranceCoverage: {
        type: Boolean,
        default: false
    },
    username: {
        type: String,
        // required: true
    },
    password: {
        type: String,
        required: true
    },
    // businessLicense: {
    //     type: String  
    // },
    // taxDocument: {
    //     type: String  
    // },
    // certificationDocuments: {
    //     type: String  
    // },
    agreement: {
        type: Boolean,
        required: true
    },
    privacyPolicy: {
        type: Boolean,
        required: true
    },


    role: { type: String, default: "SERVICE" },
    verification: { type: String, default: "VERIFIED" }
    , otp: { type: Number },

    status: { type: String, default: "ACTIVE" },
    totalAmount: { type: Number, default: 0 },
    walletAmount: { type: Number, default: 0 }
}, { timestamps: true });

const employeeRegistrationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    contact: { type: Number, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "EMPLOYEE" }
},
    { timestamps: true });


const dealerRegistrationSchema = new mongoose.Schema({
    name: { type: String, required: true },
   
    businessAddress: {
      type: String,
      required: true,
    },
    contactPerson: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      // match: [/\S+@\S+\.\S+/, 'is invalid'],
    },
    contact: {
      type: String,
      required: true,
      // match: [/^\d{10}$/, 'is invalid'], // Assuming phone number is a 10-digit number
    },
    businessRegistrationNumber: {
      type: String,
      required: true,
    },
    gstVatNumber: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    acceptedTerms: {
      type: Boolean,
      required: true,
    },
    verification: { type: String, default: "VERIFIED" }
    , otp: { type: Number },
    role: { type: String, default: "DEALER" },
    totalAmount: { type: Number, default: 0 },
    walletAmount: { type: Number, default: 0 }
},
    { timestamps: true });

const userRegistrationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    contact: { type: String, required: true },
    password: { type: String, required: true },
    address: { type: String  },
    role: { type: String, default: "USER" },
    verification: { type: String, default: "VERIFIED" }
    ,
    acceptedTerms: {
      type: Boolean,
      required: true,
    },
    otp: { type: Number }
},
    { timestamps: true });

const BrandRegistrationModel = mongoose.model("BrandRegistration", bradRegistrationSchema);
const AdminModel = mongoose.model("AdminRegistration", adminRegistrationSchema);
const DealerModel = mongoose.model("DealerRegistration", dealerRegistrationSchema);
const ServiceModel = mongoose.model("ServiceRegistration", serviceCenterRegistrationSchema);
const TechnicianModal=  mongoose.model("Technician",technicianSchema);
const EmployeeModel = mongoose.model("EmpolyeeRegistration", employeeRegistrationSchema);
const UserModel = mongoose.model("UserRegistration", userRegistrationSchema);

module.exports = {
    BrandRegistrationModel,
    AdminModel,
    ServiceModel,
    TechnicianModal,
    EmployeeModel,
    DealerModel,
    UserModel
};