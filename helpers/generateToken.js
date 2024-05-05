const jwt = require("jsonwebtoken");

function generateToken(user) {
  const payload = {
    subject: user.id,
    email: user.email,
  };
  const options = {
    expiresIn: "1h",
  };

  const result = jwt.sign(
    payload,
    process.env.SECRET || "this is supposed to be secret",
    options
  );

  return result;
}

module.exports = generateToken;
