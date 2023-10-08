import type { documentValidator, versionResponseValidator } from '$lib/validators';
import type { z } from 'zod';

export type Document = z.infer<typeof documentValidator>;
export type VersionResponse = z.infer<typeof versionResponseValidator>;

