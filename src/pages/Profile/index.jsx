import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Button from "../../components/Button";
import Input from "../../components/Input";
import StatusModal from "../../components/StatusModal";
import { getProfile, updateProfile, uploadProfileImage } from "../../redux/slices/profileSlice";
import { logout } from "../../redux/slices/authSlice";
import useNotify from "../../hooks/useNotify";

const MailIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m4 7 8 6 8-6" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5 20c.6-3.4 2.9-5 7-5s6.4 1.6 7 5" />
  </svg>
);

const PencilIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="m4 20 4.2-1 9-9-3.2-3.2-9 9z" />
    <path d="m12.8 6.8 3.2 3.2" />
  </svg>
);

function ProfilePage() {
  const defaultProfilePhoto = "/assets/Profile Photo.PNG";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notify = useNotify();
  const { user, loading, updating, uploading } = useSelector((state) => state.profile);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ first_name: "", last_name: "" });
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
      });
    }
  }, [user]);

  const onSave = async () => {
    const result = await dispatch(updateProfile(form));
    if (updateProfile.fulfilled.match(result)) {
      notify("Profile updated");
      setIsEditing(false);
    } else {
      notify(result.payload || "Update failed");
    }
  };

  const onImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 100 * 1024) {
      notify("Image size must be less than 100kb");
      return;
    }
    const result = await dispatch(uploadProfileImage(file));
    if (uploadProfileImage.fulfilled.match(result)) {
      notify("Image uploaded");
    } else {
      notify(result.payload || "Upload failed");
    }
  };

  const onLogout = () => {
    setShowLogoutModal(false);
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div>
      <Navbar />
      <main className="container">
        <section className="profile-page profile-account-page">
          <label className="profile-avatar-wrap">
            <img
              className="avatar-large"
              src={user?.profile_image || defaultProfilePhoto}
              alt="avatar"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = defaultProfilePhoto;
              }}
            />
            <span className="profile-avatar-edit-icon" title={uploading ? "Uploading..." : "Ganti Foto"}>
              <PencilIcon />
            </span>
            <input type="file" accept="image/*" onChange={onImageChange} hidden />
          </label>
          <h1 className="profile-name-heading">
            {user?.first_name} {user?.last_name}
          </h1>

          {loading ? (
            <p>Loading profile...</p>
          ) : (
            <>
              <Input label="Email" value={user?.email || ""} disabled readOnly placeholder="email" leftIcon={<MailIcon />} />
              <Input
                label="Nama Depan"
                value={form.first_name}
                disabled={!isEditing}
                onChange={(e) => setForm((prev) => ({ ...prev, first_name: e.target.value }))}
                leftIcon={<UserIcon />}
              />
              <Input
                label="Nama Belakang"
                value={form.last_name}
                disabled={!isEditing}
                onChange={(e) => setForm((prev) => ({ ...prev, last_name: e.target.value }))}
                leftIcon={<UserIcon />}
              />
              <div className="row profile-action-row">
                {!isEditing ? (
                  <>
                    <Button className="btn-primary" onClick={() => setIsEditing(true)}>
                      Edit Profil
                    </Button>
                    <Button className="btn-outline-danger" onClick={() => setShowLogoutModal(true)}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button className="btn-primary" onClick={onSave} disabled={updating}>
                      {updating ? "Saving..." : "Simpan"}
                    </Button>
                    <Button
                      className="btn-secondary"
                      onClick={() => {
                        setIsEditing(false);
                        setForm({
                          first_name: user?.first_name || "",
                          last_name: user?.last_name || "",
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </>
          )}
        </section>
      </main>
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
    </div>
  );
}

export default ProfilePage;
