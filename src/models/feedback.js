const mongoose=require("mongoose")

const feedbackSchema=mongoose.Schema({
    ticketNumber: { type: String, required: true },
    customerName: { type: String, required: true },
    emailAddress: { type: String, required: true },
    overallsatisfaction: { type: Number, required: true },
    servicequality: { type: Number,  },
    brandId: { type: String,  },
    brandName: { type: String,  },
    serviceCenter: { type: String,  },
    technician : { type: String,  },
    replyMessage: { type: String,  },
    timeliness: { type: Number, required: true },
    professionalism: { type: Number, required: true },
    comments: { type: String, required: false },
    issuesFaced: { type: String, required: false },
    recommendationLikelihood: { type: Number, required: true },
    futureServiceInterest: { type: String   },
    serviceDate: { type: String   },
    status:{ type:String,default:"NEW"}
  },{timestamps:true})
  
  const FeedbackModal=new mongoose.model("Feedback",feedbackSchema);
  
  module.exports=FeedbackModal;