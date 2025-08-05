const crypto = require("crypto");
const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const region = "us-east-2"; // Update to your region
const bucketName = "terpitems"; // Update to your bucket name

// These will be passed as parameters from the main function
function createS3Client(accessKeyId, secretAccessKey) {
  return new S3Client({
    region: region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

async function generateDownloadURL(key, s3Client) {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 300 });
  return url;
}

async function generateUploadURL(folder = "uploads", s3Client) {
  const rawBytes = crypto.randomBytes(16);
  const imageName = rawBytes.toString("hex");
  const key = `${folder}/${imageName}`;
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: "image/jpeg", // Adjust content type as needed
  });
  const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });
  return { url, key };
}

module.exports = {
  createS3Client,
  generateDownloadURL,
  generateUploadURL,
};
