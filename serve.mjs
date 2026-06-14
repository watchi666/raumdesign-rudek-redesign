import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('.', import.meta.url));
const PORT = Number(process.env.PORT) || 3050;
const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif', '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon', '.woff2': 'font/woff2',
};

const server = http.createServer(async (req, res) => {
  try {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let fsPath = normalize(join(ROOT, p));
    if (!fsPath.startsWith(ROOT)) { res.writeHead(403); return res.end('forbidden'); }
    let s;
    try { s = await stat(fsPath); } catch { res.writeHead(404); return res.end('not found'); }
    if (s.isDirectory()) fsPath = join(fsPath, 'index.html');
    const data = await readFile(fsPath);
    res.writeHead(200, { 'content-type': MIME[extname(fsPath).toLowerCase()] || 'application/octet-stream', 'cache-control': 'no-cache' });
    res.end(data);
  } catch (e) {
    res.writeHead(500); res.end(String(e));
  }
});
server.listen(PORT, () => console.log(`RaumDesign preview on http://localhost:${PORT}/`));
