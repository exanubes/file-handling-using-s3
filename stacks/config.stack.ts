import { StackContext, Config } from 'sst/constructs';

export function ConfigStack({ stack }: StackContext) {
	const url = new Config.Secret(stack, 'DB_URL');
	const authToken = new Config.Secret(stack, 'DB_AUTH_TOKEN');

	return {
		url,
		authToken
	};
}
