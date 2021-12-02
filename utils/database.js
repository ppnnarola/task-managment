const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { Default_database } = require("../Constants");
dotenv.config();
var database = process.env.DATABASE || Default_database;

const username = "aron";
const password = "test123";
const cluster = "cluster0.yqukk";
const dbname = "task-status";

const mongodbConnect = (callback) => {
  mongoose
    .connect(
      `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then((client) => {
      callback(client);
    })
    .catch((err) => {
      console.log(err);
    });
  var db = mongoose.connection;
};

var mysql = require("mysql");
var conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "task-status",
});

conn.connect(function (err) {
  // if (err) throw err;
  console.log("Database is connected successfully !");
});

module.exports = database === Default_database ? conn : mongodbConnect;
