import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import {
	AbortMultipartUploadCommand,
	CompleteMultipartUploadCommand,
	CreateMultipartUploadCommand,
	DeleteObjectCommand,
	GetObjectCommand,
	ListObjectVersionsCommand,
	RestoreObjectCommand,
	S3Client,
	UploadPartCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { versionResponseValidator } from '$lib/validators.js';
import { z } from 'zod';

const client = new S3Client();

/**
 * @description create a signed upload url valid for 60 seconds
 * @param {{
 * bucket: string;
 * key: string;
 * fileName: string;
 * }} props
 * */
export async function createPostUrl(props) {
	const contentDisposition = `attachment; filename=${props.fileName}`;
	return createPresignedPost(client, {
		Bucket: props.bucket,
		Key: props.key,
		Expires: 60,
		Fields: {
			'Content-Disposition': contentDisposition
		}
	});
}

/**
 * @description create a signed download url valid for 60 seconds
 * @param {{
 * bucket: string;
 * key: string;
 * version?: string | null;
 * name: string;
 * }} props
 */
export async function createDownloadUrl(props) {
	/**@type {import('@aws-sdk/client-s3').GetObjectCommandInput}*/
	const input = {
		Bucket: props.bucket,
		Key: props.key,
		VersionId: props.version ?? undefined,
		ResponseContentDisposition: `attachment; filename=${props.name}`
	};

	const command = new GetObjectCommand(input);

	return getSignedUrl(client, command, { expiresIn: 60 });
}

/**
 * @description get a list of versions for s3 object key
 * @param {{bucket: string; key: string}} props
 * */
export async function getVersionsList(props) {
	const input = {
		Bucket: props.bucket,
		Prefix: props.key
	};

	const command = new ListObjectVersionsCommand(input);

	const response = await client.send(command);

	const deleteMarkers = response.DeleteMarkers?.map((marker) => ({
		...marker,
		deleted: true
	}));

	return z
		.array(versionResponseValidator)
		.parse(response.Versions?.concat(deleteMarkers ?? []))
		.sort((a, b) => +b.lastModified - +a.lastModified);
}

/**
 * @description remove object from a bucket. Creates delete marker when versioning is enabled
 * @param {{bucket: string; key: string;}} props
 * */
export async function removeObject(props) {
	const input = {
		Bucket: props.bucket,
		Key: props.key
	};

	const command = new DeleteObjectCommand(input);

	return client.send(command);
}

/**
 * @description Initiate restoring an archived object from AWS Glacier
 * @param {{
 * bucket: string;
 * key: string;
 * versionId?: string
 * }} props
 * @returns
 */
export async function restoreObject(props) {
	/**@type {import('@aws-sdk/client-s3').RestoreObjectCommandInput}*/
	const input = {
		Bucket: props.bucket,
		Key: props.key,
		VersionId: props.versionId,
		RestoreRequest: {
			Days: 1,
			GlacierJobParameters: {
				Tier: 'Expedited'
			}
		}
	};

	const command = new RestoreObjectCommand(input);

	return client.send(command);
}

/**
 * @description Begins a multipart uploads and returns an Upload Id that has to be used when generating signed urls for each part
 * @param {{bucket: string; key: string;}} props
 * */
export async function startMultipartUpload(props) {
	const input = {
		Bucket: props.bucket,
		Key: props.key
	};

	const command = new CreateMultipartUploadCommand(input);

	return client.send(command);
}

/**
 * @description generate a signed url for each part of the multipart upload
 * @param {{
 *     bucket: string;
 *     key: string;
 *     uploadId: string;
 *     parts: number;
 * }} props
 * */
export async function getMultipartUrls(props) {
	const input = {
		Bucket: props.bucket,
		Key: props.key,
		UploadId: props.uploadId,
		PartNumber: 0
	};

	const parts = Array.from({ length: props.parts }, (_, index) => index + 1);

	return Promise.all(
		parts.map((partNumber) => {
			const command = new UploadPartCommand({
				...input,
				PartNumber: partNumber
			});
			return getSignedUrl(client, command, { expiresIn: 600 });
		})
	);
}

/**
 * @description Completes the multipart upload and places the object inside the target bucket
 * @param {{
 *     bucket: string;
 *     key: string;
 *     uploadId: string;
 *     parts: import('@aws-sdk/client-s3').CompletedPart[]
 * }} props
 * */
export async function completeMultipartUpload(props) {
	const input = {
		Bucket: props.bucket,
		Key: props.key,
		UploadId: props.uploadId,
		MultipartUpload: {
			Parts: props.parts
		}
	};

	const command = new CompleteMultipartUploadCommand(input);

	return client.send(command);
}

/**
 * @description cancels an in-progress multipart upload and removes already uploaded parts from temporary storage
 * @param {{
 *     bucket: string;
 *     key: string;
 *     uploadId: string;
 * }} props
 * */
export async function abortMultipartUpload(props) {
	const input = {
		Bucket: props.bucket,
		Key: props.key,
		UploadId: props.uploadId
	};

	const command = new AbortMultipartUploadCommand(input);

	return client.send(command);
}
