const dept = require("../models/deptschema");
const company = require("../models/companyschema");
const moment = require("moment")
const Joi = require('joi');
exports.deptpost = async (req, res) => {
    
    const { companyid,deptname, deptid, deptstatus } = req.body;
    try {
            const schema = Joi.object({
                companyid: Joi.string().required(),
                deptname : Joi.string().min(3).max(30).required(),
                deptid: Joi.string().required(),
                deptstatus:Joi.string()
                      });
        const validate = schema.validate(req.body);
        console.log(validate);
        if(validate.error){
            res.status(400).json({ error: "Invalid Input" })
        }

        const preuser = await dept.findOne({ id: companyid });
        const dpt = await company.findOne({id: req.body.companyid });
        if (preuser && dpt) {
            res.status(400).json({ error: "This company/dept already exist in our databse" });
        }else{
            const dateCreate = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");

            const deptData = new dept({
                companyid,deptname, deptid, deptstatus ,datecreated:dateCreate
            });

            await deptData.save();
            res.status(200).json(deptData);
        }
    } catch (error) {
        res.status(400).json(error);
        console.log(error)
    }
}



exports.getdept = async(req,res)=>{
    const cid = req.body.companyid;
    const did = req.body.deptid;

    // console.log(req.body);
    try {
        const schema = Joi.object({deptid: Joi.string(),companyid: Joi.string()});      
        const validate = schema.validate(req.body);
        console.log(validate);
        if(validate.error){
             res.status(400).send({ error: "Invalid Input" })
        }
        // const deptData = await dept.findOne({id:id});
        const deptData = await dept.findOne({ deptid: did, companyid: cid })
        console.log(deptData)
        res.status(200).json(deptData);
    } catch (error) {
        console.log(error)
        res.status(400).json(error);
        console.log("catch block error")
    }
}
exports.deptcount = async(req,res)=>{
    try {
        const result = await company.aggregate([
          {
            $lookup: {
              from: 'depts',
              localField: 'companyid',
              foreignField: 'companyid',
              as: 'departments',
            }
          },
          {
            $project: {
              _id: 0,
              companyname: 1,
              deptCount: { $size: '$departments' }
            }
          }
        ]);
    
        res.json(result);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
      }
}
exports.getdeptlook = async(req,res)=>{
    const companyid = req.body.companyid;
    const deptid = req.body.deptid;

    // console.log(req.body);
    try {
        const schema = Joi.object({deptid: Joi.string(),companyid: Joi.string()});      
        const validate = schema.validate(req.body);
        // const { deptid, companyid } = req.query;
        console.log(validate);
        if(validate.error){
             res.status(400).send({ error: "Invalid Input" })
        }
        const result = await company.aggregate([
          {
            $match: {
              companyid: companyid,
            },
          },
          {
            $lookup: {
              from: 'depts', 
              localField: 'companyid',
              foreignField: 'companyid',
              as: 'departments',
            },
          },
          {
            $unwind: '$departments', // list
          },
          {
            $match: {
              'departments.deptid': deptid,
            },
          },
        ]);
    
        res.status(200).json(result)
        // const deptData = await dept.findOne({id:id});
        // const deptData = await dept.findOne({ deptid: did, companyid: cid })
        // console.log(deptData)
        // res.status(200).json(deptData);
    } catch (error) {
        console.log(error)
        res.status(400).json(error);
        console.log("catch block error")
    }
}
// exports.deletedept = async(req,res)=>{
//     const id = req.body.deptid;
//     console.log(req.body);

//     try {
//         const schema = Joi.object({id: Joi.string()});      
//         const validate = schema.validate(req.body);
//         console.log(validate);
//         if(validate.error){
//             res.status(400).json({ error: "Invalid Input" })
//         }
//         const deleteUserData = await users.findOneAndDelete({id:id});

//         res.status(200).json(deleteUserData);
//     } catch (error) {
//         res.status(400).json(error);
//         console.log("catch block error")
//     }
// }


// exports.updateUser = async(req,res)=>{
//     // const {id} = req.params;
//     const { firstname,id,email, mobile, gender, status } = req.body;
// //req.body.id
//     try {
//         const schema = Joi.object({
//             firstname: Joi.string().min(3).max(30).required(),
//             id: Joi.string(),
//             email : Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
//             mobile: Joi.string().length(10).required(),
//             gender:Joi.string(),
//             status:Joi.string()
//                   });
//              const validate = schema.validate(req.body);
//             console.log(validate);
//             if(validate.error){
//                 res.status(400).json({ error: "Invalid Input" })
//             }
//         const dateUpdate = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");

//         const updateUserdata = await users.findOneAndUpdate({id:id},{
//             firstname,email, mobile, gender, status ,dateUpdated:dateUpdate
//         },{new:true});
//         console.log(updateUserdata);
//         // await updateUserdata.save();

//         res.status(200).json(updateUserdata)
//     } catch (error) {
//         res.status(400).json(error);
//         console.log("catch block error")
//     }
// }

// exports.patchuser = (req, res) => {
//     const { id, status } = req.body;
//     const dateUpdate = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");
//     users.findOneAndUpdate(
//         { id: id },
//         { status:req.body.status, dateUpdated: dateUpdate },
//         { new: true }
//     )
//     .then(patchdata => {
//         // console.log(patchdata)
//         if (!patchdata) {
//             return res.status(404).json({ error: 'User not found' });
//         }
//         // console.log(patchdata)
//         res.status(200).json(patchdata);
//     })
//     .catch(error => {
//         console.error(error);
//         res.status(500).json({ error: 'Internal server error' });
//     });
// };