import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadLaunchUrls = () => {
  const launchSettingsPath = path.resolve(
    __dirname,
    '..',
    'backend',
    'Properties',
    'launchSettings.json',
  );

  try {
    if (!fs.existsSync(launchSettingsPath)) {
      return [];
    }

    const raw = fs.readFileSync(launchSettingsPath, 'utf-8');
    const json = JSON.parse(raw);
    const profiles = json?.profiles ?? {};

    const urls = Object.values(profiles)
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

    const uniqueUrls = [...new Set(urls)];
    const sortWeight = (url) => (url.startsWith('https://') ? 0 : 1);
    uniqueUrls.sort((a, b) => sortWeight(a) - sortWeight(b));
    return uniqueUrls;
  } catch (error) {
    console.warn('No se pudo leer backend/Properties/launchSettings.json', error);
    return [];
  }
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
