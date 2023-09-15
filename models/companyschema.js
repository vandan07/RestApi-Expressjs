const mongoose = require("mongoose");
const validator = require("validator");
const company = new mongoose.Schema({
    companyname:{
        type:String,
        required:true,
    },
    companyid:{
        type:String,
        required:true,
        unique:true,
    },
    companymobile:{
        type:String,
        required:true,
        unique:true,
        minlength:10,
        maxlength:10
    },
    companystatus:{
        type:String,
        enum:["Active","In-Active"],
        default:"Active"
    },
    datecreated:Date,
    dateUpdated:Date
});
const companys = new mongoose.model("company",company);
module.exports = companys;