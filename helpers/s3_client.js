const { s3Client } = require('@aws-sdk/client-s3');

const s3ClientHelper = new s3Client({
    region: 'us-east-1', // Change to your preferred region
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
  });

module.exports = {
    s3ClientHelper
}