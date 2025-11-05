import { useCallback, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'blogwo.apiBaseUrl';
const DEFAULT_API_BASE_URLS = [
  'https://localhost:5001',
  'http://localhost:5000',
  'https://localhost:7050',
  'http://localhost:7050',
  'https://localhost:7262',
  'http://localhost:7262',
];

const unique = (values) => [...new Set(values.filter(Boolean))];

const normalizeUrl = (url) => url.replace(/\/$/, '');

const getApiBaseUrls = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && typeof envUrl === 'string') {
    return [normalizeUrl(envUrl)];
  }

  const candidates = [...DEFAULT_API_BASE_URLS];

  if (typeof window !== 'undefined' && window.location?.origin) {
    candidates.unshift(window.location.origin);
  }

  return unique(candidates.map(normalizeUrl));
};

const loadStoredBaseUrl = () => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? normalizeUrl(stored) : null;
  } catch (err) {
    console.warn('No se pudo leer la URL de la API almacenada.', err);
    return null;
  }
};

const persistStoredBaseUrl = (value) => {
  if (typeof window === 'undefined') return;
  try {
    if (value) {
      window.localStorage.setItem(STORAGE_KEY, normalizeUrl(value));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch (err) {
    console.warn('No se pudo guardar la URL de la API.', err);
  }
};

const normalizeBlog = (blog) => ({
  ...blog,
  createdAt: blog.createdAt ? new Date(blog.createdAt) : null,
});

export const useBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const defaultBaseUrls = useMemo(() => getApiBaseUrls(), []);
  const storedBaseUrl = useMemo(() => loadStoredBaseUrl(), []);
  const [customBaseUrl, setCustomBaseUrl] = useState(storedBaseUrl);
  const [baseUrl, setBaseUrl] = useState(
    () => storedBaseUrl || defaultBaseUrls[0] || null,
  );

  const allBaseUrlOptions = useMemo(() => {
    const options = [...defaultBaseUrls];
    if (customBaseUrl && !options.includes(customBaseUrl)) {
      options.unshift(customBaseUrl);
    }
    return options.filter(Boolean);
  }, [defaultBaseUrls, customBaseUrl]);

  const request = useCallback(
    async (path, options = {}) => {
      const attempts = [
        baseUrl,
        customBaseUrl && customBaseUrl !== baseUrl ? customBaseUrl : null,
        ...defaultBaseUrls.filter(
          (candidate) => candidate !== baseUrl && candidate !== customBaseUrl,
        ),
      ].filter(Boolean);

      let lastError = null;

      for (const candidate of attempts) {
        try {
          const init = (() => {
            if (!options) return undefined;
            const { body, headers, ...rest } = options;
            const prepared = {
              ...rest,
              headers: headers ? { ...headers } : undefined,
            };
            if (typeof body !== 'undefined') {
              prepared.body = body;
            }
            return prepared;
          })();

          const response = await fetch(`${candidate}${path}`, init);
          setBaseUrl(candidate);
          return response;
        } catch (err) {
          lastError = err;
        }
      }

      throw lastError || new Error('No se pudo conectar con la API.');
    },
    [baseUrl, customBaseUrl, defaultBaseUrls]
  );

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await request('/api/blogs');
      if (!response.ok) {
        throw new Error(`Estado ${response.status}`);
      }
      const data = await response.json();
      setBlogs(data.map(normalizeBlog));
    } catch (err) {
      const failedUrls = allBaseUrlOptions.length
        ? ` (intentos: ${allBaseUrlOptions.join(', ')})`
        : '';
      setError(`${err.message || 'Error desconocido'}${failedUrls}`);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  }, [request, allBaseUrlOptions]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const createBlog = useCallback(
    async (blog) => {
      try {
        setLoading(true);
        const response = await request('/api/blogs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(blog),
        });
        if (!response.ok) {
          throw new Error('No se pudo crear el blog.');
        }
        await fetchBlogs();
        return { success: true };
      } catch (err) {
        return { success: false, message: err.message };
      } finally {
        setLoading(false);
      }
    },
    [request, fetchBlogs]
  );

  const updateBlog = useCallback(
    async (id, blog) => {
      try {
        setLoading(true);
        const response = await request(`/api/blogs/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...blog, blogId: id }),
        });
        if (!response.ok) {
          throw new Error('No se pudo actualizar el blog.');
        }
        await fetchBlogs();
        return { success: true };
      } catch (err) {
        return { success: false, message: err.message };
      } finally {
        setLoading(false);
      }
    },
    [request, fetchBlogs]
  );

  const deleteBlog = useCallback(
    async (id) => {
      try {
        setLoading(true);
        const response = await request(`/api/blogs/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('No se pudo eliminar el blog.');
        }
        await fetchBlogs();
        return { success: true };
      } catch (err) {
        return { success: false, message: err.message };
      } finally {
        setLoading(false);
      }
    },
    [request, fetchBlogs]
  );

  const setApiBaseUrl = useCallback(
    (value) => {
      const normalized = value ? normalizeUrl(value) : null;
      persistStoredBaseUrl(normalized);
      setCustomBaseUrl(normalized);
      setBaseUrl(normalized || defaultBaseUrls[0] || null);
    },
    [defaultBaseUrls],
  );

  return {
    blogs,
    loading,
    error,
    createBlog,
    updateBlog,
    deleteBlog,
    refresh: fetchBlogs,
    baseUrl,
    availableBaseUrls: allBaseUrlOptions,
    setApiBaseUrl,
    customBaseUrl,
  };
};
