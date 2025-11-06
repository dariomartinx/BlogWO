import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKEND_DIR = path.resolve(__dirname, '..', 'backend');
const IGNORED_DIRS = new Set(['node_modules', 'bin', 'obj', '.git']);

const findLaunchSettingsFiles = (rootDir) => {
  const files = [];
  const pending = [rootDir];

  while (pending.length > 0) {
    const current = pending.pop();
    let entries;

    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch (error) {
      console.warn(`No se pudo leer el directorio ${current}`, error);
      continue;
    }

    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (!IGNORED_DIRS.has(entry.name)) {
          pending.push(path.join(current, entry.name));
        }
      } else if (entry.isFile() && entry.name === 'launchSettings.json') {
        files.push(path.join(current, entry.name));
      }
    }
  }

  return files;
};

const loadLaunchUrlsFromFile = (filePath) => {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const json = JSON.parse(raw);
    const profiles = json?.profiles ?? {};

    return Object.values(profiles)
      .flatMap((profile) => {
        if (!profile || typeof profile.applicationUrl !== 'string') {
          return [];
        }
        return profile.applicationUrl
          .split(';')
          .map((item) => item.trim())
          .filter(Boolean);
      })
      .filter(Boolean);
  } catch (error) {
    console.warn(`No se pudo procesar ${filePath}`, error);
    return [];
  }
};

const loadLaunchUrls = () => {
  if (!fs.existsSync(BACKEND_DIR)) {
    return [];
  }

  const launchFiles = findLaunchSettingsFiles(BACKEND_DIR);
  if (launchFiles.length === 0) {
    return [];
  }

  const urls = launchFiles.flatMap((filePath) => loadLaunchUrlsFromFile(filePath));
  const uniqueUrls = [...new Set(urls)];
  const sortWeight = (url) => (url.startsWith('https://') ? 0 : 1);
  uniqueUrls.sort((a, b) => sortWeight(a) - sortWeight(b));
  return uniqueUrls;
};

const launchUrls = loadLaunchUrls();

if (!process.env.VITE_DEV_PROXY_TARGET && launchUrls.length > 0) {
  process.env.VITE_DEV_PROXY_TARGET = launchUrls[0];
}

if (!process.env.VITE_KNOWN_API_URLS && launchUrls.length > 0) {
  process.env.VITE_KNOWN_API_URLS = launchUrls.join(',');
}

const DEV_PROXY_TARGET = process.env.VITE_DEV_PROXY_TARGET || 'http://localhost:5000';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: DEV_PROXY_TARGET,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
