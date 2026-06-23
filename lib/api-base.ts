const DEFAULT_DEV_API_URL = 'http://localhost:8000/api';
const DEFAULT_PROD_API_URL = 'https://guardianshipcouncil.x10.mx/api';

function isLocalUrl(url: string) {
  try {
    const parsed = new URL(url);
    return ['localhost', '127.0.0.1'].includes(parsed.hostname);
  } catch {
    return false;
  }
}

export function getApiBaseUrl() {
  const envUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

  if (envUrl) {
    if (process.env.NODE_ENV === 'production' && isLocalUrl(envUrl)) {
      return DEFAULT_PROD_API_URL;
    }

    return envUrl.replace(/\/$/, '');
  }

  return process.env.NODE_ENV === 'production' ? DEFAULT_PROD_API_URL : DEFAULT_DEV_API_URL;
}

export function getStorageBaseUrl() {
  return getApiBaseUrl().replace(/\/api\/?$/, '/storage/');
}
