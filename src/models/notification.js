const mongoose=require("mongoose")

const notificationSchema=mongoose.Schema({
    userId: { type: String  },
    brandId: { type: String  },
    brandName: { type: String  },
    message: { type: String },
    
    // recipient: { type: String, required: true },
  },{timestamps:true})
  
  const NotificationModal=new mongoose.model("Notification",notificationSchema);
  
  module.exports=NotificationModal;