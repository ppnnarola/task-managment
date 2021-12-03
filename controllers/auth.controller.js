const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Default_database } = require("../Constants");
var db = require("../utils/database");
const UserModal = require("../Modals/user.modal");
var database = process.env.DATABASE || Default_database;

loginUser = (req, res, next) => {
  var email = req.body.email;
  var password = req.body.password;
  if (database === Default_database) {
    var findUserExist = "SELECT * FROM users WHERE email= ?";
    db.query(findUserExist, [email], function (err, user) {
      if (!user) {
        return res.status(404).json({ message: "User Not found." });
      }
      console.log("user", user);
      var passwordIsValid = bcrypt.compareSync(password, user[0].password);

      if (!passwordIsValid) {
        return res.status(401).json({
          message: "Invalid Password!",
        });
      }

      var token = jwt.sign({ id: user[0].id }, "tMS-system", {
        expiresIn: 86400, // 24 hours
      });
      res.status(200).json({
        id: user[0].id,
        first_name: user[0].first_name,
        last_name: user[0].last_name,
        email: user[0].email,
        accessToken: token,
      });
    });
  } else {
    UserModal.findOne({ email: email })
      .then(function (user) {
        if (!user) {
          res.status(404).send({ message: `User not found !!` });
        } else {
          var passwordIsValid = bcrypt.compareSync(password, user.password);
          if (!passwordIsValid) {
            return res.status(401).send({
              message: "Invalid Password!",
            });
          }

          var token = jwt.sign({ id: user._id }, "tMS-system", {
            expiresIn: 86400, // 24 hours
          });
          res.status(200).send({
            id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            accessToken: token,
          });
        }
      })
      .catch(next);
  }
};

registerUser = (req, res, next) => {
  var first_name = req.body.first_name;
  var last_name = req.body.last_name;
  var email = req.body.email;
  var password = bcrypt.hashSync(req.body.password, 5);
  if (database === Default_database) {
    let findUserExist = "SELECT * FROM users WHERE email =?";
    let sql = `INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)`;
    db.query(findUserExist, [email], function (err1, userResults) {
      if (userResults?.length) {
        res.json({ message: userResults.message || "User already exist" });
      } else {
        db.query(
          sql,
          [first_name, last_name, email, password],
          function (err, result) {
            // if (err) throw err;
            res.json({ message: result.message || "Registration successfull" });
          }
        );
      }
    });
  } else {
    UserModal.findOne({ email: email })
      .then(function (result) {
        if (result) {
          res.send({ message: `User ${result.email} already exist !!` });
        } else {
          UserModal.create({
            ...req.body,
            password: password,
          }).then(function (items) {
            res.send({ message: "Registration successfull !!" });
          });
        }
      })
      .catch(next);
  }
};

getAllUser = (req, res, next) => {
  if (database === Default_database) {
    var findUserExist = "SELECT * FROM users";
    db.query(findUserExist, function (err, user) {
      if (err) next(err);
      res.status(200).json(user);
    });
  } else {
    UserModal.find({})
      .then(function (users) {
        if (!users) {
          res.status(404).send({ message: `User not found !!` });
        } else {
          res.status(200).send(users);
        }
      })
      .catch(next);
  }
};

updateUser = (req, res, next) => {
  const id = req.body.id;
  var password = bcrypt.hashSync(req.body.password, 5);
  if (database === Default_database) {
    var findUserExist = "SELECT * FROM users WHERE id= ?";
    var emailExistquery = "SELECT * FROM users WHERE email= ?";
    var updatequery = "UPDATE users SET ? WHERE id = ?";
    db.query(findUserExist, [req.body.id], function (err, user) {
      if (user[0]) {
        db.query(emailExistquery, [req.body.email], function (err, response) {
          if (!response[0] || user[0].id === id) {
            db.query(
              updatequery,
              [{ ...req.body, password: password }, id],
              function (err, result) {
                res.status(200).json({
                  message: result.message || "User Updated Successfully!",
                });
              }
            );
          } else {
            res.status(200).json({
              message:
                response.message ||
                "Email already register! Please try with other email",
            });
          }
        });
      } else {
        res.status(200).json({
          message: user.message || "User not exist!!",
        });
      }
    });
  } else {
    UserModal.findOne({ _id: id }).then((user) => {
      if (user) {
        UserModal.findOne({ email: req.body.email }).then((result) => {
          if (!result || result._id.toString() === id) {
            UserModal.findOneAndUpdate(
              { _id: id },
              { ...req.body, password: password }
            ).then((item) => {
              res.status(200).send({ message: "User Update successfully!!" });
            });
          } else {
            res.status(200).send({ message: "Email already exist!!" });
          }
        });
      } else {
        res.status(404).send({ message: "User not found" });
      }
    });
  }
};

deleteUser = (req, res, next) => {
  const id = req.body.id;
  if (database === Default_database) {
    var findUserExist = "SELECT * FROM users WHERE id= ?";
    var deletequery = "DELETE from users WHERE id = ?";
    db.query(findUserExist, [req.body.id], function (err, user) {
      if (!user) {
        db.query(deletequery, [id], function (err, result) {
          if (err) {
            res.status(401).json({
              message:
                result.message || "Something went wrong! Try again later",
            });
          }
          res.status(200).json({ message: "User Deleted Successfully!" });
        });
      } else {
        res.status(401).json({ message: user.message || "User Not exist!" });
      }
    });
  } else {
    UserModal.findOne({ _id: id }).then((user) => {
      if (user) {
        UserModal.findOneAndDelete({ _id: id }).then((item) => {
          res.status(200).send({ message: "User delete successfully!!" });
        });
      } else {
        res.status(404).send({ message: "User not found" });
      }
    });
  }
};

module.exports = {
  loginUser: loginUser,
  registerUser: registerUser,
  getAllUser: getAllUser,
  updateUser: updateUser,
  deleteUser: deleteUser,
};
