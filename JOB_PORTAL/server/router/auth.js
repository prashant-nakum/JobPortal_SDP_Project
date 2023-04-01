const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const nodemailer = require("nodemailer");
const multer = require("multer");
const cloudinary = require("./cloudinary");
require("../db/conn");
const Applicant = require("../model/applicantSchema");
const Company = require("../model/companySchema");
const Application = require("../model/appDetailSchema");
const Job = require("../model/jobDetailsSchema");

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage }); //we specify that multer use storage engine storage

// This is for dummy mail send when the user is registered and the application is accepted or rejected
/*let transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: process.env.ETHEREAL_EMAIL_ID,
        pass: process.env.ETHEREAL_EMAIL_PASSWORD
    }
});	
*/

//This is for sending mail from personal email id
/*let transporter = nodemailer.createTransport({
  service : 'gmail',
  secure : false,
  port : 587,
  auth : {
      user : process.env.EMAIL_ID,
      pass : process.env.EMAIL_PASSWORD
  },
  tls : {
      rejectUnauthorized : false
  }});
*/

//get All applicants from the database
router.get("/getApplicants", async (req, res) => {
  try {
    const token = req.cookies.jwttoken;
    const tokenVerify = jwt.verify(token, process.env.SECRET_KEY);
    if (!tokenVerify) {
      res.status(400).json({ error: "first login" });
    }
    const applicant = await Applicant.find();
    res.status(200).json(applicant);
  } catch (err) {
    console.log(err);
  }
});

//Register applicant and add entry in the database
router.post("/registerApplicant", upload.single("photo"), async (req, res) => {
  // we take this because if we not take then we have to write for all req.body.name like this
  // therefore we do this and directly write name, email like this
  // object destructuring
  console.log(req.body.name);
  const { name, dob, email, mobile, password, cpassword } = req.body;
  //now do validation user can't keep any filed empty
  //here 422 is client side error not serverside error server side error start from 500
  if (!name || !dob || !email || !mobile || !password || !cpassword) {
    return res.status(422).json({ error: "Plz fill all the fields" });
  }

  // here we use the cloudinary to upload photo there and get the link of that photo and srore them in database
  try {
    await cloudinary.uploader.upload(
      req.file.path,
      { resource_type: "image" },
      async (err, result) => {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .json({ error: "Error uploading file to Cloudinary" });
        } else {
          const companyExist = await Company.findOne({ email: email });
          const applicantExist = await Applicant.findOne({ email: email });
          //check if user exist or not
          if (applicantExist || companyExist) {
            return res.status(422).json({ error: "Email already exist" });
          }
          //check if password and confirm password are same or not
          else if (password != cpassword) {
            return res
              .status(400)
              .json({ error: "Password and confirm password must match" });
          }
          const applicant = new Applicant({
            name,
            dob,
            email,
            mobile,
            password,
            cpassword,
            photo: result.secure_url,
          });
          // in auth.js password is hash
          const applicantRegister = await applicant.save();
          // await employee.save();
          if (applicantRegister) {
            //This is for send the email when Applicant is register
            /* let HelperOptions = {
            from : process.env.NAME + '<'+ (process.env.EMAIL_ID)+'>' ,
            to : employee.email,
            subject: " Welcome to Our Job Portal",
            text : "Hello " + employee.name + ", \n\nYOU are Registered SuccessFully On Job Portal \n\n Welcome to Our Job Portal. This is a fully functional Job Portal with MERN stack. \nAny suggestions are always welcome. \n\nRegards, \nPrashant Nakum"
          };
          transporter.sendMail(HelperOptions, (err, info) => {
            if(err){ 
              return res.status(400).json({error : "Mail is not sended"})
            }
            res.status(201).json({ message: "user registered successfully" });
          });*/

            res.status(201).json({ message: "user registered successfully" });
          } else {
            res.status(400).json({ error: "Failed to register" });
          }
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
});

//Get all companies from the database
router.get("/getCompanies", authenticate, async (req, res) => {
  try {
    const token = req.cookies.jwttoken;
    const tokenVerify = jwt.verify(token, process.env.SECRET_KEY);
    const rootApplicant = await Applicant.findOne({
      _id: tokenVerify._id,
      "tokens.token": token,
    });
    const currentrole = { currentrole: rootApplicant.role };

    const companies = await Company.find();
    companies.push(currentrole);
    res.status(200).json(companies);
  } catch (err) {
    console.log(err);
  }
});

router.post("/registerCompany", async (req, res) => {
  const {
    companyName,
    contactPersonName,
    email,
    mobile,
    password,
    cpassword,
    state,
    city,
    website,
    linkedin,
  } = req.body;

  if (
    !companyName ||
    !contactPersonName ||
    !email ||
    !mobile ||
    !password ||
    !cpassword ||
    !state ||
    !city ||
    !website ||
    !linkedin
  ) {
    return res.status(400).json({ message: "Plz fill all the fields" });
  }

  try {
    const companyExist = await Company.findOne({ email: email });
    const applicantExist = await Applicant.findOne({ email: email });
    // check if company exist
    if (companyExist || applicantExist) {
      return res.status(422).json({ message: "Email already exist" });
    }
    //check if password and confirm password are same
    else if (password != cpassword) {
      return res
        .status(400)
        .json({ message: "Password and confirm password must be same" });
    }

    const company = new Company({
      companyName,
      contactPersonName,
      email,
      mobile,
      password,
      cpassword,
      state,
      city,
      website,
      linkedin,
    });

    const registerCompany = await company.save();
    console.log(registerCompany);
    if (registerCompany) {
      //this is for send mail when company is register
      /*let HelperOptions = {
        from : process.env.NAME + '<'+ (process.env.EMAIL_ID)+'>' ,
        to : company.email,
        subject: "Welcome to Our Job Portal",
        text : "Hello " + company.contactPersonName + ", \n\nYOU are Registered SuccessFully On Job Portal. \n\nWelcome to Our Job Portal. This is a fully functional Job Portal with MERN stack. \nAny suggestions are always welcome. \n\nRegards, \nPrashant Nakum"
      };
      transporter.sendMail(HelperOptions, (err, info) => {
        if(err){ 
          return res.status(400).json({error : "Mail is not sended"})
        }
        res.status(201).json({ message: "Company registered successfully" });
      }); 
      */
      res.status(201).json({ message: "Company registered successfully" });
    } else {
      res.status(400).json({ error: "Company not registered successfully" });
    }
  } catch (err) {
    console.log(err);
  }
});

//For Login the user
router.post("/signin", async (req, res) => {
  try {
    let token;
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Plz fill all the fields" });
    }

    const applicantLogin = await Applicant.findOne({ email: email });
    const companyLogin = await Company.findOne({ email: email });

    if (applicantLogin) {
      const isMatch = await bcrypt.compare(password, applicantLogin.password);
      token = await applicantLogin.generateAuthToken();

      res.cookie("jwttoken", token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
      });

      if (!isMatch) {
        res.status(400).json({ error: "Invalid Crendentials" });
      } else {
        res.status(200).json(applicantLogin);
      }
    } else if (companyLogin) {
      const isMatch = await bcrypt.compare(password, companyLogin.password);
      token = await companyLogin.generateAuthTokenComp();
      res.cookie("jwttoken", token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
      });

      if (!isMatch) {
        res.status(400).json({ error: "Invalid Crendentials" });
      } else {
        res.status(200).json(companyLogin);
      }
    } else {
      res.status(400).json({ error: "Invalid Crendentials" });
    }
  } catch (err) {
    console.log(err);
  }
});

