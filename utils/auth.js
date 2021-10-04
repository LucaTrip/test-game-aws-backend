const jwt = require("jsonwebtoken");

function generateToken(userInfo) {
  if (!userInfo) {
    return null;
  }

  return jwt.sign(userInfo, process.env.JWT_SECRET, {
    expiresIn: "1y",
  });
}

function verifyUserToken(token) {
  try {
    let response = jwt.verify(token, process.env.JWT_SECRET);
    return true;
  } catch (error) {
    return false;
  }
}

module.exports.generateToken = generateToken;
module.exports.verifyUserToken = verifyUserToken;
