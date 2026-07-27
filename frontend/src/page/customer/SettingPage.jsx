import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Switch,
  Select,
  Input,
  Button,
  Divider,
} from "antd";
import { useTheme } from "../../context/ThemeProvider.jsx";
import { useTranslation } from "../../component/LanguageProvider.jsx";

const { Title, Text } = Typography;

const SettingPage = () => {
  const { theme, toggleTheme } = useTheme();
  const { translation: t } = useTranslation();
  const isDark = theme === "dark";

  const [currency, setCurrency] = useState("USD ($)");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [bannerPrompts, setBannerPrompts] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 24,
        background: isDark ? "#050b16" : "#f4f7ff",
      }}
    >
      <div style={{ maxWidth: 1260, margin: "0 auto" }}>
        <Card
          style={{
            borderRadius: 24,
            background: isDark ? "#0b1220" : "#ffffff",
            border: isDark
              ? "1px solid rgba(255,255,255,0.08)"
              : "1px solid rgba(15,23,42,0.08)",
          }}
          bodyStyle={{ padding: 32 }}
        >
          <div style={{ marginBottom: 24 }}>
            <Title
              level={3}
              style={{ margin: 0, color: isDark ? "#f8fafc" : "#0f172a" }}
            >
              {t.settingsPage?.title || "Platform Configuration"}
            </Title>
            <Text
              type={isDark ? undefined : "secondary"}
              style={{ marginTop: 8, display: "block" }}
            >
              {t.settingsPage?.subtitle ||
                "Configure preferences, currency metrics, localized view styles, and multi-factor authentication"}
            </Text>
          </div>

          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <Card
                bodyStyle={{ padding: 24 }}
                style={{
                  borderRadius: 20,
                  background: isDark ? "#081022" : "#ffffff",
                  border: isDark
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "1px solid rgba(15,23,42,0.1)",
                }}
              >
                <div style={{ marginBottom: 20 }}>
                  <Text
                    strong
                    style={{
                      color: isDark ? "#f8fafc" : "#0f172a",
                      display: "block",
                      marginBottom: 8,
                    }}
                  >
                    {t.settingsPage?.localizationTitle ||
                      "Localization & Displays"}
                  </Text>
                  <Text type="secondary">
                    {t.settingsPage?.localizationSubtitle ||
                      "Enable modern low-light contrast scheme"}
                  </Text>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    marginBottom: 22,
                  }}
                >
                  <div>
                    <Text
                      style={{
                        display: "block",
                        color: isDark ? "#f8fafc" : "#0f172a",
                        marginBottom: 4,
                      }}
                    >
                      {t.settingsPage?.visualDarkMode || "Visual Dark Mode"}
                    </Text>
                    <Text type="secondary">
                      {t.settingsPage?.visualDarkModeDesc ||
                        "Enable modern low-light contrast scheme"}
                    </Text>
                  </div>
                  <Switch checked={isDark} onChange={toggleTheme} />
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                  }}
                >
                  <div>
                    <Text
                      style={{
                        display: "block",
                        color: isDark ? "#f8fafc" : "#0f172a",
                        marginBottom: 4,
                      }}
                    >
                      {t.settingsPage?.currencyTitle ||
                        "Local Currency Valuation"}
                    </Text>
                    <Text type="secondary">
                      {t.settingsPage?.currencyDesc ||
                        "Primary pricing calculation metric"}
                    </Text>
                  </div>
                  <Select
                    value={currency}
                    onChange={setCurrency}
                    style={{ minWidth: 160 }}
                    options={[
                      { value: "USD ($)", label: "USD ($)" },
                      { value: "ETB (Br)", label: "ETB (Br)" },
                      { value: "EUR (€)", label: "EUR (€)" },
                    ]}
                  />
                </div>
              </Card>

              <Card
                bodyStyle={{ padding: 24 }}
                style={{
                  marginTop: 24,
                  borderRadius: 20,
                  background: isDark ? "#081022" : "#ffffff",
                  border: isDark
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "1px solid rgba(15,23,42,0.1)",
                }}
              >
                <Text
                  strong
                  style={{
                    color: isDark ? "#f8fafc" : "#0f172a",
                    display: "block",
                    marginBottom: 12,
                  }}
                >
                  {t.settingsPage?.notificationsTitle ||
                    "Notification Channels"}
                </Text>
                <Text type="secondary">
                  {t.settingsPage?.notificationsDesc ||
                    "Escrow alerts and dispatch invoices"}
                </Text>

                <Divider style={{ margin: "20px 0" }} />

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    marginBottom: 18,
                  }}
                >
                  <div>
                    <Text
                      strong
                      style={{
                        color: isDark ? "#f8fafc" : "#0f172a",
                        display: "block",
                      }}
                    >
                      {t.settingsPage?.emailNotifications ||
                        "Email Notifications"}
                    </Text>
                    <Text type="secondary">
                      {t.settingsPage?.emailNotificationsDesc ||
                        "Escrow alerts and dispatch invoices"}
                    </Text>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onChange={setEmailNotifications}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    marginBottom: 18,
                  }}
                >
                  <div>
                    <Text
                      strong
                      style={{
                        color: isDark ? "#f8fafc" : "#0f172a",
                        display: "block",
                      }}
                    >
                      {t.settingsPage?.smsAlerts || "SMS Direct Alerts"}
                    </Text>
                    <Text type="secondary">
                      {t.settingsPage?.smsAlertsDesc ||
                        "Instant driver arrival checkouts"}
                    </Text>
                  </div>
                  <Switch checked={smsAlerts} onChange={setSmsAlerts} />
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                  }}
                >
                  <div>
                    <Text
                      strong
                      style={{
                        color: isDark ? "#f8fafc" : "#0f172a",
                        display: "block",
                      }}
                    >
                      {t.settingsPage?.bannerPrompts || "In-App Banner Prompts"}
                    </Text>
                    <Text type="secondary">
                      {t.settingsPage?.bannerPromptsDesc ||
                        "Real-time chat threads bubbles"}
                    </Text>
                  </div>
                  <Switch checked={bannerPrompts} onChange={setBannerPrompts} />
                </div>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card
                bodyStyle={{ padding: 24 }}
                style={{
                  borderRadius: 20,
                  background: isDark ? "#081022" : "#ffffff",
                  border: isDark
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "1px solid rgba(15,23,42,0.1)",
                  minHeight: 400,
                }}
              >
                <div style={{ marginBottom: 14 }}>
                  <Text
                    strong
                    style={{
                      color: isDark ? "#f8fafc" : "#0f172a",
                      display: "block",
                      marginBottom: 8,
                    }}
                  >
                    {t.settingsPage?.securityTitle || "Security & Cryptography"}
                  </Text>
                  <Text type="secondary">
                    {t.settingsPage?.securitySubtitle ||
                      "Secure transaction escrow approval pin"}
                  </Text>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 24,
                    gap: 16,
                  }}
                >
                  <div>
                    <Text
                      strong
                      style={{
                        color: isDark ? "#f8fafc" : "#0f172a",
                        display: "block",
                        marginBottom: 4,
                      }}
                    >
                      {t.settingsPage?.twoFactorTitle ||
                        "Two-Factor Authentication (2FA)"}
                    </Text>
                    <Text type="secondary">
                      {t.settingsPage?.twoFactorDesc ||
                        "Secure transaction escrow approval pin"}
                    </Text>
                  </div>
                  <Switch checked={twoFactorAuth} onChange={setTwoFactorAuth} />
                </div>

                <Divider style={{ margin: "20px 0" }} />

                <Text
                  strong
                  style={{
                    color: isDark ? "#f8fafc" : "#0f172a",
                    display: "block",
                    marginBottom: 14,
                  }}
                >
                  {t.settingsPage?.quickPasswordChange ||
                    "Quick Password Change"}
                </Text>
                <Input.Password
                  placeholder={
                    t.settingsPage?.currentPassword || "Current Password"
                  }
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  style={{
                    marginBottom: 16,
                    borderRadius: 12,
                    background: isDark ? "#0f172a" : "#f9fafb",
                    borderColor: isDark ? "rgba(255,255,255,0.12)" : undefined,
                  }}
                />
                <Input.Password
                  placeholder={
                    t.settingsPage?.newPassword || "New Safe Password"
                  }
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{
                    marginBottom: 24,
                    borderRadius: 12,
                    background: isDark ? "#0f172a" : "#f9fafb",
                    borderColor: isDark ? "rgba(255,255,255,0.12)" : undefined,
                  }}
                />
                <Button
                  type="primary"
                  block
                  style={{
                    borderRadius: 12,
                    background: "#111827",
                    borderColor: "#111827",
                  }}
                >
                  {t.settingsPage?.updateSecurityPassword ||
                    "Update Security Password"}
                </Button>
              </Card>

              <Button
                type="primary"
                block
                style={{
                  marginTop: 24,
                  borderRadius: 16,
                  height: 52,
                  background: "#fb7d05",
                  borderColor: "#fb7d05",
                  color: "#ffffff",
                  fontWeight: 700,
                }}
              >
                {t.settingsPage?.savePlatformSettings ||
                  "Save Platform Settings"}
              </Button>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default SettingPage;
