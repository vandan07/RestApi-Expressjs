const users = require("../models/usersSchema");
const moment = require("moment")
const Joi = require('joi');
exports.userpost = async (req, res) => {
    
    const { firstname,id, email, mobile, gender, status } = req.body;
    if (!firstname || !id || !email || !mobile || !gender || !status) {
        res.status(400).json({ error: "All Input Is required" });
    }

    try {
            const schema = Joi.object({
                firstname: Joi.string().min(3).max(30).required(),
                id: Joi.string(),
                email : Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
                mobile: Joi.string().length(10).required(),
                gender:Joi.string(),
                status:Joi.string()
                      });
        const validate = schema.validate(req.body);
        console.log(validate);
        if(validate.error){
            res.status(400).json({ error: "Invalid Input" })
        }

        const preuser = await users.findOne({ id: id });
        if (preuser) {
            res.status(400).json({ error: "This user already exist in our databse" });
        }else{
            const dateCreate = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");

            const userData = new users({
                firstname, id,email, mobile, gender, status ,datecreated:dateCreate
            });

            await userData.save();
            res.status(200).json(userData);
        }
    } catch (error) {
        res.status(400).json(error);
        console.log("catch block error")
    }
}


// get all users
exports.getUsers = async(req,res)=>{
    let query= {};
    const search = req.query.search || "";
    const status = req.query.status || "";
    const gender = req.query.gender || "";
    const sort = req.query.sort || "";
    const page = req.query.page || 1;
    const ITEM_PER_PAGE = req.query.items || 4
    
    // const query = {
    //     firstname:{$regex:search,$options:"i"}
    // }
    if(req.query.gender ){
        query.gender = gender;
        
    }
    // query.status = status
    
  

    try {

        const skip = (page - 1) *ITEM_PER_PAGE  
        // const doccount = await users.countDocuments(query);

        const usersData = await users.find({"gender":"male"})
        .sort({datecreated:sort == "new" ? -1 :1})
        .limit(ITEM_PER_PAGE)
        .skip(skip) 

        const pageCount = Math.ceil(doccount/ITEM_PER_PAGE); 

        res.status(200).json({
            pagination:{
                count:pageCount,
                // total:doccount 

            },
            usersData
        });
    } catch (error) {
        res.status(400).json(error);
        console.log("catch block error")
    }
}
exports.getSingleuser = async(req,res)=>{
    const id = req.body.id;
    // console.log(req.body);
    try {
        const schema = Joi.object({id: Joi.string()});      
        const validate = schema.validate(req.body);
        console.log(validate);
        if(validate.error){
            res.status(400).json({ error: "Invalid Input" })
        }
        const singleUserData = await users.findOne({id:req.body.id});
        console.log(singleUserData)
        res.status(200).json(singleUserData);
    } catch (error) {
        console.log(error)
        res.status(400).json(error);
        console.log("catch block error")
    }
}


exports.deleteuser = async(req,res)=>{
    const id = req.body.id;
    console.log(req.body);

    try {
        const schema = Joi.object({id: Joi.string()});      
        const validate = schema.validate(req.body);
        console.log(validate);
        if(validate.error){
            res.status(400).json({ error: "Invalid Input" })
        }
        const deleteUserData = await users.findOneAndDelete({id:id});

        res.status(200).json(deleteUserData);
    } catch (error) {
        res.status(400).json(error);
        console.log("catch block error")
    }
}


exports.updateUser = async(req,res)=>{
    // const {id} = req.params;
    const { firstname,id,email, mobile, gender, status } = req.body;
//req.body.id
    try {
        const schema = Joi.object({
            firstname: Joi.string().min(3).max(30).required(),
            id: Joi.string(),
            email : Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
            mobile: Joi.string().length(10).required(),
            gender:Joi.string(),
            status:Joi.string()
                  });
             const validate = schema.validate(req.body);
            console.log(validate);
            if(validate.error){
                res.status(400).json({ error: "Invalid Input" })
            }
        const dateUpdate = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");

        const updateUserdata = await users.findOneAndUpdate({id:id},{
            firstname,email, mobile, gender, status ,dateUpdated:dateUpdate
        },{new:true});
        console.log(updateUserdata);
        // await updateUserdata.save();

        res.status(200).json(updateUserdata)
    } catch (error) {
        res.status(400).json(error);
        console.log("catch block error")
    }
}

exports.patchuser = (req, res) => {
    const { id, status } = req.body;
    const dateUpdate = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");
    users.findOneAndUpdate(
        { id: id },
        { status:req.body.status, dateUpdated: dateUpdate },
        { new: true }
    )
    .then(patchdata => {
        // console.log(patchdata)
        if (!patchdata) {
            return res.status(404).json({ error: 'User not found' });
        }
        // console.log(patchdata)
        res.status(200).json(patchdata);
    })
    .catch(error => {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    });
};

exports.patchmid = (req, res) => {
    const{id,status}=req.body;
    res.status(200).json({error:"api under process"});
};