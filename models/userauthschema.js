const mongoose = require("mongoose");
const validator = require("validator");
const userauth = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    usertype:{
        type:String,
        enum:["Admin","Normal"],
        default:"Normal"
    }
})
const userauths = new mongoose.model("userauth",userauth);
module.exports = userauths;

