const dotenv = require("dotenv");
dotenv.config();
// const bcrypt = require("bcryptjs");
const { Default_database } = require("../Constants");
var db = require("../utils/database");
const BookModal = require("../Modals/book.modal");
const UserModal = require("../Modals/user.modal");
var database = process.env.DATABASE || Default_database;

addBook = (req, res, next) => {
  BookModal.findOne({ name: req.body.name })
    .then((result) => {
      if (!result) {
        UserModal.findOne({ _id: req.userData.id }).then((item) => {
          BookModal.create({ ...req.body, user_id: item._id });
        });
        res.status(200).send({ message: "Book added!!" });
      } else {
        res.status(200).send({ message: "Book already added!!" });
      }
    })
    .catch(next);
};

getBooksByUserId = (req, res, next) => {
  BookModal.find({ user_id: req.userData.id })
    .populate("user_id")
    .exec((err, result) => {
      if (err) next();
      res.status(200).send(result);
    });
};

getAllBooks = (req, res, next) => {
  BookModal.find({})
    .populate("user_id")
    .exec((err, result) => {
      if (err) next();
      res.status(200).send(result);
    });
};

updateBookById = (req, res, next) => {
  BookModal.findOneAndUpdate({ _id: req.body.id }, req.body)
    .then((result) => {
      if (result) {
        res.status(200).send({ message: "Book Updated!!" });
      } else {
        res.status(200).send({ message: "Book not found!!" });
      }
    })
    .catch(next);
};

module.exports = {
  addBook: addBook,
  getBooksByUserId: getBooksByUserId,
  getAllBooks: getAllBooks,
  updateBookById: updateBookById,
};
