import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import {
  GetObjectCommand,
  ListObjectsV2Command,
  S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Buffer } from 'buffer';
import * as FileSystem from 'expo-file-system';
import * as mime from 'react-native-mime-types';

console.log(process.env.EXPO_PUBLIC_AWS_ACCESS_KEY);
const AWS_OPTIONS = {
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.EXPO_PUBLIC_AWS_ACCESS_KEY || '',
    secretAccessKey: process.env.EXPO_PUBLIC_AWS_SECRET_KEY || '',
  },
};
const s3Client = new S3Client(AWS_OPTIONS);

const dynamodbClient = new DynamoDBClient(AWS_OPTIONS);

const generateFileName = (uri: string) => {
  const fileName = uri.split('/').pop();
  const dateString = new Date().toISOString();
  return `${fileName}-${dateString}`;
};

const getBlob = async (uri: string) => {
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return Buffer.from(base64, 'base64');
  } catch (error) {
    console.error('Error reading file:', error);
    throw error;
  }
};

const createDynamoDBItem = async (uri: string, fileName: string) => {
  const command = new PutItemCommand({
    TableName: process.env.EXPO_PUBLIC_DYNAMODB_TABLE_NAME || '',
    Item: {
      userid: { S: new Date().toISOString() },
      snapid: { S: fileName },
      updatedAt: { S: new Date().toISOString() },
    },
  });
  try {
    const response = await dynamodbClient.send(command);
    console.log('DynamoDB item created successfully:', response);
  } catch (error) {
    console.error('Error creating DynamoDB item:', error);
  }
};

// Get all images from the S3 Bucket
export const getAllImages = async () => {
  const command = new ListObjectsV2Command({
    Bucket: process.env.EXPO_PUBLIC_S3_BUCKET_NAME || '',
  });
  try {
    const response = await s3Client.send(command);
    console.log('S3 objects:', response.Contents);
    const keys = response.Contents?.map((item) => item.Key);
    if (keys) {
      const urls = await Promise.all(
        keys.map(async (key) => {
          // return `https://${process.env.EXPO_PUBLIC_S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;
          if (!key) return '';
          return await createPresignedUrlWithClient(key);
        })
      );
      console.log('S3 URLs:', urls);
      return urls;
    }
  } catch (error) {
    console.error('Error listing S3 objects:', error);
  }
};

const createPresignedUrlWithClient = async (key: string) => {
  const command = new GetObjectCommand({
    Bucket: process.env.EXPO_PUBLIC_S3_BUCKET_NAME,
    Key: key,
  });
  return await getSignedUrl(s3Client, command, {
    expiresIn: 3600,
  });
};

export const uploadFile = async (uri: string) => {
  const fileName = generateFileName(uri);
  const blob = await getBlob(uri);
  const contentType = mime.lookup(uri) || 'application/octet-stream';

  const parallelUploads3 = new Upload({
    client: s3Client,
    params: {
      Bucket: process.env.EXPO_PUBLIC_S3_BUCKET_NAME || '',
      Key: fileName,
      Body: blob,
      ContentType: contentType,
    },
    leavePartsOnError: false,
  });

  parallelUploads3.on('httpUploadProgress', (progress) => {
    console.log(progress);
  });

  try {
    await parallelUploads3.done();
    await createDynamoDBItem(uri, fileName);
    console.log('DynamoDB item created successfully!');
    console.log('File uploaded successfully!');
  } catch (e) {
    console.error('Error uploading file:', e);
  }
};
