const util = require("../utils/util");
const dbOperations = require("../utils/dbOp");

async function getUserInfo(nickName) {
  const dynamoUser = await dbOperations.getUserByNickName(nickName);
  if (!dynamoUser || !dynamoUser.email) {
    return util.buildResponse(403, {
      message: "User does not exist",
    });
  }

  return util.buildResponse(200, {
    ...dynamoUser,
  });
}

module.exports.getUserInfo = getUserInfo;
