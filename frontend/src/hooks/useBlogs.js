import { useCallback, useEffect, useMemo, useState } from 'react';

const DEFAULT_API_BASE_URLS = ['https://localhost:5001', 'http://localhost:5000'];

const normalizeUrl = (url) => url.replace(/\/$/, '');

const getApiBaseUrls = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && typeof envUrl === 'string') {
    return [normalizeUrl(envUrl)];
  }
  return DEFAULT_API_BASE_URLS.map(normalizeUrl);
};

const normalizeBlog = (blog) => ({
  ...blog,
  createdAt: blog.createdAt ? new Date(blog.createdAt) : null,
});

export const useBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseUrlOptions = useMemo(() => getApiBaseUrls(), []);
  const [baseUrl, setBaseUrl] = useState(() => baseUrlOptions[0]);

  const request = useCallback(
    async (path, options = {}) => {
      const attempts = [
        baseUrl,
        ...baseUrlOptions.filter((candidate) => candidate !== baseUrl),
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
    [baseUrl, baseUrlOptions]
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
      setError(err.message || 'Error desconocido');
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  }, [request]);

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

  return {
    blogs,
    loading,
    error,
    createBlog,
    updateBlog,
    deleteBlog,
    refresh: fetchBlogs,
  };
};
