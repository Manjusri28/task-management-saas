import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import Navbar from "../components/Navbar";
import "./Profile.css";

const Profile = () => {
  const { user, login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] =
    useState(false);

  const [profileMessage, setProfileMessage] =
    useState("");

  const [passwordMessage, setPasswordMessage] =
    useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  // =========================
  // PROFILE FORM
  // =========================

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================
  // PASSWORD FORM
  // =========================

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================
  // UPDATE PROFILE
  // =========================

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    setProfileMessage("");
    setError("");

    if (!formData.name.trim()) {
      setError("Name is required.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Email is required.");
      return;
    }

    try {
      setSavingProfile(true);

      const response = await API.put(
        "/auth/profile",
        {
          name: formData.name.trim(),
          email: formData.email.trim(),
        }
      );

      const updatedUser = response.data.user;

      setFormData({
        name: updatedUser.name,
        email: updatedUser.email,
      });

      // Update user information in AuthContext
      if (login) {
        const token =
          localStorage.getItem("token");

        if (token) {
          login(token, updatedUser);
        }
      }

      setProfileMessage(
        "Profile updated successfully."
      );
    } catch (error) {
      console.error(
        "Update profile error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  // =========================
  // CHANGE PASSWORD
  // =========================

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    setPasswordMessage("");
    setError("");

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword
    ) {
      setError(
        "Please enter both passwords."
      );
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError(
        "New password must be at least 6 characters."
      );
      return;
    }

    try {
      setChangingPassword(true);

      const response = await API.put(
        "/auth/change-password",
        passwordData
      );

      setPasswordData({
        currentPassword: "",
        newPassword: "",
      });

      setPasswordMessage(
        response.data.message ||
          "Password changed successfully."
      );
    } catch (error) {
      console.error(
        "Change password error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to change password."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="profile-page">

        <div className="profile-container">

          {/* HEADER */}

          <section className="profile-header">

            <div className="profile-avatar">
              {user?.name
                ? user.name
                    .charAt(0)
                    .toUpperCase()
                : "U"}
            </div>

            <div>
              <h1>Profile & Account</h1>

              <p>
                Manage your account information
                and security.
              </p>
            </div>

          </section>

          {/* ERROR */}

          {error && (
            <div className="profile-error">
              {error}
            </div>
          )}

          {/* PROFILE INFORMATION */}

          <section className="profile-card">

            <div className="profile-card-header">
              <div>
                <h2>Personal Information</h2>

                <p>
                  Update your name and email
                  address.
                </p>
              </div>
            </div>

            <form
              className="profile-form"
              onSubmit={handleProfileSubmit}
            >

              <div className="profile-form-group">

                <label htmlFor="name">
                  Full Name
                </label>

                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={
                    handleProfileChange
                  }
                  placeholder="Enter your name"
                />

              </div>

              <div className="profile-form-group">

                <label htmlFor="email">
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={
                    handleProfileChange
                  }
                  placeholder="Enter your email"
                />

              </div>

              <div className="profile-account-info">

                <div>
                  <span>Account Role</span>
                  <strong>
                    {user?.role || "user"}
                  </strong>
                </div>

                <div>
                  <span>Account Status</span>
                  <strong className="status-active">
                    Active
                  </strong>
                </div>

              </div>

              {profileMessage && (
                <div className="profile-success">
                  {profileMessage}
                </div>
              )}

              <button
                type="submit"
                className="profile-primary-button"
                disabled={savingProfile}
              >
                {savingProfile
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </form>

          </section>

          {/* PASSWORD */}

          <section className="profile-card">

            <div className="profile-card-header">
              <div>
                <h2>Change Password</h2>

                <p>
                  Keep your account secure with
                  a strong password.
                </p>
              </div>
            </div>

            <form
              className="profile-form"
              onSubmit={handlePasswordSubmit}
            >

              <div className="profile-form-group">

                <label htmlFor="currentPassword">
                  Current Password
                </label>

                <input
                  id="currentPassword"
                  type="password"
                  name="currentPassword"
                  value={
                    passwordData.currentPassword
                  }
                  onChange={
                    handlePasswordChange
                  }
                  placeholder="Enter current password"
                />

              </div>

              <div className="profile-form-group">

                <label htmlFor="newPassword">
                  New Password
                </label>

                <input
                  id="newPassword"
                  type="password"
                  name="newPassword"
                  value={
                    passwordData.newPassword
                  }
                  onChange={
                    handlePasswordChange
                  }
                  placeholder="Enter new password"
                />

              </div>

              <p className="password-hint">
                Password must contain at least
                6 characters.
              </p>

              {passwordMessage && (
                <div className="profile-success">
                  {passwordMessage}
                </div>
              )}

              <button
                type="submit"
                className="profile-primary-button"
                disabled={changingPassword}
              >
                {changingPassword
                  ? "Changing..."
                  : "Change Password"}
              </button>

            </form>

          </section>

        </div>

      </main>
    </>
  );
};

export default Profile;