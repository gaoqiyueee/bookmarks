// Cloudflare Pages 构建脚本
// 将环境变量注入 index.html 占位符
const fs = require('fs');
const path = require('path');

const src = fs.readFileSync('index.html', 'utf8');

const out = src
  .replace(/%%WEBDAV_URL%%/g,  process.env.WEBDAV_URL  || '')
  .replace(/%%WEBDAV_USER%%/g, process.env.WEBDAV_USER || '')
  .replace(/%%WEBDAV_PASS%%/g, process.env.WEBDAV_PASS || '');

fs.mkdirSync('dist', { recursive: true });
fs.writeFileSync(path.join('dist', 'index.html'), out);
console.log('Build done. WebDAV URL:', process.env.WEBDAV_URL ? '✅ injected' : '⚠️  not set');
