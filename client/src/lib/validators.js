import { z } from 'zod';
export const documentValidator = z.object({
	id: z.string(),
	name: z.string(),
	key: z.string()
});
