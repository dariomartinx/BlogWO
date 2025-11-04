import { useCallback, useEffect, useMemo, useState } from 'react';

const DEFAULT_API_BASE_URL = 'http://localhost:5000';

const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && typeof envUrl === 'string') {
    return envUrl.replace(/\/$/, '');
  }
  return DEFAULT_API_BASE_URL;
};

const normalizeBlog = (blog) => ({
  ...blog,
  createdAt: blog.createdAt ? new Date(blog.createdAt) : null,
});

export const useBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseUrl = useMemo(() => getApiBaseUrl(), []);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseUrl}/api/blogs`);
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
  }, [baseUrl]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const createBlog = useCallback(
    async (blog) => {
      try {
        setLoading(true);
        const response = await fetch(`${baseUrl}/api/blogs`, {
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
    [baseUrl, fetchBlogs]
  );

  const updateBlog = useCallback(
    async (id, blog) => {
      try {
        setLoading(true);
        const response = await fetch(`${baseUrl}/api/blogs/${id}`, {
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
    [baseUrl, fetchBlogs]
  );

  const deleteBlog = useCallback(
    async (id) => {
      try {
        setLoading(true);
        const response = await fetch(`${baseUrl}/api/blogs/${id}`, {
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
    [baseUrl, fetchBlogs]
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
