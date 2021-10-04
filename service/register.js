const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

const util = require("../utils/util");
const dbOperations = require("../utils/dbOp");
const auth = require("../utils/auth");

async function register(user) {
  const id = uuidv4();
  const email = user.email.trim();
  const password = user.password;

  if (!email || !password) {
    return util.buildResponse(401, { message: "All fields are required" });
  }

  const dynamoUser = await dbOperations.getUserByEmail(email);
  if (dynamoUser && dynamoUser.email) {
    return util.buildResponse(401, {
      message:
        "This email already exists in our database. Please choose a different email",
    });
  }

  const encryptedPassword = bcrypt.hashSync(password.trim(), 10);
  const userToSave = {
    id,
    email,
    password: encryptedPassword,
  };

  const saveUserResponse = await dbOperations.saveLoginUserInfo(userToSave);
  if (!saveUserResponse) {
    return util.buildResponse(503, {
      message: "Server Error. Please try again later.",
    });
  }

  const userInfo = {
    email,
    id,
  };

  const token = auth.generateToken(userInfo);

  return util.buildResponse(200, { token });
}

module.exports.register = register;
