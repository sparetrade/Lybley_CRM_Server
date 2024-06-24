const mongoose=require("mongoose");

const chatTicketSchema= new mongoose.Schema({
    userId:{type:String,required:true},
    userName:{type:String,required:true},
     
},{timestamps:true});

const ChatTicketModel = new mongoose.model("chatTicket",chatTicketSchema);

module.exports=ChatTicketModel; 