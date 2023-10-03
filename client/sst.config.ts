import type { SSTConfig } from 'sst';
import { StorageStack } from './stacks/storage.stack';
import { SiteStack } from './stacks/site.stack';

export default {
	config(_input) {
		return {
			name: 'file-storage-with-s3',
			region: 'eu-central-1'
		};
	},
	stacks(app) {
		app.stack(StorageStack).stack(SiteStack);
	}
} satisfies SSTConfig;
