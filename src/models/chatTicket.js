const mongoose=require("mongoose");

const chatTicketSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    adminMessage: { type: [String], default: [] },
    userMessage: { type: [String], default: [] }
}, { timestamps: true });

const ChatTicketModel = new mongoose.model("chatTicket",chatTicketSchema);

module.exports=ChatTicketModel; 