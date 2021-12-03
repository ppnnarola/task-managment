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
var db_config = {
  host: "127.0.0.1",
  user: "root",
  password: "password",
  database: "task-status",
};
var connection = mysql.createConnection(db_config);

connection.connect(function (err) {
  if (err) {
    console.log(
      "\n\t *** Cannot establish a connection with the database. ***"
    );
    connection = reconnect(connection);
  } else {
    console.log("\n\t *** New connection established with the database. ***");
  }
});

function reconnect(connection) {
  console.log("\n New connection tentative...");
  if (connection) connection.destroy();
  var connection = mysql.createConnection(db_config);

  connection.connect(function (err) {
    if (err) {
      // setTimeout(reconnect, 2000);
    } else {
      console.log("\n\t *** New connection established with the database. ***");
      return connection;
    }
  });
}

connection.on("error", function (err) {
  if (err.code === "PROTOCOL_CONNECTION_LOST") {
    console.log(
      "/!\\ Cannot establish a connection with the database. /!\\ (" +
        err.code +
        ")"
    );
    connection = reconnect(connection);
  }

  else if (err.code === "PROTOCOL_ENQUEUE_AFTER_QUIT") {
    console.log(
      "/!\\ Cannot establish a connection with the database. /!\\ (" +
        err.code +
        ")"
    );
    connection = reconnect(connection);
  }

  else if (err.code === "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR") {
    console.log(
      "/!\\ Cannot establish a connection with the database. /!\\ (" +
        err.code +
        ")"
    );
    connection = reconnect(connection);
  }

  else if (err.code === "PROTOCOL_ENQUEUE_HANDSHAKE_TWICE") {
    console.log(
      "/!\\ Cannot establish a connection with the database. /!\\ (" +
        err.code +
        ")"
    );
  }

  else {
    console.log(
      "/!\\ Cannot establish a connection with the database. /!\\ (" +
        err.code +
        ")"
    );
    connection = reconnect(connection);
  }
});

module.exports = database === Default_database ? connection : mongodbConnect;
