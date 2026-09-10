export type ArchiveStorageMode = "local" | "s3";

export function getArchiveStorageMode(): ArchiveStorageMode {
  const mode = process.env.ARCHIVE_STORAGE_MODE?.trim().toLowerCase();

  if (mode === "s3") {
    return "s3";
  }

  return "local";
}

export function getLocalArchiveDirectory(): string {
  return process.env.ARCHIVE_LOCAL_DIR?.trim() || ".data/delivered-archives";
}

export function getS3ArchiveConfig() {
  const required = {
    endpoint: process.env.ARCHIVE_S3_ENDPOINT,
    region: process.env.ARCHIVE_S3_REGION || "auto",
    bucket: process.env.ARCHIVE_S3_BUCKET,
    accessKeyId: process.env.ARCHIVE_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.ARCHIVE_S3_SECRET_ACCESS_KEY,
  };

  if (
    !required.endpoint ||
    !required.bucket ||
    !required.accessKeyId ||
    !required.secretAccessKey
  ) {
    throw new Error(
      "S3 archive storage is enabled but archive S3 configuration is incomplete.",
    );
  }

  return {
    endpoint: required.endpoint,
    region: required.region,
    bucket: required.bucket,
    accessKeyId: required.accessKeyId,
    secretAccessKey: required.secretAccessKey,
  } as {
    endpoint: string;
    region: string;
    bucket: string;
    accessKeyId: string;
    secretAccessKey: string;
  };
}
