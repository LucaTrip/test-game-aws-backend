const registerService = require("./service/register");
const loginService = require("./service/login");
const registerNewUserService = require("./service/registerNewUser");
const userInfoService = require("./service/userInfoService.js");
const scanUsersService = require("./service/scanUsers");
const authService = require("./utils/auth.js");

const util = require("./utils/util");
const s3bucket = require("./utils/s3bucket");

const registerPath = "/register";
const loginPath = "/login";
const getProfilePath = "/getprofile";
const registerUserPath = "/registeruser";
const uploadProfilePath = "/uploadprofile";
const userInfoPath = "/userinfo";
const scanUsersPath = "/scanusers";

exports.handler = async (event) => {
  console.log("Request Event: ", event);

  if (
    event.path === registerUserPath ||
    event.path === userInfoPath ||
    event.path === scanUsersPath
  ) {
    const { Authorization } = event.headers;

    if (!Authorization) {
      return util.buildResponse(403, {
        message: "You must logged in",
        goToLoginPage: true,
      });
    }

    const token = Authorization.replace("Bearer ", "");

    if (!authService.verifyUserToken(token)) {
      return util.buildResponse(403, {
        message: "Token is expired. Try to logged in again",
        goToLoginPage: true,
      });
    }
  } else if (
    event.path === uploadProfilePath ||
    event.path === getProfilePath
  ) {
    delete event.headers.Authorization;
  }

  switch (true) {
    case event.httpMethod === "POST" && event.path === registerPath:
      const registerBody = JSON.parse(event.body);
      return await registerService.register(registerBody);

    case event.httpMethod === "POST" && event.path === loginPath:
      const loginBody = JSON.parse(event.body);
      return await loginService.login(loginBody);

    case event.httpMethod === "POST" && event.path === registerUserPath:
      const registerNewUserBody = JSON.parse(event.body);
      return await registerNewUserService.registerNewUser(registerNewUserBody);

    case event.httpMethod === "GET" && event.path === userInfoPath:
      let nickNameUserInfo = event.queryStringParameters.nickname
        ? event.queryStringParameters.nickname
        : null;
      if (nickNameUserInfo) {
        return await userInfoService.getUserInfo(nickNameUserInfo);
      } else {
        return util.buildResponse(401, "You have to pass the nickname");
      }

    case event.httpMethod === "GET" && event.path === scanUsersPath:
      return await scanUsersService.scanUsers();

    case event.httpMethod === "POST" && event.path === uploadProfilePath:
      let nicknameUpload = JSON.parse(event.body).nickname;
      let url = await s3bucket.uploadUserProfile(nicknameUpload);
      return util.buildResponse(200, { url });

    case event.httpMethod === "GET" && event.path === getProfilePath:
      let nickNameGet = event.queryStringParameters.nickname
        ? event.queryStringParameters.nickname
        : null;

      if (nickNameGet) {
        let url = await s3bucket.getUserProfile(nickNameGet);
        return util.buildResponse(200, { url });
      } else {
        return util.buildResponse(401, "You have to pass the nickname");
      }

    default:
      return util.buildResponse(404, "404 Not Found");
  }
};
