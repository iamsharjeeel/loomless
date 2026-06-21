import "server-only";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * Cloudflare R2 access via the S3-compatible API. This module is server-only —
 * R2 credentials must never reach the client. The client is created lazily so
 * the module can be imported without env vars present (e.g. during build).
 */

let client: S3Client | null = null;

function getClient(): S3Client {
  if (client) return client;
  const accountId = requireEnv("R2_ACCOUNT_ID");
  client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: requireEnv("R2_ACCESS_KEY_ID"),
      secretAccessKey: requireEnv("R2_SECRET_ACCESS_KEY"),
    },
  });
  return client;
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

function bucket(): string {
  return requireEnv("R2_BUCKET_NAME");
}

/** Presigned PUT URL for a client-side direct upload. */
export function presignPut(key: string, contentType: string, expiresIn = 600): Promise<string> {
  return getSignedUrl(
    getClient(),
    new PutObjectCommand({ Bucket: bucket(), Key: key, ContentType: contentType }),
    { expiresIn }
  );
}

/** Short-lived presigned GET URL for playback. */
export function presignGet(key: string, expiresIn = 3600): Promise<string> {
  return getSignedUrl(getClient(), new GetObjectCommand({ Bucket: bucket(), Key: key }), {
    expiresIn,
  });
}

export async function deleteObject(key: string): Promise<void> {
  await getClient().send(new DeleteObjectCommand({ Bucket: bucket(), Key: key }));
}
