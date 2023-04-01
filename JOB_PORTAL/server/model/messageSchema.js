const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    name: {
        type : String,
        trim : true,
        required : true,
        maxLength : 32
    },
    email: {
        type : String,
        required : true
    },
    message: {
        type : String,
        required : true
    },
    marked: {
        type : Number,
        default: 0
    }
})

const Message = new mongoose.model('message', messageSchema);

module.exports = Message;
