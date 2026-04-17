import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../../components/Navbar";
import Card from "../../components/Card";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { getProfile, updateProfile, uploadProfileImage } from "../../redux/slices/profileSlice";
import useNotify from "../../hooks/useNotify";

function ProfilePage() {
  const dispatch = useDispatch();
  const notify = useNotify();
  const { user, loading, updating, uploading } = useSelector((state) => state.profile);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ first_name: "", last_name: "" });

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

  return (
    <div>
      <Navbar />
      <main className="container">
        <Card className="profile-page">
          <img className="avatar-large" src={user?.profile_image || "/assets/Profile Photo.PNG"} alt="avatar" />
          <label className="upload-label">
            {uploading ? "Uploading..." : "Ganti Foto"}
            <input type="file" accept="image/*" onChange={onImageChange} hidden />
          </label>

          {loading ? (
            <p>Loading profile...</p>
          ) : (
            <>
              <Input
                label="Email"
                value={user?.email || ""}
                disabled
                readOnly
                placeholder="email"
              />
              <Input
                label="Nama Depan"
                value={form.first_name}
                disabled={!isEditing}
                onChange={(e) => setForm((prev) => ({ ...prev, first_name: e.target.value }))}
              />
              <Input
                label="Nama Belakang"
                value={form.last_name}
                disabled={!isEditing}
                onChange={(e) => setForm((prev) => ({ ...prev, last_name: e.target.value }))}
              />
              <div className="row">
                {!isEditing ? (
                  <Button className="btn-primary" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
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
        </Card>
      </main>
    </div>
  );
}

export default ProfilePage;
