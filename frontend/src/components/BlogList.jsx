import PropTypes from 'prop-types';
import BlogCard from './BlogCard.jsx';

const BlogList = ({ blogs, loading, onEdit, onDelete }) => {
  if (loading) {
    return <div className="loading">Cargando blogs…</div>;
  }

  if (!blogs.length) {
    return (
      <div className="empty-state">
        <p>Aún no hay blogs registrados. Crea uno nuevo para comenzar.</p>
      </div>
    );
  }

  return (
    <ul className="blog-list">
      {blogs.map((blog) => (
        <BlogCard key={blog.blogId} blog={blog} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </ul>
  );
};

BlogList.propTypes = {
  blogs: PropTypes.arrayOf(
    PropTypes.shape({
      blogId: PropTypes.number.isRequired,
      url: PropTypes.string,
      author: PropTypes.string,
      createdAt: PropTypes.instanceOf(Date),
    })
  ),
  loading: PropTypes.bool,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

BlogList.defaultProps = {
  blogs: [],
  loading: false,
};

export default BlogList;
