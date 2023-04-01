const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//create schema
const applicantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength : 32
    },

    dob: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
       type: Number,
       required: true,
    },
    password: {
        type: String,
        required: true,
        minLength : 6
    },
    cpassword: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        default: 1
    },
    photo: {
        type: String
    },

    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
})


//hash the password

// const hashSchema:mongoose.Schema = {employeeSchema, companySchema};
applicantSchema.pre('save', async function(next){
     if(this.isModified('password')){
        // const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, 10);
        this.cpassword = await bcrypt.hash(this.cpassword, 10);
     }
    next();
});

//here we not use arrow function because this keyword is not available in arrow function
 //save the token in schema (in model)
//in sign first argument is payload and second is secrete key
applicantSchema.methods.generateAuthToken = async function() {
       try{
          let token = jwt.sign({_id: this._id}, process.env.SECRET_KEY);
          this.tokens = this.tokens.concat({token: token});  
          await this.save();
          return token;
       }
       catch(err) {
           res.status(400).json(`${err}`);
       }
}

//create models 

const Applicant = mongoose.model('applicant', applicantSchema);

module.exports = Applicant;
