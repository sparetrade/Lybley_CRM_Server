const mongoose = require("mongoose")

const OrderSchema = mongoose.Schema({
    ticketID: {
        type: String,
          
    },
    sparepartId: {
        type: String
    },
    partName: {
        type: String
    },
    partNumber: {
        type: String
    },
    quantity: {
        type: Number
    },
    priorityLevel: {
        type: String,
        enum: ['Standard', 'Urgent']
    },
    supplierInformation: {
        name: {
            type: String
        },
        contact: {
            type: String
        },
        address: {
            type: String
        },
        pinCode: {
            type: String
        }
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    expectedDeliveryDate: {
        type: Date
    },
    shippingMethod: {
        type: String,
        enum: ['Standard', 'Express']
    },
    comments: {
        type: String
    },
    brand: {
        type: String
    },
    brandId: {
        type: String
    },
    serviceCenter: {
        type: String
    },
    serviceCenterId: {
        type: String
    },
    shipyariOrder:{type:Object},
    // attachments: {
    //     type: [String]
    // },
    spareParts: [
        {
            sparePartId: { type: String, required: true },
            sparePartName: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
        }
    ],
    brandId: {
        type: String
    }, brandName: {
        type: String
    },
    serviceCenterId: { type: String, required: true },
    serviceCenter: { type: String, required: true },
    docketNo: { type: String, required: true },
    trackLink: { type: String, required: true },
    chalanImage: { type: String, required: true },
    status: { type: String, default: "ORDER" },
    comments: {
        type: String
    },
    brandApproval: { type: String, default: "APPROVED" }

}, { timestamps: true });
const OrderModel = mongoose.model("Order", OrderSchema)
module.exports = OrderModel;