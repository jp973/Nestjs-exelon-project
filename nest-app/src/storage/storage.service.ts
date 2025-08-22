// src/storage/storage.service.ts
import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Readable } from 'stream';
import { File } from 'multer'; // Import Multer's File type

@Injectable()
export class StorageService {
  private s3: S3Client;
  private bucket: string;
  private region: string;

  constructor(private configService: ConfigService) {
    this.region = this.configService.get<string>('AWS_REGION')!;
    this.s3 = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID')!,
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY')!,
      },
    });
    this.bucket = this.configService.get<string>('S3_BUCKET_NAME')!;
  }
  async uploadFile(file: File): Promise<string> {
    const fileKey = `${Date.now()}-${file.originalname}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    // Return the S3 file URL
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${fileKey}`;
  }

  async getFileUrl(filename: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: filename,
    });

    // Generate signed URL (valid for 1 hour)
    return await getSignedUrl(this.s3, command, { expiresIn: 3600 });
  }

  async getFileStream(filename: string): Promise<Readable | null> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: filename,
      });
      const response = await this.s3.send(command);
      return response.Body as Readable;
    } catch (error) {
      console.error('Error getting file from S3:', error);
      return null;
    }
  }

  async deleteFile(filename: string): Promise<{ deleted: boolean }> {
    try {
      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: filename,
        }),
      );
      return { deleted: true };
    } catch (error) {
      console.error('Error deleting file from S3:', error);
      return { deleted: false };
    }
  }
}
