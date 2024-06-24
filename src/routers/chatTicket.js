const express=require("express");
const router=express.Router();
 
 const { addChatTicket,getAllChatTicket,getChatTicketById,editChatTicket,deleteChatTicket}=require("../controllers/chatTicketController")

router.post("/addChatTicket",addChatTicket );
router.get("/getAllChatTicket",getAllChatTicket );
router.get("/getChatTicket/:id",getChatTicketById );
router.patch("/editChatTicket/:id",editChatTicket );
router.delete("/deleteChatTicket/:id",deleteChatTicket );

module.exports=router;