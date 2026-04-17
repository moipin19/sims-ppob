import { useState } from "react";

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z" />
    <circle cx="12" cy="12" r="2.8" />
  </svg>
);

const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M2 12s3.5-6 10-6c2.2 0 4 .6 5.5 1.5" />
    <path d="M22 12s-3.5 6-10 6c-2.2 0-4-.6-5.5-1.5" />
    <circle cx="12" cy="12" r="2.8" />
    <path d="M4 20 20 4" />
  </svg>
);

function Input({ label, error, type, ...props }) {
  const isPasswordInput = type === "password";
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const inputType = isPasswordInput && isPasswordVisible ? "text" : type;

  return (
    <div className="field">
      {label && <label className="label">{label}</label>}
      <div className={isPasswordInput ? "input-wrap" : ""}>
        <input className={`input ${error ? "input-error" : ""}`} type={inputType} {...props} />
        {isPasswordInput && (
          <button
            type="button"
            className="input-visibility-toggle"
            onClick={() => setIsPasswordVisible((prev) => !prev)}
            aria-label={isPasswordVisible ? "Hide password" : "Show password"}
            aria-pressed={isPasswordVisible}
          >
            {isPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}

export default Input;
