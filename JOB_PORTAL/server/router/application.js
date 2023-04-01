const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const cloudinary = require("./cloudinary");
const multer = require("multer");
const Application = require("../model/appDetailSchema");
const Applicant = require("../model/applicantSchema");
const Company = require("../model/companySchema");
const authenticate = require("../middleware/authenticate");

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage }); //we specify that multer use storage engine storage

//Get all the application
router.get("/getApplications", authenticate, async (req, res) => {
  try {
    const token = req.cookies.jwttoken;
    const tokenVerify = jwt.verify(token, process.env.SECRET_KEY);

    const applicant = await Applicant.findOne({
      _id: tokenVerify._id,
      "tokens.token": token,
    });
    if (applicant) {
      if (applicant.role === 1) {
        //applicant
        const currentrole = { currentrole: applicant.role };
        const applications = await Application.find({
          email: applicant.email,
        }).populate("company_id");
        applications.push(currentrole);
        return res.status(200).json(applications);
      } else {
        //admin
        const currentrole = { currentrole: applicant.role };
        const applications = await Application.find().populate("company_id");
        applications.push(currentrole);
        return res.status(200).json(applications);
      }
    } else {
      //company
      const company = await Company.findOne({
        _id: tokenVerify._id,
        "tokens.token": token,
      });
      const currentrole = { currentrole: company.role }; //this is for role of company
      const applications = await Application.find({
        company_email: company.email,
      }).populate("company_id");
      applications.push(currentrole);
      return res.status(200).json(applications);
    }
  } catch (err) {
    console.log(err);
  }
});

