const AWS = require("aws-sdk");

AWS.config.update({ region: "eu-west-3" });

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const loggedUserTable = "test-game-users";
const userListTable = "test-game-user-list";

async function getUserByEmail(email) {
  const params = {
    TableName: loggedUserTable,
    Key: {
      email,
    },
  };

  return await dynamoDB
    .get(params)
    .promise()
    .then(
      (response) => {
        return response.Item ? response.Item : {};
      },
      (error) => {
        console.error("[getUserByEmail] error", error);
        return false;
      }
    );
}

async function getUserByNickName(nickname) {
  const params = {
    TableName: userListTable,
    Key: {
      nickname,
    },
  };

  return await dynamoDB
    .get(params)
    .promise()
    .then(
      (response) => {
        return response.Item ? response.Item : {};
      },
      (error) => {
        console.error("[getUserByNickName] error", error);
        return false;
      }
    );
}

async function saveLoginUserInfo(userInfo) {
  const params = {
    TableName: loggedUserTable,
    Item: userInfo,
  };

  return await dynamoDB
    .put(params)
    .promise()
    .then(
      () => {
        return true;
      },
      (error) => {
        console.error("[saveLoginUserInfo] error", error);
        return false;
      }
    );
}

async function saveNewUser(userInfo) {
  const params = {
    TableName: userListTable,
    Item: userInfo,
  };

  return await dynamoDB
    .put(params)
    .promise()
    .then(
      () => {
        return true;
      },
      (error) => {
        console.error("[saveNewUser] error", error);
        return false;
      }
    );
}

async function updateUser(userInfo) {
  const params = {
    TableName: userListTable,
    Key: { nickname: userInfo.nickname },
    UpdateExpression: "set #firstname = :x, #lastname = :y, #email = :z",
    ExpressionAttributeNames: {
      "#firstname": "firstname",
      "#lastname": "lastname",
      "#email": "email",
    },
    ExpressionAttributeValues: {
      ":x": userInfo.firstname,
      ":y": userInfo.lastname,
      ":z": userInfo.email,
    },
  };

  return await dynamoDB
    .update(params)
    .promise()
    .then(
      () => {
        return true;
      },
      (error) => {
        console.error("[updateUser] error", error);
        return false;
      }
    );
}

async function scanUsers() {
  const params = {
    TableName: userListTable,
  };

  return await dynamoDB
    .scan(params)
    .promise()
    .then(
      (response) => {
        return response.Items ? response.Items : {};
      },
      (error) => {
        console.error("[scanUsers] error", error);
        return false;
      }
    );
}

module.exports.getUserByEmail = getUserByEmail;
module.exports.saveLoginUserInfo = saveLoginUserInfo;
module.exports.getUserByNickName = getUserByNickName;
module.exports.saveNewUser = saveNewUser;
module.exports.updateUser = updateUser;
module.exports.scanUsers = scanUsers;
