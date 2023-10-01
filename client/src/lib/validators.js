import { z } from 'zod';
export const documentValidator = z.object({
	id: z.string(),
	name: z.string(),
	key: z.string()
});

export const versionResponseValidator = z.object({
	Key: z.string(),
	LastModified: z.date(),
	VersionId: z.string(),
	IsLatest: z.boolean()
}).transform((arg, ctx) => ({
	key: arg.Key,
	lastModified: arg.LastModified,
	versionId: arg.VersionId,
	isLatest: arg.IsLatest
}))