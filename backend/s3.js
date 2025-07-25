import dotenv from "dotenv";
import crypto from "crypto";
import aws from "aws-sdk";
import { promisify } from "util";

dotenv.config();

const region = "us-east-2"; // Update to your region
const bucketName = "your-bucket-name"; // Update to your bucket name
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: "v4",
});

export async function generateURL() {
  const rawBytes = crypto.randomBytes(16);
  const imageName = rawBytes.toString("hex");

  const params = {
    Bucket: bucketName,
    Key: imageName,
    Expires: 60,
  };
  const url = await s3.getSignedUrlPromise("putObject", params);
  return url;
}
