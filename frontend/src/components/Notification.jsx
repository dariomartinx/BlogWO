import { useEffect } from 'react';
import PropTypes from 'prop-types';

const Notification = ({ type, text, onClose }) => {
  useEffect(() => {
    if (!onClose) return;
    const timeout = setTimeout(() => onClose(), 3500);
    return () => clearTimeout(timeout);
  }, [onClose]);

  return (
    <div className={`notification ${type}`} role="alert">
      <span>{text}</span>
      {onClose && (
        <button type="button" className="close-button" onClick={onClose}>
          ×
        </button>
      )}
    </div>
  );
};

Notification.propTypes = {
  type: PropTypes.oneOf(['success', 'error']).isRequired,
  text: PropTypes.string.isRequired,
  onClose: PropTypes.func,
};

Notification.defaultProps = {
  onClose: undefined,
};

export default Notification;
