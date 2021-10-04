const AWS = require("aws-sdk");

AWS.config.update({ region: "eu-west-3" });

const region = "eu-west-3";
const accessKeyId = "AWS_ACCESS_KEY_ID";
const secretAccessKey = "AWS_SECRET_ACCESS_KEY";
const bucketName = "test-game-bucket";

const s3 = new AWS.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: "v4",
});

async function uploadUserProfile(imageName) {
  const params = {
    Bucket: bucketName,
    Key: imageName,
    Expires: 60,
  };

  // return upload url
  return await s3.getSignedUrlPromise("putObject", params);
}

async function getUserProfile(imageName) {
  const params = {
    Bucket: bucketName,
    Key: imageName,
    Expires: 60000, // the availability of the resource
  };

  // return upload url
  return await s3.getSignedUrlPromise("getObject", params);
}

module.exports.uploadUserProfile = uploadUserProfile;
module.exports.getUserProfile = getUserProfile;
