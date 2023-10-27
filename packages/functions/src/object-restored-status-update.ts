import { S3Event, SNSEvent } from 'aws-lambda';
import { Config } from 'sst/node/config';
import { createClient } from '@libsql/client';

const databaseClient = createClient({
	url: Config.DB_URL,
	authToken: Config.DB_AUTH_TOKEN
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
