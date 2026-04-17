import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Card from "../../components/Card";
import { getProfile } from "../../redux/slices/profileSlice";
import {
  getBalance,
  getBanners,
  getServices,
  setSelectedService,
} from "../../redux/slices/serviceSlice";
import { formatCurrency } from "../../utils/validators";

function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.profile);
  const { balance, services, banners, loadingBalance, loadingServices, loadingBanners } = useSelector(
    (state) => state.service
  );

  useEffect(() => {
    dispatch(getProfile());
    dispatch(getBalance());
    dispatch(getServices());
    dispatch(getBanners());
  }, [dispatch]);

  const onServiceClick = (service) => {
    dispatch(setSelectedService(service));
    navigate("/transaction");
  };

  return (
    <div>
      <Navbar />
      <main className="container">
        <section className="hero">
          <Card className="profile-summary">
            <img src={user?.profile_image || "/assets/Profile Photo.PNG"} alt="profile" />
            <p>Selamat datang,</p>
            <h2>
              {user?.first_name} {user?.last_name}
            </h2>
          </Card>
          <Card className="balance-card">
            <p>Saldo anda</p>
            <h3>{loadingBalance ? "Loading..." : formatCurrency(balance?.balance)}</h3>
          </Card>
        </section>

        <section>
          <h3>Layanan</h3>
          {loadingServices ? (
            <p>Loading services...</p>
          ) : (
            <div className="grid-services">
              {services.map((service) => (
                <Card key={service.service_code} className="service-item" onClick={() => onServiceClick(service)}>
                  <img src={service.service_icon} alt={service.service_name} />
                  <p>{service.service_name}</p>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section>
          <h3>Temukan promo menarik</h3>
          {loadingBanners ? (
            <p>Loading banner...</p>
          ) : (
            <div className="banner-row">
              {banners.map((banner, idx) => (
                <img key={`${banner.banner_name}-${idx}`} src={banner.banner_image} alt={banner.banner_name} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default HomePage;
