import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import HomePage from "./pages/Home";
import ProfilePage from "./pages/Profile";
import TopupPage from "./pages/Topup";
import TransactionPage from "./pages/Transaction";
import PaymentPage from "./pages/Payment";
import PrivateRoute from "./routes/PrivateRoute";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<PrivateRoute />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/topup" element={<TopupPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/transaction" element={<TransactionPage />} />
      </Route>

      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

export default App;
