import { Bucket, StackContext } from 'sst/constructs';
import { BlockPublicAccess, HttpMethods } from 'aws-cdk-lib/aws-s3';

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
				versioned: true
			}
		}
	});

	return { bucket };
}
