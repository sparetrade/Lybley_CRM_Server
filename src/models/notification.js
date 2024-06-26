const mongoose=require("mongoose")

const notificationSchema=mongoose.Schema({
    userId: { type: String  },
    userName: { type: String  },
    message: { type: String },
    title: { type: String },
    status:{ type:String,default:"UNREAD"}
  },{timestamps:true})
  
  const NotificationModal=new mongoose.model("Notification",notificationSchema);
  
  module.exports=NotificationModal;