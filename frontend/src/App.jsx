import { useState } from 'react';
import BlogForm from './components/BlogForm.jsx';
import BlogList from './components/BlogList.jsx';
import Notification from './components/Notification.jsx';
import ApiSettings from './components/ApiSettings.jsx';
import { useBlogs } from './hooks/useBlogs.js';
import './App.css';

function App() {
  const {
    blogs,
    loading,
    error,
    createBlog,
    updateBlog,
    deleteBlog,
    refresh,
    baseUrl,
    availableBaseUrls,
    setApiBaseUrl,
    customBaseUrl,
  } = useBlogs();
  const [editingBlog, setEditingBlog] = useState(null);
  const [message, setMessage] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  const handleCreate = async (blog) => {
    const result = await createBlog(blog);
    if (result.success) {
      setMessage({ type: 'success', text: 'Blog creado correctamente.' });
      setEditingBlog(null);
    } else {
      setMessage({ type: 'error', text: result.message });
    }
  };

  const handleUpdate = async (blog) => {
    if (!editingBlog) return;
    const payload = {
      ...blog,
      createdAt: editingBlog.createdAt ?? new Date(),
    };
    const result = await updateBlog(editingBlog.blogId, payload);
    if (result.success) {
      setMessage({ type: 'success', text: 'Blog actualizado correctamente.' });
      setEditingBlog(null);
    } else {
      setMessage({ type: 'error', text: result.message });
    }
  };

  const handleSubmit = async (blog) => {
    if (editingBlog) {
      await handleUpdate(blog);
    } else {
      await handleCreate(blog);
    }
  };

  const handleDelete = async (blogId) => {
    if (!window.confirm('¿Seguro que deseas eliminar este blog?')) {
      return;
    }
    const result = await deleteBlog(blogId);
    if (result.success) {
      setMessage({ type: 'success', text: 'Blog eliminado correctamente.' });
    } else {
      setMessage({ type: 'error', text: result.message });
    }
  };

  const handleCancelEdit = () => {
    setEditingBlog(null);
  };

  const handleRetry = () => {
    refresh();
  };

  const handleApplyApiUrl = (value) => {
    setApiBaseUrl(value);
    setMessage({
      type: 'success',
      text: value
        ? `Se utilizará la API en ${value}.`
        : 'Se restableció la detección automática de la API.',
    });
    setShowSettings(false);
  };

  const handleResetApiUrl = () => {
    handleApplyApiUrl(null);
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>BlogWO</h1>
        <p className="subtitle">
          Panel de administración para gestionar los blogs de tu API ASP.NET.
        </p>
        <div className="header-actions">
          <button
            type="button"
            className="secondary"
            onClick={() => setShowSettings((prev) => !prev)}
            disabled={loading}
          >
            {showSettings ? 'Cerrar configuración' : 'Configurar API'}
          </button>
          {baseUrl && (
            <span className="active-base-url">Conectado a: {baseUrl}</span>
          )}
        </div>
      </header>

      <main className="content">
        <section className="form-section">
          <div className="card">
            <h2>{editingBlog ? 'Editar blog' : 'Crear nuevo blog'}</h2>
            <BlogForm
              key={editingBlog ? editingBlog.blogId : 'new'}
              initialValues={editingBlog}
              onSubmit={handleSubmit}
              onCancel={editingBlog ? handleCancelEdit : undefined}
              loading={loading}
            />
          </div>
        </section>

        <section className="list-section">
          <div className="card">
            <div className="list-header">
              <h2>Blogs registrados</h2>
              <button type="button" className="refresh-button" onClick={handleRetry}>
                Actualizar
              </button>
            </div>
            {error && (
              <Notification
                type="error"
                text={`No se pudieron cargar los blogs: ${error}`}
              />
            )}
            <BlogList
              blogs={blogs}
              loading={loading}
              onEdit={setEditingBlog}
              onDelete={handleDelete}
            />
          </div>
        </section>

        {showSettings && (
          <ApiSettings
            baseUrl={baseUrl}
            customBaseUrl={customBaseUrl}
            availableBaseUrls={availableBaseUrls}
            onApply={handleApplyApiUrl}
            onReset={handleResetApiUrl}
            loading={loading}
          />
        )}
      </main>

      {message && (
        <Notification
          type={message.type}
          text={message.text}
          onClose={() => setMessage(null)}
        />
      )}
    </div>
  );
}

export default App;