//Delete Perticular applicant which _id is match
router.delete("/applicant/:id", async (req, res) => {
  try {
    const applicant = await Applicant.findOne({ _id: req.params.id });
    let result = await Applicant.deleteOne({ _id: req.params.id });
    result = await Application.deleteMany({ email: applicant.email });
    if (!result) {
      return res.status(400).json({ error: "Applicant not deleted" });
    }
    return res.status(200).json(result);
  } catch (err) {
    console.log(err);
  }
});

//Delete perticular company which _id is match
router.delete("/company/:id", async (req, res) => {
  try {
    const company = await Company.findOne({ _id: req.params.id });
    console.log(company);
    let result = await Company.deleteOne({ _id: req.params.id });
    result = await Application.deleteMany({ company_email: company.email });
    result = await Job.deleteMany({ email: company.email });
    if (!result) {
      return res.status(400).json({ error: "Company not deleted" });
    }
    return res.status(200).json(result);
  } catch (err) {
    console.log(err);
  }
});

//For Update applicant detail First get the old detail from the database
router.get("/updateapplicant/:id", async (req, res) => {
  try {
    let result = await Applicant.findOne({ _id: req.params.id });
    if (result) {
      res.status(200).send(result);
    } else {
      res.status(400).send({ result: "no record found" });
    }
  } catch (err) {
    console.log(err);
  }
});

