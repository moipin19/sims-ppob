import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import StatusModal from "./StatusModal";
import { logout } from "../redux/slices/authSlice";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const onLogout = () => {
    setShowLogoutModal(false);
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="navbar">
      <NavLink to="/home" className="navbar-brand">
        <img src="/assets/Logo.PNG" alt="SIMS PPOB" />
        <span>SIMS PPOB ARIFIN</span>
      </NavLink>

      <button
        type="button"
        className="hamburger-button"
        aria-label={
          isMenuOpen ? "Close navigation menu" : "Open navigation menu"
        }
        aria-expanded={isMenuOpen}
        onClick={() => setIsMenuOpen((prev) => !prev)}
      >
        <span />
        <span />
        <span />
      </button>

      <button
        type="button"
        className={`nav-backdrop ${isMenuOpen ? "open" : ""}`}
        aria-label="Close navigation menu"
        onClick={() => setIsMenuOpen(false)}
      />

      <nav className={`nav-links ${isMenuOpen ? "open" : ""}`}>
        {/* <NavLink to="/home">Home</NavLink> */}
        <NavLink to="/topup">Top Up</NavLink>
        <NavLink to="/transaction">Transaction</NavLink>
        <NavLink to="/profile">Akun</NavLink>
        <button
          type="button"
          className="link-button"
          onClick={() => setShowLogoutModal(true)}
        >
          Logout
        </button>
      </nav>

      <StatusModal
        isOpen={showLogoutModal}
        type="confirm"
        description="Anda yakin ingin logout?"
        amountText=""
        statusText=""
        primaryText="Ya, Logout"
        onPrimary={onLogout}
        secondaryText="Batalkan"
        onSecondary={() => setShowLogoutModal(false)}
      />
    </header>
  );
}

export default Navbar;
