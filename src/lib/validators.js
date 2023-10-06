import { z } from 'zod';
export const documentValidator = z
	.object({
		id: z.string(),
		name: z.string(),
		key: z.string(),
		deleted: z.number()
	})
	.transform((props) => ({
		...props,
		deleted: Boolean(props.deleted)
	}));

export const versionResponseValidator = z
	.object({
		Key: z.string(),
		LastModified: z.date(),
		VersionId: z.string(),
		IsLatest: z.boolean(),
		StorageClass: z.string().optional(),
		deleted: z.boolean().optional()
	})
	.transform((arg, ctx) => ({
		key: arg.Key,
		lastModified: arg.LastModified,
		versionId: arg.VersionId,
		isLatest: arg.IsLatest,
		isArchived: arg.StorageClass === 'GLACIER',
		deleted: Boolean(arg.deleted)
	}));
