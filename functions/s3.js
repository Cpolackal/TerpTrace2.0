const crypto = require("crypto");
const aws = require("aws-sdk");

const region = "us-east-2"; // Update to your region
const bucketName = "terpitems"; // Update to your bucket name

// These will be passed as parameters from the main function
function createS3Client(accessKeyId, secretAccessKey) {
  return new aws.S3({
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion: "v4",
  });
}

async function generateDownloadURL(key, s3Client) {
  const params = {
    Bucket: bucketName,
    Key: key,
    Expires: 300,
  };

  const url = await s3Client.getSignedUrlPromise("getObject", params);
  return url;
}

async function generateUploadURL(folder = "uploads", s3Client) {
  const rawBytes = crypto.randomBytes(16);
  const imageName = rawBytes.toString("hex");

  const key = `${folder}/${imageName}`;
  const params = {
    Bucket: bucketName,
    Key: key,
    Expires: 60,
  };
  const url = await s3Client.getSignedUrlPromise("putObject", params);
  return { url, key };
}

module.exports = {
  createS3Client,
  generateDownloadURL,
  generateUploadURL,
}; 