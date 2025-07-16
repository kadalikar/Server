const s3 = require("../config/aws.config");
const { v4: uuidv4 } = require("uuid");
const {
  PutObjectCommand,
  DeleteObjectCommand,
  S3Client,
} = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

class S3Service {
  static async uploadFile(file, folder = "uploads") {
    const fileExt = file.originalname.split(".").pop();
    const key = `${folder}/${uuidv4()}.${fileExt}`;

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    try {
      const result = await s3.upload(params).promise();
      console.log("Upload Success", result.Location);
      return {
        url: result.Location,
        key: result.Key,
      };
    } catch (err) {
      console.error("Upload Error:", err);
      throw err;
    }
  }

  static async getFileUrl(key) {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Expires: 60 * 5, // URL expires in 5 minutes
    };

    return s3.getSignedUrl("getObject", params);
  }

  static async deleteFile(key) {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    };

    await s3.deleteObject(params).promise();
    return true;
  }
  static async updateS3Image(file, existingKey) {
    try {
      // First delete the old image if exists
      if (existingKey) {
        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: existingKey,
          })
        );
      }

      // Upload new image
      const fileExt = file.originalname.split(".").pop();
      const newKey = `images/${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)}.${fileExt}`;

      const uploadParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: newKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      await s3Client.send(new PutObjectCommand(uploadParams));

      return {
        url: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${newKey}`,
        key: newKey,
      };
    } catch (err) {
      console.error("S3 Update Error:", err);
      throw new Error("Failed to update image");
    }
  }
}

module.exports = S3Service;
