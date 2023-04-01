const jwt = require("jsonwebtoken");
const Applicant = require("../model/applicantSchema");
const Company = require("../model/companySchema");

const Authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.jwttoken;
    const tokenVerify = jwt.verify(token, process.env.SECRET_KEY);

    const rootApplicant = await Applicant.findOne({
      _id: tokenVerify._id,
      "tokens.token": token,
    });

    if (!rootApplicant) {
      const rootCompany = await Company.findOne({
        _id: tokenVerify._id,
        "tokens.token": token,
      });
      if (!rootCompany) {
        throw new Error("User not Found");
      } else {
        req.token = token;
        req.rootUser = rootCompany;
        req.userID = rootCompany._id;
      }
    } else {
      req.token = token;
      req.rootUser = rootApplicant;
      req.userID = rootApplicant._id;
    }

    next();
  } catch (err) {
    res.status(401).send("Unauthorized: No token provided");
    console.log(err);
  }
};

module.exports = Authenticate;
