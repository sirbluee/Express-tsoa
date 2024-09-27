// require("dotenv").config();
// const S3 = require("aws-sdk/clients/s3");
// // const fs = require("fs");

// const bucketName = process.env.AWS_BUCKET_NAME;
// const region = process.env.AWS_REGION;
// const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
// const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

// console.log(process.env.AWS_REGION);
// console.log(process.env.AWS_BUCKET_NAME);

// const s3 = new S3({
//   region,
//   accessKeyId,
//   secretAccessKey,
// });

// // upload funtionally
// export default function uploadFile() {
//   const uploadParams = {
//     bucketName,
//     Body: "My content here",
//     Key: "my-file.txt",
//   };
//   return s3.upload(uploadParams).promise();
// }
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

// Ensure these values are not undefined
if (!bucketName || !region || !accessKeyId || !secretAccessKey) {
  throw new Error("Missing necessary AWS environment variables");
}

const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId: accessKeyId as string, // Type assertion to ensure they are strings
    secretAccessKey: secretAccessKey as string,
  },
});

export async function uploadFile(file: Express.Multer.File) {
  const uploadParams = {
    Bucket: bucketName,
    Body: file.buffer,
    Key: file.originalname,
    // ACL: "public-read" as ObjectCannedACL,
  };

  const command = new PutObjectCommand(uploadParams);
  return await s3.send(command);
}
