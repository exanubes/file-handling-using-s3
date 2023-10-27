import { StackContext, SvelteKitSite, use } from 'sst/constructs';
import { StorageStack } from './storage.stack';
import { ConfigStack } from './config.stack';

export function SiteStack({ stack }: StackContext) {
	const { bucket } = use(StorageStack);
	const { url, authToken } = use(ConfigStack);
	const site = new SvelteKitSite(stack, 'site', {
		bind: [bucket, url, authToken]
	});
	stack.addOutputs({
		url: site.url
	});
}
