import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Card from "./Card";
import { formatCurrency } from "../utils/validators";

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

function PageHeroHeader({ user, balance, loadingBalance }) {
  const defaultProfilePhoto = "/assets/Profile Photo.PNG";
  const { pathname } = useLocation();
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);

  useEffect(() => {
    setIsBalanceVisible(false);
  }, [pathname]);

  return (
    <section className="hero">
      <Card className="profile-summary">
        <img
          src={user?.profile_image || defaultProfilePhoto}
          alt="profile"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = defaultProfilePhoto;
          }}
        />
        <p>Selamat datang,</p>
        <h2>
          {user?.first_name} {user?.last_name}
        </h2>
      </Card>
      <Card className="balance-card">
        <p>Saldo anda</p>
        <h1>
          {loadingBalance
            ? "Loading..."
            : isBalanceVisible
              ? formatCurrency(balance?.balance)
              : "Rp • • • • • • •"}
        </h1>
        <button
          type="button"
          className="balance-visibility-button"
          onClick={() => setIsBalanceVisible((prev) => !prev)}
          aria-label={isBalanceVisible ? "Tutup saldo" : "Lihat saldo"}
          aria-pressed={isBalanceVisible}
        >
          <span>{isBalanceVisible ? "Tutup Saldo" : "Lihat Saldo"}</span>
          {isBalanceVisible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </Card>
    </section>
  );
}

export default PageHeroHeader;
