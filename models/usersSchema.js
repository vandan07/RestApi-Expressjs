const mongoose = require("mongoose");
const validator = require("validator");
//joi patch update 
const usersSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
        
    },
    id:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        // validate(value){
        //     if(!validator.isEmail(value)){
        //         throw Error("not valid Email")
        //     }
        // }
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
        minlength:10,
        maxlength:10
    },
    gender:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:["Active","In-Active"],
        default:"Active"
    },
    datecreated:Date,
    dateUpdated:Date
});

const dept = new mongoose.Schema({
    companyid:{
        type:"String",
    },
    deptname:{
        type:String,
        required:true,
    },
    deptid:{
        type:String,
        required:true,
        unique:true,
    },
    deptstatus:{
        type:String,
        enum:["Active","In-Active"],
        default:"Active"
    },
    datecreated:Date,
    dateUpdated:Date
});
// company details 
//department details :  3 dep 
//

const users = new mongoose.model("users",usersSchema);
module.exports = users;

