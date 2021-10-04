const util = require("../utils/util");
const dbOperations = require("../utils/dbOp");

async function registerNewUser(user) {
  const firstname = user.firstname.toLowerCase().trim();
  const lastname = user.lastname.toLowerCase().trim();
  const email = user.email.trim();
  const nickname = user.nickname.trim();

  if (!firstname || !lastname || !email || !nickname) {
    return util.buildResponse(401, { message: "All fields are required" });
  }

  const dynamoUser = await dbOperations.getUserByNickName(nickname);
  let dbOperationResponse;
  if (dynamoUser && dynamoUser.nickname) {
    const userToUpdate = {
      firstname,
      lastname,
      email,
      nickname,
    };

    dbOperationResponse = await dbOperations.updateUser(userToUpdate);
  } else {
    const userToSave = {
      firstname,
      lastname,
      email,
      nickname,
    };

    dbOperationResponse = await dbOperations.saveNewUser(userToSave);
  }

  if (!dbOperationResponse) {
    return util.buildResponse(503, {
      message: "Server Error. Please try again later.",
    });
  }

  return util.buildResponse(200, { message: "User created correctly!" });
}

module.exports.registerNewUser = registerNewUser;
