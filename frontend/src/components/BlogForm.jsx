import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const emptyForm = {
  url: '',
  author: '',
};

const BlogForm = ({ initialValues, onSubmit, onCancel, loading }) => {
  const [values, setValues] = useState(emptyForm);

  useEffect(() => {
    if (initialValues) {
      setValues({
        url: initialValues.url ?? '',
        author: initialValues.author ?? '',
      });
    } else {
      setValues(emptyForm);
    }
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!values.url.trim() || !values.author.trim()) {
      return;
    }
    onSubmit({
      url: values.url.trim(),
      author: values.author.trim(),
    });
  };

  return (
    <form className="blog-form" onSubmit={handleSubmit}>
      <label className="field">
        <span>Dirección del blog</span>
        <input
          type="url"
          name="url"
          placeholder="https://mi-blog.com"
          value={values.url}
          onChange={handleChange}
          required
        />
      </label>

      <label className="field">
        <span>Autor</span>
        <input
          type="text"
          name="author"
          placeholder="Nombre del autor"
          value={values.author}
          onChange={handleChange}
          required
        />
      </label>

      <div className="form-actions">
        {onCancel && (
          <button type="button" className="secondary" onClick={onCancel} disabled={loading}>
            Cancelar
          </button>
        )}
        <button type="submit" className="primary" disabled={loading}>
          {loading ? 'Guardando…' : 'Guardar'}
        </button>
      </div>
    </form>
  );
};

BlogForm.propTypes = {
  initialValues: PropTypes.shape({
    blogId: PropTypes.number,
    url: PropTypes.string,
    author: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  loading: PropTypes.bool,
};

BlogForm.defaultProps = {
  initialValues: null,
  onCancel: undefined,
  loading: false,
};

export default BlogForm;
