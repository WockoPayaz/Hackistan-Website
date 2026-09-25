import { defineConfig } from 'vite';
import { createReadStream, readFileSync, statSync } from 'node:fs';
import { extname, resolve, sep } from 'node:path';

const output = resolve('out');
const contentTypes = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff2': 'font/woff2', '.png': 'image/png', '.ico': 'image/x-icon', '.txt': 'text/plain', '.json': 'application/json' };

export default defineConfig({
  root: 'out',
  publicDir: false,
  server: { host: '0.0.0.0', allowedHosts: ['terminal.local'] },
  plugins: [{
    name: 'local-design-review',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = new URL(req.url ?? '/', 'http://terminal.local');
        if (url.pathname === '/__review') {
          res.setHeader('Content-Type', 'text/html');
          res.end(readFileSync(resolve('scripts/design-review.html'), 'utf8'));
          return;
        }
        // Serve the Next export byte-for-byte. Vite's HTML rewriting and HMR
        // cache-busting can otherwise interrupt Turbopack chunk registration.
        let file;
        try {
          file = resolve(output, '.' + decodeURIComponent(url.pathname));
          if (file !== output && !file.startsWith(output + sep)) return next();
          if (statSync(file).isDirectory()) file = resolve(file, 'index.html');
          if (!statSync(file).isFile()) return next();
        } catch { return next(); }
        res.setHeader('Content-Type', contentTypes[extname(file)] ?? 'application/octet-stream');
        res.setHeader('Cache-Control', 'no-store');
        createReadStream(file).pipe(res);
      });
    },
  }],
});
