const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const authenticate = require("../middleware/authenticate");
require("../db/conn");
const Applicant = require("../model/applicantSchema");
const Company = require("../model/companySchema");
const Job = require("../model/jobDetailsSchema");
const Application = require("../model/appDetailSchema");

//get all job from the database

router.get("/getJobs", authenticate, async (req, res) => {
  try {
    const token = req.cookies.jwttoken;
    const tokenVerify = jwt.verify(token, process.env.SECRET_KEY);
    const company = await Company.findOne({
      _id: tokenVerify._id,
      "tokens.token": token,
    });
    if (company) {
      //company
      //here add current role because that is needed at frontend
      const currentrole = { currentrole: company.role };
      const jobs = await Job.find({ email: company.email });
      jobs.push(currentrole);
      return res.status(200).json(jobs);
    } else {
      const applicant = await Applicant.findOne({
        _id: tokenVerify._id,
        "tokens.token": token,
      });
      const currentrole = { currentrole: applicant.role };
      //applicant or admin
      const jobs = await Job.find();
      jobs.push(currentrole);
      return res.status(200).json(jobs);
    }
  } catch (err) {
    console.log(err);
  }
});

//add job into database
router.post("/addJob", async (req, res) => {
  const {
    vacancies,
    city,
    state,
    skills,
    ageLimit,
    experience,
    salary,
    qualification,
    openDate,
    closeDate,
    jobType,
    fieldTypes,
    gender,
  } = req.body;

  //check if any field is empty
  if (
    !vacancies ||
    !city ||
    !state ||
    !skills ||
    !ageLimit ||
    !experience ||
    !salary ||
    !qualification ||
    !openDate ||
    !closeDate ||
    !jobType ||
    !fieldTypes ||
    !gender
  ) {
    res.json({ message: "plz fill all the field" });
  }
  try {
    //verify with jwt token and get _id of current user from jwt token
    const token = req.cookies.jwttoken;
    const tokenVerify = jwt.verify(token, process.env.SECRET_KEY);
    const companyExist = await Company.findOne({
      _id: tokenVerify._id,
      "tokens.token": token,
    });

    if (!companyExist) {
      res.json({ message: "You are not company" });
    }
    const email = companyExist.email;
    console.log("Email : ", email);
    const job = new Job({
      companyName: companyExist.companyName,
      email,
      vacancies,
      city,
      state,
      skills,
      ageLimit,
      experience,
      salary,
      qualification,
      openDate,
      closeDate,
      jobType,
      fieldTypes,
      gender,
    });

    const addJob = await job.save();
    if (addJob) {
      res.status(201).json({ message: "Job added successfully" });
    } else {
      res.status(500).json({ error: "Failed to add job" });
    }
  } catch (err) {
    console.log(err);
  }
});

//delete job of specified id 

router.delete("/job/:id", async (req, res) => {
  try {
    let result = await Job.deleteOne({ _id: req.params.id });
    result = await Application.deleteMany({ job_id: req.params.id });
    if (!result) {
      return res.status(400).json({ error: "Job not deleted" });
    }
    return res.status(200).json(result);
  } catch (err) {
    console.log(err);
  }
});

//get the detail of job by id, for update job detail
router.get("/updatejob/:id", async (req, res) => {
  let result = await Job.findOne({ _id: req.params.id });
  if (result) {
    res.send(result);
  } else {
    res.send({ result: "no record found" });
  }
});

//update the job detail in database
router.put("/updatejob/:id", async (req, res) => {
  const {
    vacancies,
    city,
    state,
    skills,
    ageLimit,
    experience,
    salary,
    qualification,
    openDate,
    closeDate,
    jobType,
    fieldTypes,
    gender,
  } = req.body;
  if (
    !vacancies ||
    !city ||
    !state ||
    !skills ||
    !ageLimit ||
    !experience ||
    !salary ||
    !qualification ||
    !openDate ||
    !closeDate ||
    !jobType ||
    !fieldTypes ||
    !gender
  ) {
    return res.status(400).json({ message: "plz fill all the field" });
  }

  let result = await Job.updateOne(
    { _id: req.params.id },
    {
      $set: req.body,
    }
  );
  if (result) {
    res.status(200).send(result);
  } else {
    res.status(400).send({ result: "no record found" });
  }
});


//Search the job based on key
router.get("/searchJob/:key", async (req, res) => {
  console.log(req.params.key);
  try {
    const extr = { extra: "extra" }; // appended extra for frontend because at frontend we not display last element
    const token = req.cookies.jwttoken;
    const tokenVerify = jwt.verify(token, process.env.SECRET_KEY);
    const company = await Company.findOne({
      _id: tokenVerify._id,
      "tokens.token": token,
    });
    if (company) {
      const result = await Job.find({
        $and: [
          { email: company.email },
          {
            $or: [
              { companyName: { $regex: req.params.key, $options: "i" } },
              { fieldTypes: { $regex: req.params.key, $options: "i" } },
              { email: { $regex: req.params.key, $options: "i" } },
              { jobType: { $regex: req.params.key, $options: "i" } },
              { experience: { $regex: req.params.key, $options: "i" } },
              { salary: { $regex: req.params.key, $options: "i" } },
              { skills: { $regex: req.params.key, $options: "i" } },
              { qualification: { $regex: req.params.key, $options: "i" } },
              { city: { $regex: req.params.key, $options: "i" } },
              { state: { $regex: req.params.key, $options: "i" } },
            ],
          },
        ],
      });
      result.push(extr);
      res.status(200).send(result);
    } else {
      const result = await Job.find({
        $or: [
          { companyName: { $regex: req.params.key, $options: "i" } },
          { fieldTypes: { $regex: req.params.key, $options: "i" } },
          { email: { $regex: req.params.key, $options: "i" } },
          { jobType: { $regex: req.params.key, $options: "i" } },
          { experience: { $regex: req.params.key, $options: "i" } },
          { salary: { $regex: req.params.key, $options: "i" } },
          { skills: { $regex: req.params.key, $options: "i" } },
          { qualification: { $regex: req.params.key, $options: "i" } },
          { city: { $regex: req.params.key, $options: "i" } },
          { state: { $regex: req.params.key, $options: "i" } },
        ],
      });
      result.push(extr);
      res.status(200).send(result);
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
