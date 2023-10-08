const express = require("express");
const router = new express.Router();
const controllers = require("../Controllers/userControllers");
const companycontroll = require("../Controllers/companycontroll");
const deptcontroll = require("../Controllers/deptcontroll");
const authcontroll = require("../Controllers/userauthcontroll");
// const verifyToken = require("../Controllers/userauthcontroll");
router.post("/user/register",controllers.userpost);
router.get("/user/getuser",controllers.getSingleuser);
router.get("/user/getAlluser",controllers.getUsers);
router.delete("/user/deleteuser",controllers.deleteuser);
router.put("/user/updateuser",controllers.updateUser);
router.patch("/user/patch",controllers.patchuser);

router.post("/user/companyregister",companycontroll.companypost);
router.get("/user/getcompany",companycontroll.getcompany);
router.delete("/user/deletecompany",companycontroll.deletecompany);
router.put("/user/updatecompany",companycontroll.updatecompany);
router.patch("/user/patchcompany",companycontroll.patchcompany);

router.post("/user/deptregister",deptcontroll.deptpost);
router.get("/user/getdept",deptcontroll.getdept);
router.get("/user/getdeptlook",deptcontroll.getdeptlook);
router.get("/user/deptcount",deptcontroll.deptcount);

router.post("/user/userauth",authcontroll.userauthpost);
router.get("/user/getuserauth",authcontroll.getuserauth);
router.get("/user/getuserauzz",authcontroll.getuserauzz);

// router.delete("/user/deleteuser",controllers.deleteuser);
// router.put("/user/updateuser",controllers.updateUser);
// router.patch("/user/patch",controllers.patchuser);
// use patch

module.exports = router;