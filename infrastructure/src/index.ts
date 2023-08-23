#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {
  resolveCurrentUserOwnerName,
} from '@exanubes/cdk-utils';
import { Tags } from 'aws-cdk-lib';

require('dotenv').config();

async function main() {
  const owner = await resolveCurrentUserOwnerName();
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'sample-stack');
  Tags.of(app).add('owner', owner);
}

main().catch((error) => {
  console.log(error);
  process.exit(1);
});
