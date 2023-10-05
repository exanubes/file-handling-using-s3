import { Bucket, StackContext } from 'sst/constructs';
import {BlockPublicAccess, HttpMethods, StorageClass} from 'aws-cdk-lib/aws-s3';
import {Duration} from "aws-cdk-lib";

export function StorageStack({ stack }: StackContext) {
	const bucket = new Bucket(stack, 'uploads', {
		name: 'exanubes-upload-bucket-sst',
		cors: [
			{
				allowedMethods: [HttpMethods.POST],
				allowedOrigins: ['http://localhost:5173'],
				allowedHeaders: ['*']
			}
		],
		cdk: {
			bucket: {
				blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
				versioned: true,
				lifecycleRules: [
					{
						enabled: true,
						noncurrentVersionTransitions: [
							{
								transitionAfter: Duration.days(1),
								storageClass: StorageClass.GLACIER
							}
						],
						transitions: [
							{
								transitionAfter: Duration.days(30),
								storageClass: StorageClass.GLACIER
							}
						]
					}
				]
			}
		}
	});

	return { bucket };
}
