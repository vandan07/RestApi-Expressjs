const company = require("../models/companyschema");
const moment = require("moment")
const Joi = require('joi');
exports.companypost = async (req, res) => {
    const { companyname,companyid, companymobile, companystatus } = req.body;
    try {
        const schema = Joi.object({
                companyname: Joi.string().min(3).max(30).required(),
                companyid: Joi.string().required(),
                companymobile: Joi.string().length(10).required(),
                companystatus:Joi.string().required()
                      });
        const validate = schema.validate(req.body);
        console.log(validate);
        if(validate.error){
            res.status(400).json({ error: "Invalid Input" })
        }

        const preuser = await company.findOne({ id: req.body.companyid });
        if (preuser) {
            res.status(400).json({ error: "This company already exist in our databse" });
        }else{
            const dateCreate = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");

            const companyData = new company({
                companyname, companyid, companymobile,  companystatus ,datecreated:dateCreate
            });

            await companyData.save();
            res.status(200).json(companyData);
        }
    } catch (error) {
        res.status(400).json(error);
        console.log(error)
    }
}



exports.getcompany = async(req,res)=>{
    const id = req.body.companyid;
    console.log(req.body);
    try {
        const schema = Joi.object({id: Joi.string()});      
        const validate = schema.validate(req.body);
        console.log(validate);
        if(validate.error){
            res.status(400).json({ error: "Invalid Input" })
        }
        const companyData = await company.findOne({id:id});
        console.log(companyData)
        res.status(200).json(companyData);
    } catch (error) {
        console.log(error)
        res.status(400).json(error);
        console.log("catch block error")
    }
}


exports.deletecompany = async(req,res)=>{
    const id = req.body.companyid;
    console.log(req.body);

    try {
        const schema = Joi.object({id: Joi.string()});      
        const validate = schema.validate(req.body);
        console.log(validate);
        if(validate.error){
            res.status(400).json({ error: "Invalid Input" })
        }
        const deleteUserData = await company.findOneAndDelete({id:id});

        res.status(200).json(deleteUserData);
    } catch (error) {
        res.status(400).json(error);
        console.log("catch block error")
    }
}


exports.updatecompany = async(req,res)=>{
    // const {id} = req.params;
    const { companyname,companyid, companymobile, companystatus } = req.body;
//req.body.id
    try {
        const schema = Joi.object({
            companyname: Joi.string().min(3).max(30).required(),
            companyid: Joi.string(),
            companymobile: Joi.string().length(10).required(),
            companystatus:Joi.string().required()
                  });
             const validate = schema.validate(req.body);
            console.log(validate);
            if(validate.error){
                res.status(400).json({ error: "Invalid Input" })
            }
        const dateUpdate = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");

        const companydata = await company.findOneAndUpdate({id:id},{
            companyname,companymobile, companystatus ,dateUpdated:dateUpdate
        },{new:true});
        console.log(companydata);
        // await updateUserdata.save();

        res.status(200).json(companydata)
    } catch (error) {
        res.status(400).json(error);
        console.log("catch block error")
    }
}

exports.patchcompany = (req, res) => {
    const { id, status } = req.body;
    const dateUpdate = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");
    company.findOneAndUpdate(
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
