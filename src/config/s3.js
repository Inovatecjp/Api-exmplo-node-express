const { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { fromIni } = require("@aws-sdk/credential-providers");

const minioUrl = process.env.MINIO_URL;
const accessKey = process.env.MINIO_ACCESS_KEY;
const secretKey = process.env.MINIO_SECRET_KEY;
const bucketName = process.env.MINIO_BUCKET_NAME;

const credentials = {
  accessKeyId: '9VQP1Fy0rcT7xQgc3Kqn',
  secretAccessKey: 'YcxlsR9NVlaapS8MBRGKiWPdnWysigRD2y2TmbrL',
};

const s3ClientConfig = {
  region: "us-east-2",
  credentials: credentials,
};

if (minioUrl) {
  s3ClientConfig.endpoint = minioUrl;
  s3ClientConfig.forcePathStyle = true;
}

const s3Client = new S3Client(s3ClientConfig);

const s3Service = {};

s3Service.deleteWithPreSignedUrl = async (fileName) => {
  if (fileName) {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: fileName,
    });
    return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  } else {
    return null;
  }
};

s3Service.getWithPresignedUrl = async (fileName, fileType) => {
  if (fileName) {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      ResponseContentType: fileType,
    });
    return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  } else {
    return null;
  }
};

s3Service.putWithPresignedUrl = async (fileName, fileType) => {
  if (fileName) {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      ContentType: fileType,
    });
    return await getSignedUrl(s3Client, command, { expiresIn: 300 });
  } else {
    return null;
  }
};

module.exports = s3Service;