//Update applicant detail , save new detail in database
router.put("/updateapplicant/:id", async (req, res) => {
  const { name, dob, email, mobile, password, cpassword } = req.body;
  if (!name || !dob || !email || !mobile || !password || !cpassword) {
    return res.status(422).json({ error: "Plz fill all the fields" });
  }
  try {
    const companyExist = await Company.findOne({ email: email });
    const applicantExist = await Applicant.findOne({ email: email });

    //check if user exist or not
    if (applicantExist && applicantExist.email !== email) {
      return res.status(400).json({ error: "Email already exist" });
    } else if (companyExist && companyExist.email !== email) {
      return res.status(400).json({ error: "Email already exist" });
    }
    //check if password and confirm password are same or not
    else if (password != cpassword) {
      return res
        .status(400)
        .json({ error: "Password and confirm password must match" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);
    const hashedcpassword = await bcrypt.hash(cpassword, salt);

    let result = await Applicant.updateOne(
      { _id: req.params.id },
      {
        $set: {
          name,
          dob,
          email,
          mobile,
          password: hashedpassword,
          cpassword: hashedcpassword,
        },
      }
    );
    if (result) {
      res.status(200).send(result);
    } else {
      res.status(400).send({ result: "no record found" });
    }
  } catch (err) {
    console.log(err);
  }
});

//For update company detail first get old detail from database
router.get("/updatecompany/:id", async (req, res) => {
  let result = await Company.findOne({ _id: req.params.id });
  if (result) {
    res.status(200).send(result);
  } else {
    res.status(400).send({ result: "no record found" });
  }
});

//update company detail in database
router.put("/updatecompany/:id", async (req, res) => {
  const {
    companyName,
    contactPersonName,
    email,
    mobile,
    password,
    cpassword,
    state,
    city,
    website,
    linkedin,
  } = req.body;

  if (
    !companyName ||
    !contactPersonName ||
    !email ||
    !mobile ||
    !password ||
    !cpassword ||
    !state ||
    !city ||
    !website ||
    !linkedin
  ) {
    return res.status(400).json({ message: "Plz fill all the fields" });
  }
  try {
    const companyExist = await Company.findOne({ email: email });
    const applicantExist = await Applicant.findOne({ email: email });
    // check if company exist
    if (applicantExist && applicantExist.email !== email) {
      return res.status(400).json({ error: "Email already exist" });
    } else if (companyExist && companyExist.email !== email) {
      return res.status(400).json({ error: "Email already exist" });
    }
    //check if password and confirm password are same
    else if (password != cpassword) {
      return res
        .status(400)
        .json({ message: "Password and confirm password must be same" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);
    const hashedcpassword = await bcrypt.hash(cpassword, salt);

    let result = await Company.updateOne(
      { _id: req.params.id },
      {
        $set: {
          companyName,
          contactPersonName,
          email,
          mobile,
          password: hashedpassword,
          cpassword: hashedcpassword,
          state,
          city,
          website,
          linkedin,
        },
      }
    );
    if (result) {
      res.status(200).send(result);
    } else {
      res.status(400).send({ result: "no record found" });
    }
  } catch (err) {
    console.log(err);
  }
});

//For update the Profile photo of applicant
router.put("/changePhoto/:id", upload.single("photo"), async (req, res) => {
  try {
    await cloudinary.uploader.upload(
      req.file.path,
      { resource_type: "image" },
      async (err, photourl) => {
        if (err) {
          return res.status(500).json({
            error: "Photo is not uploaded successfully in cloudinary",
          });
        } else {
          let result = await Applicant.updateOne(
            { _id: req.params.id },
            {
              $set: {
                photo: photourl.secure_url,
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

//Search the employee
router.get("/searchApplicant/:key", async (req, res) => {
  const result = await Applicant.find({
    $or: [
      { name: { $regex: req.params.key, $options: "i" } },
      { email: { $regex: req.params.key, $options: "i" } },
    ],
  });
  res.status(200).send(result);
});

router.get("/searchCompany/:key", async (req, res) => {
  const result = await Company.find({
    $or: [
      { companyName: { $regex: req.params.key, $options: "i" } },
      { contactPersonName: { $regex: req.params.key, $options: "i" } },
      { email: { $regex: req.params.key, $options: "i" } },
      { city: { $regex: req.params.key, $options: "i" } },
      { state: { $regex: req.params.key, $options: "i" } },
      { linkedin: { $regex: req.params.key, $options: "i" } },
      { website: { $regex: req.params.key, $options: "i" } },
    ],
  });
  const crr = { cr: "extra" };
  result.push(crr);
  // console.log(result);
  res.status(200).send(result);
});

//This is for authentication check if user logged in then only view profile
router.get("/profile", authenticate, (req, res) => {
  console.log("Hello my profile");
  res.send(req.rootUser);
});

//Logout the user, remove the cookie
router.get("/logout", (req, res) => {
  console.log("Logout user");
  res.clearCookie("jwttoken", { path: "/" });
  res.status(200).send("User Logout Successfully");
});

module.exports = router;
