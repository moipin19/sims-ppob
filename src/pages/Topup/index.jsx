import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Button from "../../components/Button";
import Input from "../../components/Input";
import PageHeroHeader from "../../components/PageHeroHeader";
import StatusModal from "../../components/StatusModal";
import { getProfile } from "../../redux/slices/profileSlice";
import { getBalance } from "../../redux/slices/serviceSlice";
import { topupBalance } from "../../redux/slices/transactionSlice";
import { formatCurrency } from "../../utils/validators";

const QUICK_TOPUP_AMOUNTS = [10000, 20000, 50000, 100000, 250000, 500000];

function TopupPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const [modalState, setModalState] = useState({
    open: false,
    type: "confirm",
    description: "",
    amountText: "",
    statusText: "",
    primaryText: "",
    secondaryText: "",
  });
  const { balance, loadingBalance } = useSelector((state) => state.service);
  const { loadingTopup } = useSelector((state) => state.transaction);
  const { user } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(getProfile());
    dispatch(getBalance());
  }, [dispatch]);

  const amount = Number(value || 0);
  const isValid = useMemo(() => amount >= 10000 && amount <= 1000000, [amount]);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!isValid) return;
    setModalState({
      open: true,
      type: "confirm",
      description: "Anda yakin untuk Top Up sebesar",
      amountText: `${formatCurrency(amount)} ?`,
      statusText: "",
      primaryText: "Ya, lanjutkan Top Up",
      secondaryText: "Batalkan",
    });
  };

  const onConfirmTopup = async () => {
    const result = await dispatch(topupBalance(amount));
    if (topupBalance.fulfilled.match(result)) {
      setValue("");
      dispatch(getBalance());
      setModalState({
        open: true,
        type: "success",
        description: "Top Up sebesar",
        amountText: formatCurrency(amount),
        statusText: "berhasil",
        primaryText: "Kembali ke Beranda",
        secondaryText: "",
      });
    } else {
      setModalState({
        open: true,
        type: "error",
        description: "Top Up sebesar",
        amountText: formatCurrency(amount),
        statusText: "gagal",
        primaryText: "Tutup",
        secondaryText: "",
      });
    }
  };

  return (
    <div>
      <Navbar />
      <main className="container">
        <PageHeroHeader user={user} balance={balance} loadingBalance={loadingBalance} />

        <section className="topup-section">
          <p className="section-subtitle">Silahkan masukan</p>
          <h2 className="section-title">Nominal Top Up</h2>
          <form onSubmit={onSubmit} className="topup-form-layout">
            <div>
              <Input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="masukan nominal Top Up"
                min={10000}
                max={1000000}
              />
              <Button type="submit" disabled={!isValid || loadingTopup} className="btn-primary">
                {loadingTopup ? "Loading..." : "Top Up"}
              </Button>
            </div>
            <div className="quick-topup-grid">
              {QUICK_TOPUP_AMOUNTS.map((amountValue) => (
                <button
                  key={amountValue}
                  type="button"
                  className="quick-topup-item"
                  onClick={() => setValue(String(amountValue))}
                >
                  {formatCurrency(amountValue)}
                </button>
              ))}
            </div>
          </form>
          <p className="helper-text">Minimal Rp10.000 dan maksimal Rp1.000.000</p>
        </section>
      </main>
      <StatusModal
        isOpen={modalState.open}
        type={modalState.type}
        description={modalState.description}
        amountText={modalState.amountText}
        statusText={modalState.statusText}
        primaryText={modalState.primaryText}
        onPrimary={() => {
          if (modalState.type === "confirm") {
            onConfirmTopup();
            return;
          }
          if (modalState.type === "success") {
            navigate("/home");
            return;
          }
          setModalState((prev) => ({ ...prev, open: false }));
        }}
        secondaryText={modalState.secondaryText}
        onSecondary={() => setModalState((prev) => ({ ...prev, open: false }))}
      />
    </div>
  );
}

export default TopupPage;
