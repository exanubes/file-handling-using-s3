#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {Tags} from 'aws-cdk-lib';
import {resolveCurrentUserOwnerName,} from '@exanubes/cdk-utils';
import {BlockPublicAccess, Bucket, HttpMethods} from "aws-cdk-lib/aws-s3";
import {BUCKET_NAME} from "./config";

require('dotenv').config();

async function main() {
  const owner = await resolveCurrentUserOwnerName();
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'sample-stack');
  new Bucket(stack, 'uploads', {
    bucketName: BUCKET_NAME,
    blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
    versioned: true,
    cors: [{
      allowedMethods: [HttpMethods.POST],
      allowedOrigins: ['http://localhost:5173'],
      allowedHeaders: ['*']
    }]
  })
  Tags.of(app).add('owner', owner);
}

main().catch((error) => {
  console.log(error);
  process.exit(1);
});
