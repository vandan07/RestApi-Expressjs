const users = require("../models/userauthschema");
const dept = require("../models/deptschema")
const company = require("../models/companyschema")
const moment = require("moment")
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secretKey = 'wBWIgfBOHiLD80tnrzyWAfGiZAND7zSf'; 

function verifyToken(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            console.log(err);
        return res.status(401).json({ message: 'Failed to authenticate token' });
        }
        req.user = decoded;
        next();
    });
}

exports.userauthpost = async (req, res) => {
    const { username, password , usertype } = req.body;
    try {
        const schema = Joi.object({username: Joi.string().required(),password: Joi.string().required(),usertype:Joi.string()});
        const validate = schema.validate(req.body);
        if(validate.error){
            res.status(400).json({ error: "Invalid Input" })
        }
        console.log(validate);
        const preuser = await users.findOne({ username:req.body.username });
        console.log(preuser);
        console.log(username);
        if (preuser) {
          return res.status(409).json({ message: 'Username already exists' });
        }
        const pass = password ;
        const hash = await bcrypt.hash(pass, 10);
        console.log(hash);
        const dateCreate = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");
        const userData = new users({
                username, password:hash, usertype ,datecreated:dateCreate
        });
    
        await userData.save();
        res.status(200).json(userData);
        // return res.status(201).json({ message: 'User registered successfully' });
    }catch (error) {
        res.status(400).json(error);
        console.log(error)
    }
} 

exports.getuserauth = async (req, res) => {
        const { username, password } = req.body;
        const user = await users.findOne({ username:req.body.username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Error comparing passwords' });
            }
            if (!result) {
                return res.status(401).json({ message: 'Authentication failed' });
            }
            const token = jwt.sign({ username: user.username, usertype: user.usertype }, secretKey, {expiresIn: '1h'});
            res.json({ message: 'Login successful', token });
        });
}


exports.getuserauzz =[ verifyToken, async (req, res) => {
    const username= req.body.username;
    const user = await users.findOne({ username:username });
    if(user.usertype =="Normal"){
        res.json({ message: 'Can View Company/Dept Data' });
    }else{
        res.json({ message: 'Can Write/View Company/Dept Data' });
    }
}]

//dynamic auth 