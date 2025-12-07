import express from 'express';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Initialize S3 client for Cloudflare R2
const s3Client = new S3Client({
  region: 'auto',
  credentials: {
    accessKeyId: process.env.CF_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CF_R2_SECRET_ACCESS_KEY,
  },
  endpoint: `https://${process.env.CF_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
});

// Generate presigned PUT URL for direct browser upload
router.post('/sign', authenticate, async (req, res) => {
  try {
    const { fileName, fileType } = req.body;

    if (!fileName || !fileType) {
      return res.status(400).json({ error: 'fileName and fileType required' });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(fileType)) {
      return res.status(400).json({ error: 'Invalid file type' });
    }

    // Generate unique key with timestamp
    const timestamp = Date.now();
    const key = `covers/${req.user.id}/${timestamp}-${fileName}`;

    // Create presigned URL for PUT request
    const command = new PutObjectCommand({
      Bucket: process.env.CF_R2_BUCKET,
      Key: key,
      ContentType: fileType,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600, // 1 hour
    });

    // Return presigned URL and public URL for saving to DB
    const publicUrl = `${process.env.CF_R2_PUBLIC_BASE_URL}/${key}`;

    res.json({
      presignedUrl,
      publicUrl,
      key,
    });
  } catch (error) {
    console.error('Error signing upload:', error);
    res.status(500).json({ error: 'Failed to generate presigned URL' });
  }
});

export default router;
