import { useContext, useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Row,
  Col,
  Card,
  Typography,
  Input,
  Button,
  Space,
  Avatar,
  Tooltip,
  Spin,
  message,
} from "antd";
import { UserOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useTranslation } from "../../component/LanguageProvider.jsx";
import { useTheme } from "../../context/ThemeProvider.jsx";
import { AppContext } from "../../context/AppContext.jsx";

const { Title, Text } = Typography;
const authConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
});

const ProfilePage = () => {
  const { translation: t } = useTranslation();
  const { theme } = useTheme();
  const { backendUrl } = useContext(AppContext);
  const isDark = theme === "dark";

  const initialProfile = {
    fullName: "Marcus Sterling",
    businessName: "Sterling Constructions Ltd",
    email: "marcus.sterling@i-share.et",
    phone: "0911554433",
    address: "123 iShare Plaza, Addis Ababa, Ethiopia",
    city: "Addis Ababa",
    country: "Ethiopia",
    bio: "General construction project coordinator and asset manager in East Africa. Specialized in heavy machinery logistics and high-value fleet rentals.",
    image: "",
    verificationStatus: "approved",
    identityVerified: true,
    paymentMethodsVerified: true,
    rating: 4.9,
    totalBookings: 28,
  };

  const uploadRef = useRef(null);
  const fullNameRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(initialProfile);
  const [backupProfile, setBackupProfile] = useState(initialProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const loadProfile = useCallback(async () => {
    try {
      const [profileResponse, statsResponse] = await Promise.all([
        axios.get(`${backendUrl}/user/profile`, authConfig()),
        axios.get(`${backendUrl}/user/stats`, authConfig()),
      ]);
      const user = profileResponse.data.user;
      const stats = statsResponse.data.stats || {};
      const nextProfile = {
        fullName: [user.first_name, user.middle_name, user.last_name]
          .filter(Boolean)
          .join(" "),
        businessName: user.vendor_profile?.business_name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        country: user.country || "",
        bio: user.bio || "",
        image: user.avatar_url || "",
        verificationStatus:
          user.vendor_profile?.verification_status ||
          (user.email_verified_at ? "verified" : "pending"),
        identityVerified: Boolean(
          user.vendor_profile?.identity_verified || user.email_verified_at,
        ),
        paymentMethodsVerified: Boolean(
          user.vendor_profile?.payment_methods_verified,
        ),
        rating: stats.rating || 0,
        totalBookings: stats.total_bookings || user.bookings?.length || 0,
      };
      setProfile(nextProfile);
      setBackupProfile(nextProfile);
    } catch (error) {
      messageApi.error(
        error.response?.data?.message || "Unable to load your profile.",
      );
    } finally {
      setLoading(false);
    }
  }, [backendUrl, messageApi]);

  useEffect(() => {
    const fetchProfile = async () => {
      await loadProfile();
    };
    fetchProfile();
  }, [loadProfile]);

  useEffect(() => {
    return () => {
      if (profile.image && profile.image.startsWith("blob:")) {
        URL.revokeObjectURL(profile.image);
      }
    };
  }, [profile.image]);

  const handleFieldChange = (field) => (event) => {
    setProfile((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleAvatarClick = () => {
    if (!isEditing) return;
    uploadRef.current?.click();
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setProfile((prev) => ({ ...prev, image: previewUrl, avatarFile: file }));
    event.target.value = "";
  };

  const handleStartEditing = () => {
    setBackupProfile(profile);
    setIsEditing(true);
  };

  useEffect(() => {
    if (isEditing) {
      fullNameRef.current?.focus();
    }
  }, [isEditing]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      const nameParts = profile.fullName.trim().split(/\s+/);
      const fields = {
        first_name: nameParts[0] || "",
        middle_name:
          nameParts.length > 2 ? nameParts.slice(1, -1).join(" ") : "",
        last_name: nameParts.length > 1 ? nameParts[nameParts.length - 1] : "",
        phone: profile.phone,
        bio: profile.bio,
        address: profile.address,
        city: profile.city,
      };
      Object.entries(fields).forEach(([key, value]) =>
        formData.append(key, value || ""),
      );
      if (profile.avatarFile) formData.append("avatar", profile.avatarFile);
      formData.append("_method", "PUT");
      const response = await axios.post(
        `${backendUrl}/user/profile`,
        formData,
        {
          ...authConfig(),
          headers: {
            ...authConfig().headers,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      const user = response.data.user;
      const updatedProfile = {
        ...profile,
        fullName: [user.first_name, user.middle_name, user.last_name]
          .filter(Boolean)
          .join(" "),
        image: user.avatar_url || profile.image,
        avatarFile: null,
      };
      setProfile(updatedProfile);
      setBackupProfile(updatedProfile);
      setIsEditing(false);
      messageApi.success(
        response.data.message || "Profile updated successfully.",
      );
    } catch (error) {
      const errors = error.response?.data?.errors;
      messageApi.error(
        errors
          ? Object.values(errors).flat()[0]
          : error.response?.data?.message || "Unable to save your profile.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setProfile(backupProfile);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div style={{ minHeight: "70vh", display: "grid", placeItems: "center" }}>
        {contextHolder}
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "48px 24px 64px",
        background: isDark
          ? "linear-gradient(180deg, #050b16 0%, #091126 100%)"
          : "#eef4ff",
      }}
    >
      {contextHolder}
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 24,
            marginBottom: 32,
          }}
        >
          <div style={{ maxWidth: 720 }}>
            <Text
              style={{
                display: "block",
                fontSize: 12,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                marginBottom: 10,
                color: "#22c55e",
                fontWeight: 700,
              }}
            >
              {t.nav?.profile || "Profile"}
            </Text>
            <Title
              style={{
                margin: 0,
                color: isDark ? "#f8fafc" : "#0f172a",
                lineHeight: 1.1,
              }}
            >
              {t.profile?.title || "Verified Profile"}
            </Title>
            <Text
              style={{
                color: isDark ? "#cbd5e1" : "#475569",
                fontSize: 16,
                lineHeight: 1.8,
              }}
            >
              {t.profile?.subtitle ||
                "Manage credentials, company validation, and rental identity details."}
            </Text>
          </div>
          <div style={{ alignSelf: "center" }}>
            <Button
              type={isEditing ? "default" : "primary"}
              size="large"
              onClick={isEditing ? handleCancel : handleStartEditing}
              style={{ minWidth: 150, borderRadius: 999 }}
            >
              {isEditing
                ? t.profile?.cancelButton || "Cancel"
                : t.profile?.editButton || "Edit Profile"}
            </Button>
          </div>
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={8}>
            <Card
              style={{
                borderRadius: 28,
                background: isDark
                  ? "linear-gradient(180deg, #0f172a 0%, #111827 100%)"
                  : "#ffffff",
                border: isDark
                  ? "1px solid rgba(255,255,255,0.08)"
                  : "1px solid rgba(15,23,42,0.07)",
                boxShadow: isDark
                  ? "0 30px 80px rgba(0,0,0,0.18)"
                  : "0 24px 60px rgba(15,23,42,0.08)",
              }}
            >
              <Space orientation="vertical" size={26} style={{ width: "100%" }}>
                <div style={{ textAlign: "center" }}>
                  <input
                    type="file"
                    ref={uploadRef}
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleAvatarUpload}
                  />
                  <Tooltip
                    title={
                      isEditing
                        ? "Click to upload a new profile picture"
                        : "Enable edit mode to change your picture"
                    }
                    color={isDark ? undefined : "#0f172a"}
                    overlayInnerStyle={{ color: "#ffffff" }}
                  >
                    <Avatar
                      size={120}
                      src={profile.image || undefined}
                      icon={!profile.image && <UserOutlined />}
                      style={{
                        background: profile.image ? undefined : "#2563eb",
                        cursor: isEditing ? "pointer" : "default",
                      }}
                      onClick={handleAvatarClick}
                    />
                  </Tooltip>
                  <Title
                    level={4}
                    style={{
                      marginTop: 16,
                      color: isDark ? "#f8fafc" : "#0f172a",
                    }}
                  >
                    {profile.fullName}
                  </Title>
                  <Text type="secondary">
                    {profile.businessName ||
                      t.profile?.memberStatus ||
                      "Premium Member"}
                  </Text>
                </div>

                <div>
                  <Text
                    style={{
                      display: "block",
                      marginBottom: 12,
                      color: isDark ? "#cbd5e1" : "#475569",
                    }}
                  >
                    {profile.bio}
                  </Text>
                </div>

                <div
                  style={{
                    padding: 20,
                    borderRadius: 22,
                    background: isDark ? "rgba(15,23,42,0.9)" : "#eff6ff",
                  }}
                >
                  <Space align="center" size={14}>
                    <CheckCircleOutlined
                      style={{ color: "#16a34a", fontSize: 22 }}
                    />
                    <div>
                      <Text
                        strong
                        style={{ color: isDark ? "#f8fafc" : "#0f172a" }}
                      >
                        {t.profile?.verifiedTitle || "Identity Confirmed"}
                      </Text>
                      <br />
                      <Text type="secondary">
                        {profile.verificationStatus
                          ? `Verification status: ${profile.verificationStatus}`
                          : t.profile?.verifiedSubtitle ||
                            "Insurance pre-bond active until 2027."}
                      </Text>
                    </div>
                  </Space>
                </div>

                <div
                  style={{
                    display: "grid",
                    gap: 12,
                    color: isDark ? "#cbd5e1" : "#475569",
                  }}
                >
                  <Text>Rating: {profile.rating} / 5</Text>
                  <Text>Bookings: {profile.totalBookings}</Text>
                  <Text>
                    Identity verified: {profile.identityVerified ? "Yes" : "No"}
                  </Text>
                  <Text>
                    Payment methods verified:{" "}
                    {profile.paymentMethodsVerified ? "Yes" : "No"}
                  </Text>
                </div>

                <Button
                  type="primary"
                  size="large"
                  block
                  onClick={isEditing ? handleSave : handleStartEditing}
                  loading={isEditing && saving}
                  style={{ borderRadius: 999 }}
                >
                  {isEditing
                    ? t.profile?.updateButton || "Update Profile"
                    : t.profile?.editButton || "Edit Profile"}
                </Button>
              </Space>
            </Card>
          </Col>

          <Col xs={24} lg={16}>
            <Card
              style={{
                borderRadius: 28,
                background: isDark
                  ? "linear-gradient(180deg, rgba(15,23,42,0.92) 0%, #0f172a 100%)"
                  : "#ffffff",
                border: isDark
                  ? "1px solid rgba(255,255,255,0.08)"
                  : "1px solid rgba(15,23,42,0.07)",
                boxShadow: isDark
                  ? "0 30px 80px rgba(0,0,0,0.18)"
                  : "0 24px 60px rgba(15,23,42,0.08)",
              }}
            >
              <Space orientation="vertical" size={28} style={{ width: "100%" }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: 24,
                  }}
                >
                  <div>
                    <Text strong>
                      {t.profile?.fullName || "Verified Full Name"}
                    </Text>
                    <Input
                      ref={fullNameRef}
                      value={profile.fullName}
                      onChange={handleFieldChange("fullName")}
                      disabled={!isEditing}
                      placeholder={t.profile?.fullName || "Verified Full Name"}
                      style={{
                        marginTop: 8,
                        borderRadius: 16,
                        background: isEditing
                          ? undefined
                          : isDark
                            ? "#0f172a"
                            : "#f5f7ff",
                      }}
                    />
                  </div>

                  <div>
                    <Text strong>{t.profile?.company || "Business Name"}</Text>
                    <Input
                      value={profile.businessName}
                      onChange={handleFieldChange("businessName")}
                      disabled={!isEditing}
                      placeholder={t.profile?.company || "Business Name"}
                      style={{
                        marginTop: 8,
                        borderRadius: 16,
                        background: isEditing
                          ? undefined
                          : isDark
                            ? "#0f172a"
                            : "#f5f7ff",
                      }}
                    />
                  </div>

                  <div>
                    <Text strong>
                      {t.profile?.imageLabel || "Profile Image URL"}
                    </Text>
                    <Input
                      value={profile.image}
                      onChange={handleFieldChange("image")}
                      disabled={!isEditing}
                      placeholder={
                        t.profile?.imagePlaceholder ||
                        "https://example.com/avatar.png"
                      }
                      style={{
                        marginTop: 8,
                        borderRadius: 16,
                        background: isEditing
                          ? undefined
                          : isDark
                            ? "#0f172a"
                            : "#f5f7ff",
                      }}
                    />
                  </div>

                  <div>
                    <Text strong>
                      {t.profile?.email || "Secure Registered Email"}
                    </Text>
                    <Input
                      value={profile.email}
                      onChange={handleFieldChange("email")}
                      disabled={!isEditing}
                      placeholder={
                        t.profile?.email || "Secure Registered Email"
                      }
                      style={{
                        marginTop: 8,
                        borderRadius: 16,
                        background: isEditing
                          ? undefined
                          : isDark
                            ? "#0f172a"
                            : "#f5f7ff",
                      }}
                    />
                  </div>

                  <div>
                    <Text strong>
                      {t.profile?.phone || "Verified Contact Phone"}
                    </Text>
                    <Input
                      value={profile.phone}
                      onChange={handleFieldChange("phone")}
                      disabled={!isEditing}
                      placeholder={t.profile?.phone || "Verified Contact Phone"}
                      style={{
                        marginTop: 8,
                        borderRadius: 16,
                        background: isEditing
                          ? undefined
                          : isDark
                            ? "#0f172a"
                            : "#f5f7ff",
                      }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: 24,
                  }}
                >
                  <div>
                    <Text strong>
                      {t.profile?.headquarters || "Business Address"}
                    </Text>
                    <Input
                      value={profile.address}
                      onChange={handleFieldChange("address")}
                      disabled={!isEditing}
                      placeholder={
                        t.profile?.headquarters || "Business Address"
                      }
                      style={{
                        marginTop: 8,
                        borderRadius: 16,
                        background: isEditing
                          ? undefined
                          : isDark
                            ? "#0f172a"
                            : "#f5f7ff",
                      }}
                    />
                  </div>

                  <div>
                    <Text strong>{t.profile?.city || "City"}</Text>
                    <Input
                      value={profile.city}
                      onChange={handleFieldChange("city")}
                      disabled={!isEditing}
                      placeholder={t.profile?.city || "City"}
                      style={{
                        marginTop: 8,
                        borderRadius: 16,
                        background: isEditing
                          ? undefined
                          : isDark
                            ? "#0f172a"
                            : "#f5f7ff",
                      }}
                    />
                  </div>
                </div>

                <div>
                  <Text strong>{t.profile?.country || "Country"}</Text>
                  <Input
                    value={profile.country}
                    onChange={handleFieldChange("country")}
                    disabled={!isEditing}
                    placeholder={t.profile?.country || "Country"}
                    style={{
                      marginTop: 8,
                      borderRadius: 16,
                      background: isEditing
                        ? undefined
                        : isDark
                          ? "#0f172a"
                          : "#f5f7ff",
                    }}
                  />
                </div>

                <div>
                  <Text strong>
                    {t.profile?.bioLabel || "Professional Bio"}
                  </Text>
                  <Input.TextArea
                    value={profile.bio}
                    onChange={handleFieldChange("bio")}
                    disabled={!isEditing}
                    rows={5}
                    placeholder={
                      t.profile?.bioLabel || "Enter your professional bio"
                    }
                    style={{
                      marginTop: 8,
                      borderRadius: 16,
                      background: isEditing
                        ? undefined
                        : isDark
                          ? "#0f172a"
                          : "#f5f7ff",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  {isEditing ? (
                    <>
                      <Button onClick={handleCancel} size="large">
                        {t.profile?.cancelButton || "Cancel"}
                      </Button>
                      <Button
                        type="primary"
                        size="large"
                        onClick={handleSave}
                        loading={saving}
                      >
                        {t.profile?.saveButton || "Save Profile Changes"}
                      </Button>
                    </>
                  ) : (
                    <Text type="secondary">
                      {t.profile?.hint ||
                        "Toggle Edit Profile to make changes to your details."}
                    </Text>
                  )}
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ProfilePage;
