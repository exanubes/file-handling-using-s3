import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import {join} from 'path'
export default defineConfig({
	plugins: [sveltekit()],
	envDir: join(process.cwd(), '..')
});
