import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Button from "../../components/Button";
import Card from "../../components/Card";
import StatusModal from "../../components/StatusModal";
import {
  createTransaction,
  getTransactionHistory,
  resetHistory,
} from "../../redux/slices/transactionSlice";
import { getBalance, getServices, setSelectedService } from "../../redux/slices/serviceSlice";
import { formatCurrency } from "../../utils/validators";

const LIMIT = 5;

function TransactionPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { services, selectedService } = useSelector((state) => state.service);
  const { history, loadingPay, loadingHistory, hasMore } = useSelector((state) => state.transaction);
  const [offset, setOffset] = useState(0);
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
    dispatch(getServices());
    dispatch(getBalance());
    dispatch(resetHistory());
    dispatch(getTransactionHistory({ limit: LIMIT, offset: 0 }));
  }, [dispatch]);

  const onPay = () => {
    if (!selectedService?.service_code) {
      setModalState({
        open: true,
        type: "error",
        description: "Pilih layanan terlebih dahulu",
        amountText: "",
        statusText: "",
        primaryText: "Tutup",
        secondaryText: "",
      });
      return;
    }
    setModalState({
      open: true,
      type: "confirm",
      description: `Beli ${selectedService.service_name.toLowerCase()} senilai`,
      amountText: `${formatCurrency(selectedService.service_tariff || 0)} ?`,
      statusText: "",
      primaryText: "Ya, lanjutkan Bayar",
      secondaryText: "Batalkan",
    });
  };

  const onConfirmPay = async () => {
    const result = await dispatch(createTransaction(selectedService.service_code));
    if (createTransaction.fulfilled.match(result)) {
      dispatch(getBalance());
      dispatch(resetHistory());
      setOffset(0);
      dispatch(getTransactionHistory({ limit: LIMIT, offset: 0 }));
      setModalState({
        open: true,
        type: "success",
        description: `Pembayaran ${selectedService.service_name.toLowerCase()} sebesar`,
        amountText: formatCurrency(selectedService.service_tariff || 0),
        statusText: "berhasil",
        primaryText: "Kembali ke Beranda",
        secondaryText: "",
      });
    } else {
      setModalState({
        open: true,
        type: "error",
        description: `Pembayaran ${selectedService.service_name.toLowerCase()} sebesar`,
        amountText: formatCurrency(selectedService.service_tariff || 0),
        statusText: "gagal",
        primaryText: "Kembali ke Beranda",
        secondaryText: "",
      });
    }
  };

  const onLoadMore = async () => {
    const nextOffset = offset + LIMIT;
    const result = await dispatch(getTransactionHistory({ limit: LIMIT, offset: nextOffset }));
    if (getTransactionHistory.fulfilled.match(result)) {
      setOffset(nextOffset);
    }
  };

  return (
    <div>
      <Navbar />
      <main className="container">
        <Card>
          <h3>Pilih layanan pembayaran</h3>
          <div className="grid-services">
            {services.map((service) => (
              <Card
                key={service.service_code}
                className={`service-item ${selectedService?.service_code === service.service_code ? "active" : ""}`}
                onClick={() => dispatch(setSelectedService(service))}
              >
                <img src={service.service_icon} alt={service.service_name} />
                <p>{service.service_name}</p>
              </Card>
            ))}
          </div>
          <div className="selected-service">
            <p>Service: {selectedService?.service_name || "-"}</p>
            <p>Nominal: {formatCurrency(selectedService?.service_tariff || 0)}</p>
          </div>
          <Button className="btn-primary" disabled={!selectedService || loadingPay} onClick={onPay}>
            {loadingPay ? "Processing..." : "Bayar"}
          </Button>
        </Card>

        <Card>
          <h3>Semua Transaksi</h3>
          {history.length === 0 && !loadingHistory && <p>Belum ada transaksi.</p>}
          <div className="transaction-list">
            {history.map((item, idx) => (
              <div key={`${item.invoice_number || idx}-${idx}`} className="transaction-item">
                <div>
                  <p className={item.transaction_type === "TOPUP" ? "success" : "danger"}>
                    {item.transaction_type === "TOPUP" ? "+" : "-"} {formatCurrency(item.total_amount)}
                  </p>
                  <small>{item.created_on}</small>
                </div>
                <span>{item.description}</span>
              </div>
            ))}
          </div>
          {hasMore && (
            <Button className="btn-secondary" onClick={onLoadMore} disabled={loadingHistory}>
              {loadingHistory ? "Loading..." : "Load More"}
            </Button>
          )}
        </Card>
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

export default TransactionPage;
