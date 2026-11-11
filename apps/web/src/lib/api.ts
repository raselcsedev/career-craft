const API_HOST = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export class ApiError extends Error {
  constructor(public status: number, message: string, public data?: any) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const path = cleanEndpoint.startsWith('/api/v1') ? cleanEndpoint : `/api/v1${cleanEndpoint}`;
  const url = `${API_HOST}${path}`;

  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // Attach Bearer token from localStorage for cross-domain deployments (e.g. Vercel frontend + Render backend)
  // where third-party cookies are blocked or partitioned by browsers.
  if (typeof window !== 'undefined' && !headers.has('Authorization')) {
    const token = localStorage.getItem('careercraft_token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  // Enforce a 12-second timeout to prevent indefinite browser hangs
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // sends and receives HTTP-only cookies
      signal: options.signal || controller.signal,
    });

    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type');
    let data: any = null;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    }

    if (!response.ok) {
      const errorMessage =
        data?.message ||
        (Array.isArray(data?.message)
          ? data.message.join(', ')
          : `Request failed with status ${response.status}`);
      throw new ApiError(response.status, errorMessage, data);
    }

    return data as T;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new ApiError(408, 'Request timed out. Please check if the API server is running on port 3001.');
    }
    throw err;
  }
}

export const api = {
  get: <T>(url: string, options?: RequestInit) => request<T>(url, { ...options, method: 'GET' }),
  post: <T>(url: string, body?: any, options?: RequestInit) =>
    request<T>(url, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  patch: <T>(url: string, body?: any, options?: RequestInit) =>
    request<T>(url, {
      ...options,
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  delete: <T>(url: string, options?: RequestInit) => request<T>(url, { ...options, method: 'DELETE' }),
};
