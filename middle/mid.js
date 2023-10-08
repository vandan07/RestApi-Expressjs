const express = require("express");
const router = new express.Router();
const controllers = require("../Controllers/userControllers");

router.patch("/patch",controllers.patchmid);