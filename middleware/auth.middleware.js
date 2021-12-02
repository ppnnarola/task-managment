const jwt = require("jsonwebtoken");

verifyToken = (req, res, next) => {
  try {
    const headerToken =
      req.headers["x-access-token"] || req.headers["authorization"];
    const token = headerToken.split(" ")[1];
    const decoded = jwt.verify(token, "tMS-system");
    req.userData = decoded;
    next();
  } catch (err) {
    err.status = 401;
    err.message = "Your session is not valid!";
    next(err);
  }
};

const authJwt = {
  verifyToken: verifyToken,
};

module.exports = authJwt;
