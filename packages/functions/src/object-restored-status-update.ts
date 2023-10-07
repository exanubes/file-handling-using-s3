import { S3Event, SNSEvent } from 'aws-lambda';

import { createClient } from '@libsql/client';

export const databaseClient = createClient({
	url: 'libsql://moved-huntress-exanubes.turso.io',
	authToken:
		'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2OTUxMzk3NDgsImlkIjoiYTFhN2FlNGItNTcwNi0xMWVlLTgyN2EtNTI2MmNlY2IzZWJjIn0.XI3RN4mdBDNU0SPqdoEQ3-0Mb_65vcqh6X51Z0C6ZzLG_Zx9YwjghEibqExO1McBKInDM3FCh3dn0ts9Ek5KAQ'
});

export async function handler(event: SNSEvent) {
	const [{ Sns }] = event.Records;
	const s3Event: S3Event = JSON.parse(Sns.Message);

	const [{ s3, glacierEventData }] = s3Event.Records;

	const { key, versionId } = s3.object;

	const validUntil = glacierEventData?.restoreEventData.lifecycleRestorationExpiryTime;

	if (validUntil && versionId) {
		await databaseClient.execute({
			sql: 'UPDATE restores SET validUntil = ?, status = "completed" WHERE key = ? AND version = ?',
			args: [validUntil, key, versionId]
		});
	}
}
