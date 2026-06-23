import { getApiBaseUrl } from './api-base';

function getApiOrigin() {
  const baseUrl = getApiBaseUrl();

  try {
    return new URL(baseUrl).origin;
  } catch {
    return baseUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');
  }
}

function normalizeRemoteImageUrl(path: string) {
  if (/^(data:|blob:)/i.test(path)) {
    return path;
  }

  const apiOrigin = getApiOrigin();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const publicPath = normalizedPath.startsWith('/storage/')
    ? `/api/arquivos/${normalizedPath.replace(/^\/storage\//, '')}`
    : normalizedPath;

  if (!/^https?:\/\//i.test(path)) {
    return `${apiOrigin}${publicPath}`;
  }

  try {
    const url = new URL(path);

    if (url.pathname.startsWith('/storage/')) {
      const apiFilePath = `/api/arquivos/${url.pathname.replace(/^\/storage\//, '')}`;
      return `${apiOrigin}${apiFilePath}${url.search}${url.hash}`;
    }

    return url.toString();
  } catch {
    return `${apiOrigin}${publicPath}`;
  }
}

export function resolvePublicImageUrl(path?: string | null) {
  if (!path) {
    return undefined;
  }

  if (/^(data:|blob:)/i.test(path)) {
    return path;
  }

  const remoteUrl = normalizeRemoteImageUrl(path);

  if (/^(data:|blob:)/i.test(remoteUrl)) {
    return remoteUrl;
  }

  return `/api/image?src=${encodeURIComponent(remoteUrl)}`;
}

export function resolveRemoteImageUrl(path?: string | null) {
  if (!path) {
    return undefined;
  }

  return normalizeRemoteImageUrl(path);
}
