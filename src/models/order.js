const mongoose = require("mongoose")

const OrderSchema = mongoose.Schema({
    ticketID: {
        type: String,
        // unique: true,
        // sparse: true  
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
    // attachments: {
    //     type: [String]
    // },

    status: { type: String, default: "ORDER" }

}, { timestamps: true });
const OrderModel = mongoose.model("Order", OrderSchema)
module.exports = OrderModel;