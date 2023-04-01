const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


const companySchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
        maxLength : 32
    },
    contactPersonName: {
        type: String,
        required: true,
        maxLength: 32
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
       type: Number,
       required: true
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
        default: 0
    },
    state: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    website : {
        type: String,
    },
    linkedin : {
        type: String,
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

companySchema.pre('save', async function(next){
    if(this.isModified('password')){
       const salt = await bcrypt.genSalt(10);
       this.password = await bcrypt.hash(this.password, salt);
       this.cpassword = await bcrypt.hash(this.cpassword, salt);
    }
   next();
});

     //in sign first argument is payload and second is secrete key
     //save the token in schema (in model)
companySchema.methods.generateAuthTokenComp = async function() {
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

const Company = mongoose.model('company',companySchema);


module.exports = Company;
