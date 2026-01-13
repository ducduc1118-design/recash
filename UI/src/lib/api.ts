import { API_TIMEOUT_MS } from './constants';
import { HttpError } from './httpError';
import { getAuthToken, isDemoMode } from './auth';

const BASE_URL = import.meta.env.VITE_API_BASE_URL?.toString() ?? '';

export const isApiConfigured = Boolean(BASE_URL);
export const shouldUseApi = () => Boolean(BASE_URL) && !isDemoMode();

const buildUrl = (path: string) => {
  if (!BASE_URL) return path;
  return `${BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
};

const parseJson = async (response: Response) => {
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }
  return response.text();
};

export const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  if (options.signal) {
    if (options.signal.aborted) {
      controller.abort();
    } else {
      options.signal.addEventListener('abort', () => controller.abort(), { once: true });
    }
  }

  try {
    const token = getAuthToken();
    const response = await fetch(buildUrl(path), {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
      ...options,
      signal: controller.signal,
    });

    if (!response.ok) {
      const body = await parseJson(response).catch(() => undefined);
      throw new HttpError({
        message: typeof body === 'string' && body ? body : response.statusText || 'Request failed',
        status: response.status,
        details: body,
      });
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return parseJson(response) as Promise<T>;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new HttpError({ message: 'Request aborted' });
    }
    throw new HttpError({ message: 'Network error', details: error });
  } finally {
    clearTimeout(timeout);
  }
};
