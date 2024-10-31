import { S3 } from 'aws-sdk';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AWSS3Service {
  private s3: S3;
  private bucket: string;

  constructor() {
    this.s3 = new S3({
      apiVersion: '2024',
      region: process.env.AWS_REGION,
    });
    this.bucket = process.env.BUCKET_NAME;
  }

  async putObject(file: Buffer, s3path: string): Promise<{ Location: string }> {
    return new Promise((resolve, reject) => {
      this.s3.upload(
        {
          Bucket: this.bucket,
          Key: s3path,
          Body: file,
          ACL: 'public-read',
        },
        (err: Error, data: S3.ManagedUpload.SendData) => {
          if (err) {
            reject(err.message);
          } else {
            resolve({ Location: data.Location });
          }
        },
      );
    });
  }

  async getObject(path: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.s3.getObject(
        {
          Bucket: this.bucket,
          Key: path,
        },
        (err, data) => {
          if (err) {
            reject(err);
            throw err;
          } else {
            resolve(data);
          }
        },
      );
    });
  }
}
