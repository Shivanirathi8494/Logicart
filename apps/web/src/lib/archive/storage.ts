import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import {
  getArchiveStorageMode,
  getLocalArchiveDirectory,
  getS3ArchiveConfig,
} from "./config";

export type StoredArchive = {
  key: string;
  size: number;
  checksum: string;
};

function sha256(data: Buffer): string {
  return crypto.createHash("sha256").update(data).digest("hex");
}

function safeLocalPath(key: string): string {
  const root = path.resolve(getLocalArchiveDirectory());
  const target = path.resolve(root, key);

  if (target !== root && !target.startsWith(root + path.sep)) {
    throw new Error("Invalid archive storage key.");
  }

  return target;
}

function createS3Client() {
  const config = getS3ArchiveConfig();

  return {
    client: new S3Client({
      region: config.region,
      endpoint: config.endpoint,
      forcePathStyle: true,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    }),
    bucket: config.bucket,
  };
}

async function bodyToBuffer(body: unknown): Promise<Buffer> {
  if (!body) {
    throw new Error("Archive object body is empty.");
  }

  const sdkBody = body as {
    transformToByteArray?: () => Promise<Uint8Array>;
  };

  if (typeof sdkBody.transformToByteArray === "function") {
    return Buffer.from(await sdkBody.transformToByteArray());
  }

  const chunks: Buffer[] = [];

  for await (const chunk of body as AsyncIterable<Uint8Array>) {
    chunks.push(Buffer.from(chunk));
  }

  return Buffer.concat(chunks);
}

export async function putArchive(
  key: string,
  data: Buffer,
): Promise<StoredArchive> {
  const checksum = sha256(data);
  const mode = getArchiveStorageMode();

  if (mode === "local") {
    const target = safeLocalPath(key);

    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, data);

    const stat = await fs.stat(target);

    return {
      key,
      size: stat.size,
      checksum,
    };
  }

  const { client, bucket } = createS3Client();

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: data,
      ContentType: "application/zip",
      Metadata: {
        sha256: checksum,
      },
    }),
  );

  return {
    key,
    size: data.length,
    checksum,
  };
}

export async function getArchive(key: string): Promise<Buffer> {
  const mode = getArchiveStorageMode();

  if (mode === "local") {
    return fs.readFile(safeLocalPath(key));
  }

  const { client, bucket } = createS3Client();

  const result = await client.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  );

  return bodyToBuffer(result.Body);
}

export async function verifyArchive(
  key: string,
  expectedChecksum: string,
  expectedSize?: number,
): Promise<{
  verified: boolean;
  checksum: string;
  size: number;
}> {
  const data = await getArchive(key);

  const checksum = sha256(data);
  const size = data.length;

  return {
    verified:
      checksum === expectedChecksum &&
      (expectedSize === undefined || size === expectedSize),
    checksum,
    size,
  };
}
