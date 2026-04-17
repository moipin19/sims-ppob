import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Button from "../../components/Button";
import Card from "../../components/Card";
import Input from "../../components/Input";
import StatusModal from "../../components/StatusModal";
import { getProfile } from "../../redux/slices/profileSlice";
import { getBalance } from "../../redux/slices/serviceSlice";
import { topupBalance } from "../../redux/slices/transactionSlice";
import { formatCurrency } from "../../utils/validators";

function TopupPage() {
  const defaultProfilePhoto = "/assets/Profile Photo.PNG";
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
            <p>Saldo anda</p>
            <h2>{loadingBalance ? "Loading..." : formatCurrency(balance?.balance)}</h2>
          </Card>
        </section>

        <Card>
          <h3>Silahkan masukkan nominal Top Up</h3>
          <form onSubmit={onSubmit}>
            <Input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="masukkan nominal top up"
              min={10000}
              max={1000000}
            />
            <Button type="submit" disabled={!isValid || loadingTopup} className="btn-primary">
              {loadingTopup ? "Loading..." : "Top Up"}
            </Button>
          </form>
          <p className="helper-text">Minimal Rp10.000 dan maksimal Rp1.000.000</p>
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
