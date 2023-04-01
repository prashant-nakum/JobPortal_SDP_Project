const mongoose = require("mongoose");

const addJobSchema = new mongoose.Schema({

  companyName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true
  },
  jobType: {
    type: String,
    required: true,
  },

  fieldTypes: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },

  salary: {
    type: String,
    required: true,
  },
  
  openDate: {
    type: Date,
    required: true,
  },
  closeDate: {
    type: Date,
    required: true,
  },

  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },

  ageLimit: {
    type: Number,
    required: true,
  },

  vacancies: {
    type: Number,
    required: true,
  },
  skills:{
      type: String,
      required: true,
  },
  qualification: {
      type: String,
      required: true,
    }
});

const Job = new mongoose.model("Job", addJobSchema);

module.exports = Job;
