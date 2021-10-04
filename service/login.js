const bcrypt = require("bcryptjs");

const util = require("../utils/util");
const auth = require("../utils/auth");
const dbOperations = require("../utils/dbOp");

async function login(user) {
  const email = user.email;
  const password = user.password;

  if (!email || !password) {
    return util.buildResponse(401, {
      message: "Email and password are required",
    });
  }

  const dynamoUser = await dbOperations.getUserByEmail(email);
  if (!dynamoUser || !dynamoUser.email) {
    return util.buildResponse(403, {
      message: "User does not exist",
    });
  }

  if (!bcrypt.compareSync(password, dynamoUser.password)) {
    return util.buildResponse(403, { message: "Password is incorrect" });
  }

  const userInfo = {
    email: dynamoUser.email,
    id: dynamoUser.id,
  };

  const token = auth.generateToken(userInfo);

  return util.buildResponse(200, {
    token,
  });
}

module.exports.login = login;
