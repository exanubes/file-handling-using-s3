import { Bucket, Cron, StackContext, Topic, use } from 'sst/constructs';
import { BlockPublicAccess, HttpMethods, StorageClass } from 'aws-cdk-lib/aws-s3';
import { Duration } from 'aws-cdk-lib';
import { ConfigStack } from './config.stack';

export function StorageStack({ stack }: StackContext) {
	const { url, authToken } = use(ConfigStack);
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
			},
			statusUpdate: {
				type: 'function',
				function: {
					functionName: 'object-restored-status-update',
					handler: 'packages/functions/src/object-restored-status-update.handler',
					architecture: 'arm_64',
					bind: [url, authToken],
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

	new Cron(stack, 'cleanup-expired-restored-objects', {
		schedule: 'rate(1 day)',
		job: {
			function: {
				functionName: 'cleanup-expired-glacier-objects',
				handler: 'packages/functions/src/cleanup.handler',
				architecture: 'arm_64',
				permissions: [],
				bind: [url, authToken],
			}
		}
	});

	return { bucket };
}
