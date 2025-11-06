import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

const normalizeInput = (value) => value.trim().replace(/\/$/, '');

const ApiSettings = ({
  baseUrl,
  customBaseUrl,
  availableBaseUrls,
  onApply,
  onReset,
  loading,
}) => {
  const [value, setValue] = useState(customBaseUrl || baseUrl || '');
  const suggestions = useMemo(
    () => availableBaseUrls.filter(Boolean),
    [availableBaseUrls],
  );

  useEffect(() => {
    setValue(customBaseUrl || baseUrl || '');
  }, [customBaseUrl, baseUrl]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const normalized = normalizeInput(value);
    onApply(normalized || null);
  };

  const handleReset = () => {
    onReset();
  };

  return (
    <section className="card api-settings">
      <div className="api-settings__header">
        <h2>Conexión con la API</h2>
        <p>
          Introduce la URL base de tu API o selecciona una sugerencia. El valor se
          guardará en el navegador.
        </p>
      </div>
      <form className="api-settings__form" onSubmit={handleSubmit}>
        <label className="field">
          <span>URL base</span>
          <input
            type="url"
            placeholder="https://localhost:5001"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            required
          />
        </label>
        <div className="api-settings__actions">
          <button type="submit" className="primary" disabled={loading}>
            {loading ? 'Comprobando…' : 'Guardar URL'}
          </button>
          <button
            type="button"
            className="secondary"
            onClick={handleReset}
            disabled={loading}
          >
            Usar detección automática
          </button>
        </div>
      </form>
      {suggestions.length > 0 && (
        <div className="api-settings__suggestions">
          <span>Opciones detectadas:</span>
          <div className="api-settings__chips">
            {suggestions.map((option) => (
              <button
                key={option}
                type="button"
                className={`chip ${option === customBaseUrl ? 'chip--active' : ''}`}
                onClick={() => onApply(option)}
                disabled={loading}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
      {baseUrl && (
        <p className="api-settings__current">
          Usando actualmente: <strong>{baseUrl}</strong>
        </p>
      )}
    </section>
  );
};

ApiSettings.propTypes = {
  baseUrl: PropTypes.string,
  customBaseUrl: PropTypes.string,
  availableBaseUrls: PropTypes.arrayOf(PropTypes.string),
  onApply: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

ApiSettings.defaultProps = {
  baseUrl: null,
  customBaseUrl: null,
  availableBaseUrls: [],
  loading: false,
};

export default ApiSettings;
