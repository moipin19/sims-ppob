import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { loginUser } from "../../redux/slices/authSlice";
import { isValidEmail } from "../../utils/validators";
import useNotify from "../../hooks/useNotify";

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notify = useNotify();
  const { loginLoading } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const nextErrors = {};
    if (!form.email) nextErrors.email = "Email is required";
    if (form.email && !isValidEmail(form.email)) nextErrors.email = "Invalid email format";
    if (!form.password) nextErrors.password = "Password is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    const result = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(result)) {
      notify("Login success");
      navigate("/home");
    } else {
      notify(result.payload || "Login failed");
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <img src="/assets/Logo.PNG" className="auth-logo" alt="logo" />
        <h1>Masuk atau buat akun untuk memulai</h1>
        <form onSubmit={onSubmit}>
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="masukkan email anda"
            error={errors.email}
          />
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            placeholder="masukkan password anda"
            error={errors.password}
          />
          <Button disabled={loginLoading} type="submit" className="btn-primary">
            {loginLoading ? "Loading..." : "Masuk"}
          </Button>
        </form>
        <p className="auth-footer">
          Belum punya akun? <Link to="/register">Registrasi di sini</Link>
        </p>
      </div>
      <div className="auth-banner">
        <img src="/assets/Illustrasi Login.PNG" alt="illustration" />
      </div>
    </div>
  );
}

export default LoginPage;
