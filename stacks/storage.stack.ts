import { Bucket, StackContext, Topic } from 'sst/constructs';
import { BlockPublicAccess, HttpMethods, StorageClass } from 'aws-cdk-lib/aws-s3';
import { Duration } from 'aws-cdk-lib';

export function StorageStack({ stack }: StackContext) {
	const topic = new Topic(stack, 'objectRestored', {
		subscribers: {
			notificationEmail: {
				type: 'function',
				function: {
					functionName: 'object-restored-notification-email',
					handler: 'packages/functions/src/object-restored-notification-email.handler',
					architecture: 'arm_64',
					permissions: ['ses', 's3']
				}
			}
		}
	});

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
		},
		notifications: {
			GlacierObjectRestored: {
				events: ['object_restore_completed'],
				type: 'topic',
				topic
			}
		}
	});

	return { bucket };
}
