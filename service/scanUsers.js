const util = require("../utils/util");
const dbOperations = require("../utils/dbOp");

async function scanUsers() {
  const dynamoUsers = await dbOperations.scanUsers();

  return util.buildResponse(200, {
    ...dynamoUsers,
  });
}

module.exports.scanUsers = scanUsers;
