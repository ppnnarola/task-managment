const express = require("express");
const router = express.Router();
const authJwt = require("../middleware/auth.middleware");
const bookController = require("../controllers/book.controller");

router.get("/getbooks", bookController.getAllBooks);
router.post("/addbook", [authJwt.verifyToken], bookController.addBook);
router.get(
  "/getbooksbyuserid",
  [authJwt.verifyToken],
  bookController.getBooksByUserId
);
router.put(
  "/updatebookbyid",
  [authJwt.verifyToken],
  bookController.updateBookById
);
router.delete(
  "/deletebookbyid",
  [authJwt.verifyToken],
  bookController.deleteBookById
);

module.exports = router;
