const express = require("express");
const router = express.Router();
const authJwt = require("../middleware/auth.middleware");
const authController = require("../controllers/auth.controller");

router.get("/getalluser", [authJwt.verifyToken], authController.getAllUser);
router.put("/updateuser", [authJwt.verifyToken], authController.updateUser);
router.delete("/deleteuser", [authJwt.verifyToken], authController.deleteUser);

module.exports = router;
