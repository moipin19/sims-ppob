import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Button from "../../components/Button";
import Input from "../../components/Input";
import PageHeroHeader from "../../components/PageHeroHeader";
import StatusModal from "../../components/StatusModal";
import { getProfile } from "../../redux/slices/profileSlice";
import { getBalance, getServices } from "../../redux/slices/serviceSlice";
import { createTransaction, getTransactionHistory, resetHistory } from "../../redux/slices/transactionSlice";
import { formatCurrency } from "../../utils/validators";

const WalletIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <rect x="3" y="6" width="18" height="12" rx="2" />
    <path d="M15 11h6v4h-6z" />
    <circle cx="17.5" cy="13" r="0.8" />
  </svg>
);

function PaymentPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.profile);
  const { balance, loadingBalance, selectedService, services } = useSelector((state) => state.service);
  const { loadingPay } = useSelector((state) => state.transaction);
  const [modalState, setModalState] = useState({
    open: false,
    type: "confirm",
    description: "",
    amountText: "",
    statusText: "",
    primaryText: "",
    secondaryText: "",
  });

  useEffect(() => {
    dispatch(getProfile());
    dispatch(getBalance());
    if (!services.length) {
      dispatch(getServices());
    }
  }, [dispatch, services.length]);

  const activeService = useMemo(() => {
    if (selectedService?.service_code) return selectedService;
    return null;
  }, [selectedService]);

  useEffect(() => {
    if (!activeService) {
      navigate("/home", { replace: true });
    }
  }, [activeService, navigate]);

  const onPay = () => {
    if (!activeService?.service_code) return;
    setModalState({
      open: true,
      type: "confirm",
      description: `Beli ${activeService.service_name.toLowerCase()} senilai`,
      amountText: `${formatCurrency(activeService.service_tariff || 0)} ?`,
      statusText: "",
      primaryText: "Ya, lanjutkan Bayar",
      secondaryText: "Batalkan",
    });
  };

  const onConfirmPay = async () => {
    if (!activeService?.service_code) return;
    const result = await dispatch(createTransaction(activeService.service_code));
    if (createTransaction.fulfilled.match(result)) {
      dispatch(getBalance());
      dispatch(resetHistory());
      dispatch(getTransactionHistory({ limit: 5, offset: 0 }));
      setModalState({
        open: true,
        type: "success",
        description: `Pembayaran ${activeService.service_name.toLowerCase()} sebesar`,
        amountText: formatCurrency(activeService.service_tariff || 0),
        statusText: "berhasil",
        primaryText: "Kembali ke Beranda",
        secondaryText: "",
      });
    } else {
      setModalState({
        open: true,
        type: "error",
        description: `Pembayaran ${activeService.service_name.toLowerCase()} sebesar`,
        amountText: formatCurrency(activeService.service_tariff || 0),
        statusText: "gagal",
        primaryText: "Kembali ke Beranda",
        secondaryText: "",
      });
    }
  };

  if (!activeService) return null;

  return (
    <div>
      <Navbar />
      <main className="container">
        <PageHeroHeader user={user} balance={balance} loadingBalance={loadingBalance} />

        <section className="payment-section">
          <p className="payment-label">Pembayaran</p>
          <div className="payment-service-row">
            <img src={activeService.service_icon} alt={activeService.service_name} />
            <h2>{activeService.service_name}</h2>
          </div>

          <Input
            value={formatCurrency(activeService.service_tariff || 0)}
            readOnly
            disabled
            leftIcon={<WalletIcon />}
          />
          <Button className="btn-primary" disabled={loadingPay} onClick={onPay}>
            {loadingPay ? "Processing..." : "Bayar"}
          </Button>
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
            onConfirmPay();
            return;
          }
          if (modalState.primaryText === "Kembali ke Beranda") {
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

export default PaymentPage;
