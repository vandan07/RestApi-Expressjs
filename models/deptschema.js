const mongoose = require("mongoose");
const validator = require("validator");
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
const depts = new mongoose.model("dept",dept);
module.exports = depts;