//Add application
router.post("/addApplication", upload.single("resume"), async (req, res) => {
  const {
    name,
    email,
    mobile,
    gender,
    age,
    experience,
    qualification,
    skills,
    company_email,
    job_id,
  } = req.body;

  //first check if any field is empty
  if (
    !name ||
    !email ||
    !mobile ||
    !gender ||
    !age ||
    !experience ||
    !qualification ||
    !skills ||
    !job_id
  ) {
    return res.status(400).json({
      error: "Plz fill all the fields",
    });
  }
  try {
    //upload the resume pdf onto the cloudinary
    await cloudinary.uploader.upload(
      req.file.path,
      { resource_type: "raw" },
      async (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Pdf is not uploaded successfully in cloudinary" });
        } else {
          //get the current user from the jwt token
          const token = req.cookies.jwttoken;
          const tokenVerify = jwt.verify(token, process.env.SECRET_KEY);
          const userExist = await Applicant.findOne({
            _id: tokenVerify._id,
            "tokens.token": token,
          });
          //compare the current user email and entered email in the application form
          if (userExist.email !== email) {
            return res.status(422).json({ error: "Email is not match" });
          }
          const companydetails = await Company.findOne({
            email: company_email,
          });
          if (!companydetails) {
            return res.status(404).json({ error: "Company not found" });
          }
          const application = new Application({
            name,
            email,
            mobile,
            gender,
            age,
            experience,
            qualification,
            skills,
            company_email,
            resume: result.secure_url,
            company_id: companydetails._id,
            job_id,
          });
          const applicationRegister = await application.save();

          if (applicationRegister) {
            res.status(201).json({ message: "Application added successfully" });
          } else {
            res
              .status(400)
              .json({ error: "Application not added successfully" });
          }
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
});

//Delete the application from database which id is matches
router.delete("/application/:id", async (req, res) => {
  try {
    const result = await Application.deleteOne({ _id: req.params.id });
    if (!result) {
      return res.status(400).json({ error: "Application not deleted" });
    }
    return res.status(200).json(result);
  } catch (err) {
    console.log(err);
  }
});

//Get the old detail of application
router.get("/updateapplication/:id", async (req, res) => {
  let result = await Application.findOne({ _id: req.params.id });
  if (result) {
    res.status(200).send(result);
  } else {
    res.status(400).send({ result: "no record found" });
  }
});

//Update the details of database
router.put("/updateapplication/:id", async (req, res) => {
  const {
    name,
    email,
    mobile,
    gender,
    age,
    experience,
    qualification,
    skills,
  } = req.body;

  if (
    !name ||
    !email ||
    !mobile ||
    !gender ||
    !age ||
    !experience ||
    !qualification ||
    !skills
  ) {
    return res.status(400).json({
      error: "Plz fill all the fields",
    });
  }
  let result = await Application.updateOne(
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

//Update resume
router.put("/changeResume/:id", upload.single("resume"), async (req, res) => {
  try {
    await cloudinary.uploader.upload(
      req.file.path,
      { resource_type: "raw" },
      async (err, resumeurl) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Pdf is not uploaded successfully in cloudinary" });
        } else {
          let result = await Application.updateOne(
            { _id: req.params.id },
            {
              $set: {
                resume: resumeurl.secure_url,
              },
            }
          );
          if (result) {
            res.status(200).send(result);
          } else {
            res.status(400).send({ result: "no record found" });
          }
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
});

//Search application
router.get("/searchApplication/:key", async (req, res) => {
  try {
    let result;
    const extr = { extra: "extra" };
    const token = req.cookies.jwttoken;
    const tokenVerify = jwt.verify(token, process.env.SECRET_KEY);
    const applicant = await Applicant.findOne({
      _id: tokenVerify._id,
      "tokens.token": token,
    });
    if (applicant) {
      if (applicant.role === 1) {
        //applicant
        result = await Application.find({
          $and: [
            { email: applicant.email },
            {
              $or: [
                { name: { $regex: req.params.key, $options: "i" } },
                { email: { $regex: req.params.key, $options: "i" } },
                { company_email: { $regex: req.params.key, $options: "i" } },
                { experience: { $regex: req.params.key, $options: "i" } },
                { qualification: { $regex: req.params.key, $options: "i" } },
                { skills: { $regex: req.params.key, $options: "i" } },
              ],
            },
          ],
        }).populate("company_id");
      } else {
        //admin
        result = await Application.find({
          $or: [
            { name: { $regex: req.params.key, $options: "i" } },
            { email: { $regex: req.params.key, $options: "i" } },
            { company_email: { $regex: req.params.key, $options: "i" } },
            { experience: { $regex: req.params.key, $options: "i" } },
            { qualification: { $regex: req.params.key, $options: "i" } },
            { skills: { $regex: req.params.key, $options: "i" } },
          ],
        }).populate("company_id");
      }
    } else {
      //company
      const company = await Company.findOne({
        _id: tokenVerify._id,
        "tokens.token": token,
      });
      result = await Application.find({
        $and: [
          { company_email: company.email },
          {
            $or: [
              { name: { $regex: req.params.key, $options: "i" } },
              { email: { $regex: req.params.key, $options: "i" } },
              { company_email: { $regex: req.params.key, $options: "i" } },
              { experience: { $regex: req.params.key, $options: "i" } },
              { qualification: { $regex: req.params.key, $options: "i" } },
              { skills: { $regex: req.params.key, $options: "i" } },
            ],
          },
        ],
      }).populate("company_id");
    }
    result.push(extr);
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
  }
});

//When accept application then make hired=1
router.put("/acceptapp/:id", async (req, res) => {
  console.log(req.body.hired);
  try {
    const application = await Application.findOne({ _id: req.params.id });
    const result = await Application.updateOne(
      { _id: req.params.id },
      {
        $set: {
          hired: req.body.hired,
        },
      }
    );
    if (result) {
      //send confirmation email to applicant when application is accepted
      /*let HelperOptions = {
              from : process.env.NAME + '<'+ (process.env.EMAIL_ID)+'>' ,
              to : application.email,
              subject: "Congrats!! You are Selected",
              text : "YOU are selected in" + application.company_id.companyName + " Company\n\n + Company Email : " +  application.company_id.email + "\n\n + Company Contact : " + application.company_id.mobile + ".\n\nRegards, \nPrashant Nakum"
            };
            transporter.sendMail(HelperOptions, (err, info) => {
              if(err){ 
                return res.status(400).json({error : "Application not accepted successfully"})
              }
              return res.status(200).json({message : "Application is Accepted"});
            });
             */
      return res.status(200).json({ message: "Application is Accepted" });
    } else {
      return res.status(400).json({ error: "Application not accepted" });
    }
  } catch (err) {
    console.log(err);
  }
});

//For getting the accepted application from database
router.get("/getAcceptedApplication", async (req, res) => {
  try {
    const token = req.cookies.jwttoken;
    const tokenVerify = jwt.verify(token, process.env.SECRET_KEY);
    const company = await Company.findOne({
      _id: tokenVerify._id,
      "tokens.token": token,
    });

    const application = await Application.find({
      company_email: company.email,
      hired: 1,
    });
    if (application) {
      res.status(200).json(application);
    } else {
      return res.status(400).json({ error: "No application found" });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
