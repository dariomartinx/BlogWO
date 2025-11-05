import PropTypes from 'prop-types';

const formatDate = (date) => {
  if (!date) return 'Sin fecha';
  return new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

const BlogCard = ({ blog, onEdit, onDelete }) => {
  return (
    <li className="blog-card">
      <div>
        <p className="blog-url">
          <a href={blog.url} target="_blank" rel="noopener noreferrer">
            {blog.url}
          </a>
        </p>
        <p className="blog-meta">
          Autor: <strong>{blog.author || 'Sin autor'}</strong>
        </p>
        <p className="blog-meta">Creado: {formatDate(blog.createdAt)}</p>
      </div>
      <div className="card-actions">
        <button type="button" className="secondary" onClick={() => onEdit(blog)}>
          Editar
        </button>
        <button type="button" className="danger" onClick={() => onDelete(blog.blogId)}>
          Eliminar
        </button>
      </div>
    </li>
  );
};

BlogCard.propTypes = {
  blog: PropTypes.shape({
    blogId: PropTypes.number.isRequired,
    url: PropTypes.string,
    author: PropTypes.string,
    createdAt: PropTypes.instanceOf(Date),
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default BlogCard;
