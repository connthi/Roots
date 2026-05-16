import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({ region: process.env.S3_REGION || process.env.AWS_REGION || 'us-east-1' });
const BUCKET = process.env.S3_BUCKET_NAME;

/**
 * Upload a CSV string to S3 under user_profiles/
 */
export async function uploadUserCSV(userId, csvString) {
  const key = `user_profiles/${userId}_${Date.now()}.csv`;
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: csvString,
      ContentType: 'text/csv',
    })
  );
  return { bucket: BUCKET, key };
}

/**
 * Upload a JSON result to S3 under results/
 */
export async function uploadResult(userId, resultData) {
  const key = `results/${userId}_${Date.now()}.json`;
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: JSON.stringify(resultData, null, 2),
      ContentType: 'application/json',
    })
  );
  return { bucket: BUCKET, key };
}
