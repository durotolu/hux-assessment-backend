const jwt = require("jsonwebtoken");
const validator = require("email-validator");

module.exports = {
  checkAuthInput,
  verifyToken,
  checkContactInput,
};

function checkAuthInput(req, res, next) {
  let user = req.body;
  if (user.email && user.password) {
    if (validator.validate(user.email)) {
      next();
    } else {
      res.status(403).json({ message: "enter a valid email" });
    }
  } else {
    res.status(403).json({ message: "missing required field" });
  }
}

function verifyToken(req, res, next) {
  if (process.env.NODE_ENV === 'testing') {
    return next();
  }

  const token = req.headers.authorization;
  if (token) {
    jwt.verify(
      token,
      process.env.SECRET || "this is supposed to be secret",
      (err, decodedToken) => {
        if (err) {
          res.status(401).json({ "credentials not valid": err });
        } else {
          req.decodedToken = decodedToken;
          next();
        }
      }
    );
  } else {
    res.status(400).json({ message: "No credentials provided" });
  }
}

function checkContactInput(req, res, next) {
  const { firstname, lastname, phone_number } = req.body;
  if (firstname && lastname && phone_number) {
    next();
  } else {
    res.status(403).json({ message: "missing required field(s)" });
  }
}
