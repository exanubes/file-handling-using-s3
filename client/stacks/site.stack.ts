import { StackContext, SvelteKitSite, use } from 'sst/constructs';
import { StorageStack } from './storage.stack';

export function SiteStack({ stack }: StackContext) {
	const { bucket } = use(StorageStack);
	const site = new SvelteKitSite(stack, 'site', {
		bind: [bucket]
	});
	stack.addOutputs({
		url: site.url
	});
}
