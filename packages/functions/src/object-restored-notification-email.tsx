import { S3Event, SNSEvent } from 'aws-lambda';
import { GetObjectCommand, GetObjectCommandInput, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { SendEmailCommand, SendEmailCommandInput, SESClient } from '@aws-sdk/client-ses';
import { render } from '@react-email/render';
import { GlacierObjectRestored } from '../../react-email-starter/emails/glacier-object-restored';
import * as React from 'react';

export async function handler(event: SNSEvent) {
	const [{ Sns }] = event.Records;
	const s3Event: S3Event = JSON.parse(Sns.Message);

	const [{ s3, glacierEventData }] = s3Event.Records;

	const { key, versionId } = s3.object;

	const validUntil = glacierEventData?.restoreEventData.lifecycleRestorationExpiryTime;

	const signedUrl = await generatePresignedUrl({
		bucketName: s3.bucket.name,
		key,
		versionId
	});

	// @ts-expect-error
	const html = render(<GlacierObjectRestored signedUrl={signedUrl} expiry={validUntil} />);

	return sendEmail(html);
}

const s3Client = new S3Client();
const ONE_DAY = 60 * 60 * 24;
async function generatePresignedUrl(props: {
	bucketName: string;
	key: string;
	versionId?: string;
}) {
	const input: GetObjectCommandInput = {
		Bucket: props.bucketName,
		Key: props.key,
		VersionId: props.versionId
	};

	const command = new GetObjectCommand(input);

	return getSignedUrl(s3Client, command, { expiresIn: ONE_DAY });
}

const emailClient = new SESClient();

async function sendEmail(html: string) {
	const input: SendEmailCommandInput = {
		Source: 'noreply@exanubes.com',
		Destination: {
			ToAddresses: ['blog@exanubes.com']
		},
		Message: {
			Body: {
				Html: {
					Charset: 'UTF-8',
					Data: html
				}
			},
			Subject: {
				Charset: 'UTF-8',
				Data: 'Your document is ready!'
			}
		}
	};
	const command = new SendEmailCommand(input);

	return emailClient.send(command);
}
