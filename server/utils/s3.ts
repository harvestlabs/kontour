import {
  S3Client,
  PutObjectCommand,
  S3ClientConfig,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import logger from "./logger";
import config from "../../config";
import { Readable } from "stream";

/* If we're running locally we point to a docker compose container running localstack */
function s3ClientParams(): S3ClientConfig {
  if (config.app.IS_LOCAL) {
    return {
      region: config.aws.REGION,
      credentials: {
        accessKeyId: "test",
        secretAccessKey: "test",
      },
      endpoint: "http://localstack:4566",
      forcePathStyle: true,
    };
  } else {
    return {
      region: config.aws.REGION,
      credentials: {
        accessKeyId: config.aws.UPLOAD_KEY,
        secretAccessKey: config.aws.UPLOAD_SECRET,
      },
    };
  }
}
function getS3URI(filename: string): string {
  if (config.app.IS_LOCAL) {
    return `http://localstack:4566/${config.aws.UPLOAD_BUCKET}/${filename}`;
  }
  return `https://${config.aws.UPLOAD_BUCKET}.s3.amazonaws.com/${filename}`;
}

export const s3Client = new S3Client(s3ClientParams());
export const uploadFile = async (
  folder: string,
  filename: string,
  contentType: string,
  body: string | Uint8Array | Buffer | ReadableStream<any>
): Promise<string> => {
  const mediaUploadParams = {
    Bucket: config.aws.UPLOAD_BUCKET,
    Key: `${folder}/${filename}`,
    Body: body,
    ContentType: contentType,
  };

  try {
    await s3Client.send(new PutObjectCommand(mediaUploadParams));
  } catch (err) {
    logger.debug("Error", err);
    throw new Error(err);
  }

  const url = getS3URI(`${folder}/${filename}`);
  logger.debug(`Location: ${url}`);
  return url;
};

export const createFolder = async (folderName: string): Promise<boolean> => {
  const params = {
    Bucket: config.aws.UPLOAD_BUCKET,
    Key: folderName + "/",
  };
  try {
    await s3Client.send(new PutObjectCommand(params));
  } catch (e) {
    logger.error("createBucket", { e });
    return false;
  }
  return true;
};

export const getFile = async (key: string): Promise<Buffer> => {
  const params = {
    Bucket: config.aws.UPLOAD_BUCKET,
    Key: key,
  };

  try {
    const resp = await s3Client.send(new GetObjectCommand(params));
    const stream = resp.Body as Readable;

    return new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on("data", (chunk) => chunks.push(chunk));
      stream.once("end", () => resolve(Buffer.concat(chunks)));
      stream.once("error", reject);
    });
  } catch (err) {
    logger.debug("Error", err);
    throw new Error(err);
  }
};
