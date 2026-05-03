import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export default function FormInput({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  name,
}) {
  const [showPass, setShowPass] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPass ? 'text' : 'password') : type;

  return (
    <div className="mb-3">
      <label className="form-label-custom">{label}</label>

      <div className={isPassword ? 'input-group-custom' : ''}>
        <input
          name={name}
          type={inputType}
          className={`form-control-custom ${error ? 'is-invalid' : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete="off"
        />

        {isPassword && (
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPass((p) => !p)}
            tabIndex={-1}
          >
            {showPass ? <FiEyeOff /> : <FiEye />}
          </button>
        )}
      </div>

      {error && <div className="invalid-text">{error}</div>}
    </div>
  );
}