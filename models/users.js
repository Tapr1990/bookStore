const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        min: 2,
        max: 60,
        required: true
    },
    email: {
        type: String,
        min: 3,
        max: 252,
        required: true
    },
    phone: {
        type: String,
        min: 9,
        max: 30,
        required: true
    },
    birth_date: {
        type: Date,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
});
        
const User = mongoose.model("user", userSchema);
      
module.exports = User;




    


