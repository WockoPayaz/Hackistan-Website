import { spawn } from 'node:child_process';

// Normal development uses Next.js. The managed review environment forwards
// Vite's flags; there we serve the exact Next production export for visual QA.
const args = process.argv.slice(2);
const managedReview = args.includes('--strictPort');
const cli = managedReview ? 'node_modules/vite/bin/vite.js' : 'node_modules/next/dist/bin/next';
const cliArgs = managedReview ? ['--config', 'vite.review.config.mjs', ...args] : ['dev', ...args];
const child = spawn(process.execPath, [cli, ...cliArgs], { stdio: 'inherit', env: process.env });
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
child.on('exit', code => process.exit(code ?? 0));
