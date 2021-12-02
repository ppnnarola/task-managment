const Express = require("express");
var cors = require("cors");
const dotenv = require("dotenv");
const mainRoutes = require("./Routes");
const HttpException = require("./utils/httpExecution");
const errorMiddleware = require("./middleware/error.middleware");
const mongodbConnect = require("./utils/database");
const { Default_database } = require("./Constants");
dotenv.config();
var app = Express();
var port = process.env.PORT || 8080;
var database = process.env.DATABASE || "mySQL";
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.use(cors());
app.use("/api", mainRoutes);
app.all("*", (req, res, next) => {
  const err = new HttpException(404, "Endpoint Not Found");
  next(err);
});
app.use(errorMiddleware);

if (database === Default_database) {
  app.listen(port, () => {
    console.log(`Connected at ${port} port with ${database} database`);
  });
} else {
  mongodbConnect((client) => {
    app.listen(port, () => {
      console.log(`Connected at ${port} port with ${database} database`);
    });
  });
}
