const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxLength : 32
  },
  company_email: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  hired: {
   type: Number,
   default: 0
  },
  gender: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  experience : {
    type : String,
    required : true
  },
  qualification: {
        type: String,
        required: true
  },
  skills:{ 
      type: String,
      required: true
      },

  resume: {
    type: String,
    required: true
  },
  company_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'company'
  },
  job_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  }
});

const Application = new mongoose.model("application", applicationSchema);

module.exports = Application;
