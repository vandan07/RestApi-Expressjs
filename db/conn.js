const mongoose = require("mongoose");

const DB = process.env.DATABASE;

mongoose.connect("mongodb://0.0.0.0:27017/usersSchema",{
    useUnifiedTopology:true,
    useNewUrlParser:true
}).then(()=>console.log("Database connected")).catch((err)=>{
    console.log("errr",err)
});