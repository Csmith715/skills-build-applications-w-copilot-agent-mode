const fallbackApiBaseUrl = 'http://127.0.0.1:8000/api';

export function getApiUrl(resource) {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim();

  if (codespaceName) {
    return `https://${codespaceName}-8000.app.github.dev/api/${resource}/`;
  }

  return `${fallbackApiBaseUrl}/${resource}/`;
}

export function normalizeCollection(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!payload || typeof payload !== 'object') {
    return [];
  }

  for (const key of ['results', 'items', 'data', 'docs', 'records', 'page']) {
    if (Array.isArray(payload[key])) {
      return payload[key];
    }
  }

  return [];
}
