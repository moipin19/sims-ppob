import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/Button";
import Input from "../../components/Input";
import StatusModal from "../../components/StatusModal";
import { registerUser } from "../../redux/slices/authSlice";
import { isValidEmail } from "../../utils/validators";

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { registerLoading } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [modalState, setModalState] = useState({
    open: false,
    type: "success",
    description: "",
    amountText: "",
    statusText: "",
    primaryText: "",
  });

  const validate = () => {
    const nextErrors = {};
    if (!form.email) nextErrors.email = "Email is required";
    if (form.email && !isValidEmail(form.email)) nextErrors.email = "Invalid email format";
    if (!form.first_name) nextErrors.first_name = "First name is required";
    if (!form.last_name) nextErrors.last_name = "Last name is required";
    if (!form.password) nextErrors.password = "Password is required";
    if (!form.confirmPassword) nextErrors.confirmPassword = "Confirm password is required";
    if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = "Password does not match";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    const payload = {
      email: form.email,
      first_name: form.first_name,
      last_name: form.last_name,
      password: form.password,
    };
    const result = await dispatch(registerUser(payload));
    if (registerUser.fulfilled.match(result)) {
      setModalState({
        open: true,
        type: "success",
        description: "Registrasi akun berhasil",
        amountText: "",
        statusText: "Silakan login untuk melanjutkan",
        primaryText: "Ke Halaman Login",
      });
    } else {
      setModalState({
        open: true,
        type: "error",
        description: "Registrasi akun gagal",
        amountText: "",
        statusText: result.payload || "Silakan coba lagi",
        primaryText: "Tutup",
      });
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <img src="/assets/Logo.PNG" className="auth-logo" alt="logo" />
        <h1>Lengkapi data untuk membuat akun</h1>
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
            label="First Name"
            type="text"
            value={form.first_name}
            onChange={(e) => setForm((prev) => ({ ...prev, first_name: e.target.value }))}
            placeholder="nama depan"
            error={errors.first_name}
          />
          <Input
            label="Last Name"
            type="text"
            value={form.last_name}
            onChange={(e) => setForm((prev) => ({ ...prev, last_name: e.target.value }))}
            placeholder="nama belakang"
            error={errors.last_name}
          />
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            placeholder="buat password"
            error={errors.password}
          />
          <Input
            label="Confirm Password"
            type="password"
            value={form.confirmPassword}
            onChange={(e) => setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
            placeholder="konfirmasi password"
            error={errors.confirmPassword}
          />
          <Button disabled={registerLoading} type="submit" className="btn-primary">
            {registerLoading ? "Loading..." : "Registrasi"}
          </Button>
        </form>
        <p className="auth-footer">
          Sudah punya akun? <Link to="/login">Login di sini</Link>
        </p>
      </div>
      <div className="auth-banner">
        <img src="/assets/Illustrasi Login.PNG" alt="illustration" />
      </div>
      <StatusModal
        isOpen={modalState.open}
        type={modalState.type}
        description={modalState.description}
        amountText={modalState.amountText}
        statusText={modalState.statusText}
        primaryText={modalState.primaryText}
        onPrimary={() => {
          if (modalState.type === "success") {
            navigate("/login");
            return;
          }
          setModalState((prev) => ({ ...prev, open: false }));
        }}
      />
    </div>
  );
}

export default RegisterPage;
