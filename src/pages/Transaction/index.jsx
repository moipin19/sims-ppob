import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../../components/Navbar";
import PageHeroHeader from "../../components/PageHeroHeader";
import { getProfile } from "../../redux/slices/profileSlice";
import { getTransactionHistory, resetHistory } from "../../redux/slices/transactionSlice";
import { getBalance } from "../../redux/slices/serviceSlice";
import { formatCurrency } from "../../utils/validators";

const LIMIT = 5;

const formatTransactionDate = (value) => {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  const datePart = parsed.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timePart = parsed.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${datePart} ${timePart} WIB`;
};

function TransactionPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.profile);
  const { balance, loadingBalance } = useSelector((state) => state.service);
  const { history, loadingHistory, hasMore } = useSelector((state) => state.transaction);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    dispatch(getProfile());
    dispatch(getBalance());
    dispatch(resetHistory());
    dispatch(getTransactionHistory({ limit: LIMIT, offset: 0 }));
  }, [dispatch]);

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
        <PageHeroHeader user={user} balance={balance} loadingBalance={loadingBalance} />

        <section className="transaction-section">
          <h2 className="section-title">Semua Transaksi</h2>
          {history.length === 0 && !loadingHistory && <p>Belum ada transaksi.</p>}
          <div className="transaction-history-list">
            {history.map((item, idx) => {
              const isTopupTransaction = item.transaction_type === "TOPUP";
              return (
                <div key={`${item.invoice_number || idx}-${idx}`} className="transaction-item">
                  <div>
                    <p className={isTopupTransaction ? "success" : "danger"}>
                      {isTopupTransaction ? "+" : "-"} {formatCurrency(item.total_amount)}
                    </p>
                    <small>{formatTransactionDate(item.created_on)}</small>
                  </div>
                  <span>{item.description}</span>
                </div>
              );
            })}
          </div>
          {hasMore && (
            <button type="button" className="show-more-button" onClick={onLoadMore} disabled={loadingHistory}>
              {loadingHistory ? "Loading..." : "Show more"}
            </button>
          )}
        </section>
      </main>
    </div>
  );
}

export default TransactionPage;
