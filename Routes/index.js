const express = require("express");
const router = express.Router();
const userRoute = require("./user.route");
const bookRoute = require("./book.route");
const authController = require("../controllers/auth.controller");

router.post("/adduser", authController.registerUser);
router.post("/authuser", authController.loginUser);

/* ------------Auth routing-------------*/
router.use("/user", userRoute);
router.use("/book", bookRoute);

module.exports = router;
