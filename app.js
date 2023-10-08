require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const flash = require('connect-flash');
const moment = require("moment")
require("./db/conn");
app.use(flash());
const cors = require("cors");
const router = require("./Routes/router");
// const mid = require("./middle/mid");
const PORT = process.env.PORT || 3000;
const users = require("./models/usersSchema");
const bodyParser = require('body-parser');
const staticpath = path.join(__dirname,"/public");
console.log(staticpath);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(staticpath));


app.set('view engine', 'ejs');

// Specify the folder where your HTML templates are stored (default is "views")
app.set('views', 'views');
app.use(cors());
app.use(express.json());
// app.use("/users",mid);
app.use(router);
// get response
app.get("/",(req,res)=>{
    res.status(200).json("server start");
});


app.get("/register",(req,res)=>{
    res.render('cr/create', { title: 'Register' });
});
app.post('/submit', async (req, res) => {
    try {
        // console.log(req.body)
      const newUser = new users({
        firstname: req.body.firstname,
        id: req.body.id,
        email: req.body.email,
        mobile: req.body.mobile,
        gender: req.body.gender,
        status:req.body.status,
        datecreated: moment(new Date()).format("YYYY-MM-DD hh:mm:ss")
       });
       console.log(newUser.id)

        await newUser.save();
        res.redirect(`/readd/${req.body.id}`);

        // res.redirect(`/readd/${req.body.id}`);

    //   res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.log(error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  app.get('/all', async (req, res) => {
    try {
        // req.flash('successMessage', 'User deleted successfully');
        const alluserData = await users.find({ });
                // res.send(alluserData);
        res.render('all',{alluserData:alluserData});
        // res.status(201).json(alluserData);
        // res.redirect(`/register`);     
     } catch (error) {
       res.status(500).json({ error: 'Internal server error' });
     }
  });
  app.post('/findByName', async (req, res) => {
    const searchname = req.body.searchname; // Get the name from the query parameter  
    try {
    const query = {
        firstname: { $regex: searchname, $options: "i" } // Using searchName here, and $options for case-insensitive search
      };
    //   const alluserData = await users.find({ firstname: searchName });
    const alluserData = await users.find(query);

    //   const id = data[0].id;
      console.log(alluserData);
      if (alluserData.length === 0) {
        return res.status(404).json({ message: 'No users found with that name.' });
      }
  
      res.render('all',{alluserData:alluserData});
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  app .get('/dirdelete/:id', async (req, res) => {
    const id = req.params.id;
    try {
        // req.flash('successMessage', 'User deleted successfully');
        const deleteUserData = await users.findOneAndDelete({id:id});
        res.redirect(`/register`);     
     } catch (error) {
       res.status(500).json({ error: 'Internal server error' });
     }
  });
  app.get('/delete', async (req, res) => {
    res.render('delete', { title: 'Delete' });
  });
  app.post('/del', async (req, res) => {
    console.log(req.body.id)
    const id = req.body.id;
    try {

       const deleteUserData = await users.findOneAndDelete({id:id});     
       res.status(201).json({ message: 'User Deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  app.get('/read', async (req, res) => {
    res.render('read', { title: 'Delete' });
  });
  app.post('/readdata', async (req, res) => {
    console.log(req.body.id)
    const id = req.body.id;
    try {
       const UserData = await users.findOne({id:id});
    // const UserData = await users.findOne({ id: id });
    res.render('userdata', { title: 'User Data', userData: UserData });  
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  app.get('/readd/:id', async (req, res) => {
    console.log(req.body.id)
    const id = req.params.id;
    try {
       const UserData = await users.findOne({id:id});
    // const UserData = await users.findOne({ id: id });
    res.render('userdataa', { title: 'User Data', userData: UserData });  
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });



  app.get('/edit/:id', async (req, res) => {
    // console.log(req.body.id)
    const id = req.params.id;
    try {
       const UserData = await users.findOne({id:id});
       if(UserData){
        res.render('edit', { title: 'User Data', userData: UserData });  
       }else{
        res.redirect(`/register`) 
       }
    // const UserData = await users.findOne({ id: id });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  app.post('/editsave/:id', async (req, res) => {
    // res.render('create', { title: 'Express.js and EJS' });
    const id = req.params.id;
    console.log(req.body)
    const { firstname,mobile, gender, status } = req.body;
    try {
        console.log(req.body)
        const dateUpdate = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");
        const updateUserdata = await users.findOneAndUpdate({id:id},{
            firstname, mobile, gender, status ,dateUpdated:dateUpdate
        },{new:true});
        console.log(updateUserdata)
      // Create a new user object using the data from the HTML form
    //   alert('User Updated successfully');
      res.redirect(`/readd/${id}`);
    //   res.status(201).json({ message: 'User Updated successfully' });
    } catch (error) {
        console.log(error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  });



app.get("/update",(req,res)=>{
    res.render('update', { title: 'Update' });
});
app.post('/upd', async (req, res) => {
    // res.render('create', { title: 'Express.js and EJS' });
    console.log(req.body)
    const { firstname,id,email, mobile, gender, status } = req.body;
    try {
        console.log(req.body)
        const dateUpdate = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");
        const updateUserdata = await users.findOneAndUpdate({id:id},{
            firstname,email, mobile, gender, status ,dateUpdated:dateUpdate
        },{new:true});
        console.log(updateUserdata)
      // Create a new user object using the data from the HTML form
      res.status(201).json({ message: 'User Updated successfully' });
    } catch (error) {
        console.log(error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
app.listen(PORT,()=>{
    console.log(`server start at Port No ${PORT}`)
});