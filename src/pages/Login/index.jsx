import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { loginUser } from "../../redux/slices/authSlice";
import { isValidEmail } from "../../utils/validators";

const MailIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m4 7 8 6 8-6" />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <rect x="4" y="10" width="16" height="10" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </svg>
);

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loginLoading } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");

  const validate = () => {
    const nextErrors = {};
    if (!form.email) nextErrors.email = "Email wajib diisi";
    if (form.email && !isValidEmail(form.email)) nextErrors.email = "Format email tidak valid";
    if (!form.password) nextErrors.password = "Password wajib diisi";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoginError("");
    if (!validate()) return;
    const result = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(result)) {
      navigate("/home");
    } else {
      setLoginError(result.payload || "password yang anda masukan salah");
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-card auth-card-login">
        <div className="auth-brand-row">
          <img src="/assets/Logo.PNG" className="auth-logo" alt="logo" />
          <span>SIMS PPOB ARIFIN</span>
        </div>
        <h1>Masuk atau buat akun untuk memulai</h1>
        <form onSubmit={onSubmit}>
          <Input
            type="email"
            value={form.email}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, email: e.target.value }));
              setLoginError("");
            }}
            placeholder="masukkan email anda"
            error={errors.email}
            leftIcon={<MailIcon />}
          />
          <Input
            type="password"
            value={form.password}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, password: e.target.value }));
              setLoginError("");
            }}
            placeholder="masukan password anda"
            error={errors.password}
            leftIcon={<LockIcon />}
          />
          <Button disabled={loginLoading} type="submit" className="btn-primary">
            {loginLoading ? "Loading..." : "Masuk"}
          </Button>
        </form>
        <p className="auth-footer">
          belum punya akun? registrasi <Link to="/register">di sini</Link>
        </p>
        {loginError && (
          <div className="auth-login-alert">
            <span>{loginError}</span>
            <button type="button" onClick={() => setLoginError("")} aria-label="Close login error">
              ×
            </button>
          </div>
        )}
      </div>
      <div className="auth-banner">
        <img src="/assets/Illustrasi Login.PNG" alt="illustration" />
      </div>
    </div>
  );
}

export default LoginPage;
