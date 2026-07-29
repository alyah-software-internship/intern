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
  Space,
} from "antd";
import { useTranslation } from "../../component/LanguageProvider.jsx";
import { useTheme } from "../../context/ThemeProvider.jsx";

const { Title, Text } = Typography;

const Settings = () => {
  const { translation: t, lang, setLanguage, languages } = useTranslation();
  const { theme, toggleTheme, setThemeMode } = useTheme();

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [bannerPrompts, setBannerPrompts] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [currency, setCurrency] = useState("USD");

  const handleLanguageChange = (value) => {
    setLanguage(value);
  };

  const handleThemeChange = (checked) => {
    setThemeMode(checked ? "dark" : "light");
  };

  const handleSave = () => {
    window.alert(t.settingsPage?.settingsSaved || "Settings saved.");
  };

  const currencyOptions = [
    { value: "USD", label: t.settingsPage?.currencyUSD || "USD" },
    { value: "ETB", label: t.settingsPage?.currencyETB || "ETB" },
    { value: "EUR", label: t.settingsPage?.currencyEUR || "EUR" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 32,
        background: theme === "dark" ? "#050b18" : "#f4f7fb",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Card
          style={{ borderRadius: 24, marginBottom: 24 }}
          bodyStyle={{ padding: 32 }}
        >
          <Title level={3} style={{ marginBottom: 12 }}>
            {t.settingsPage?.title || "Platform Configuration"}
          </Title>
          <Text type="secondary">
            {t.settingsPage?.subtitle ||
              "Configure preferences, currency metrics, localized view styles, and multi-factor authentication"}
          </Text>
        </Card>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Card
              title={
                t.settingsPage?.localizationTitle || "Localization & Displays"
              }
              style={{ borderRadius: 24 }}
              bodyStyle={{ padding: 24 }}
            >
              <Space direction="vertical" size={24} style={{ width: "100%" }}>
                <div>
                  <Text strong>{t.language || "Language"}</Text>
                  <Select
                    value={lang}
                    onChange={handleLanguageChange}
                    style={{ width: "100%", marginTop: 12 }}
                    options={Object.values(languages).map((item) => ({
                      value: item.code,
                      label: item.nameAm || item.name,
                    }))}
                  />
                </div>
                <Text type="secondary">
                  {t.settingsPage?.localizationSubtitle ||
                    "Enable modern low-light contrast scheme"}
                </Text>

                <div>
                  <Text strong>
                    {t.settingsPage?.visualDarkMode || "Visual Dark Mode"}
                  </Text>
                  <Text
                    type="secondary"
                    style={{ display: "block", marginTop: 6 }}
                  >
                    {t.settingsPage?.visualDarkModeDesc ||
                      "Enable modern low-light contrast scheme"}
                  </Text>
                  <Switch
                    checked={theme === "dark"}
                    onChange={handleThemeChange}
                    style={{ marginTop: 16 }}
                  />
                </div>

                <div>
                  <Text strong>
                    {t.settingsPage?.currencyTitle ||
                      "Local Currency Valuation"}
                  </Text>
                  <Text
                    type="secondary"
                    style={{ display: "block", marginTop: 6 }}
                  >
                    {t.settingsPage?.currencyDesc ||
                      "Primary pricing calculation metric"}
                  </Text>
                  <Select
                    value={currency}
                    onChange={setCurrency}
                    style={{ width: "100%", marginTop: 12 }}
                    options={currencyOptions}
                  />
                </div>
              </Space>
            </Card>

            <Card
              title={
                t.settingsPage?.notificationsTitle || "Notification Channels"
              }
              style={{ borderRadius: 24 }}
              bodyStyle={{ padding: 24 }}
            >
              <Text type="secondary">
                {t.settingsPage?.notificationsDesc ||
                  "Escrow alerts and dispatch invoices"}
              </Text>
              <Space direction="vertical" size={24} style={{ width: "100%" }}>
                <div>
                  <Text strong>
                    {t.settingsPage?.emailNotifications ||
                      "Email Notifications"}
                  </Text>
                  <Text
                    type="secondary"
                    style={{ display: "block", marginTop: 6 }}
                  >
                    {t.settingsPage?.emailNotificationsDesc ||
                      "Escrow alerts and dispatch invoices"}
                  </Text>
                  <Switch
                    checked={emailNotifications}
                    onChange={setEmailNotifications}
                    style={{ marginTop: 16 }}
                  />
                </div>

                <div>
                  <Text strong>
                    {t.settingsPage?.smsAlerts || "SMS Direct Alerts"}
                  </Text>
                  <Text
                    type="secondary"
                    style={{ display: "block", marginTop: 6 }}
                  >
                    {t.settingsPage?.smsAlertsDesc ||
                      "Instant driver arrival checkouts"}
                  </Text>
                  <Switch
                    checked={smsAlerts}
                    onChange={setSmsAlerts}
                    style={{ marginTop: 16 }}
                  />
                </div>

                <div>
                  <Text strong>
                    {t.settingsPage?.bannerPrompts || "In-App Banner Prompts"}
                  </Text>
                  <Text
                    type="secondary"
                    style={{ display: "block", marginTop: 6 }}
                  >
                    {t.settingsPage?.bannerPromptsDesc ||
                      "Real-time chat threads bubbles"}
                  </Text>
                  <Switch
                    checked={bannerPrompts}
                    onChange={setBannerPrompts}
                    style={{ marginTop: 16 }}
                  />
                </div>
              </Space>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card
              title={t.settingsPage?.securityTitle || "Security & Cryptography"}
              style={{ borderRadius: 24 }}
              bodyStyle={{ padding: 24 }}
            >
              <Text type="secondary">
                {t.settingsPage?.securitySubtitle ||
                  "Secure transaction escrow approval pin"}
              </Text>
              <Space direction="vertical" size={24} style={{ width: "100%" }}>
                <div>
                  <Text strong>
                    {t.settingsPage?.twoFactorTitle ||
                      "Two-Factor Authentication (2FA)"}
                  </Text>
                  <Text
                    type="secondary"
                    style={{ display: "block", marginTop: 6 }}
                  >
                    {t.settingsPage?.twoFactorDesc ||
                      "Secure transaction escrow approval pin"}
                  </Text>
                  <Switch
                    checked={twoFactor}
                    onChange={setTwoFactor}
                    style={{ marginTop: 16 }}
                  />
                </div>

                <Divider />

                <div>
                  <Text strong>
                    {t.settingsPage?.quickPasswordChange ||
                      "Quick Password Change"}
                  </Text>
                  <Text
                    type="secondary"
                    style={{ display: "block", marginTop: 6 }}
                  >
                    {t.settingsPage?.quickPasswordChangeDesc ||
                      "Secure transaction escrow approval pin"}
                  </Text>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder={
                      t.settingsPage?.currentPassword || "Current Password"
                    }
                    style={{ marginTop: 16 }}
                  />
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder={
                      t.settingsPage?.newPassword || "New Safe Password"
                    }
                    style={{ marginTop: 16 }}
                  />
                  <Button
                    type="primary"
                    block
                    style={{ marginTop: 24, borderRadius: 14 }}
                    onClick={handleSave}
                  >
                    {t.settingsPage?.updateSecurityPassword ||
                      "Update Security Password"}
                  </Button>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>

        <Card
          style={{ borderRadius: 24, marginTop: 24 }}
          bodyStyle={{ padding: 24 }}
        >
          <Button
            type="primary"
            size="large"
            onClick={handleSave}
            style={{ borderRadius: 14 }}
          >
            {t.settingsPage?.savePlatformSettings || "Save Platform Settings"}
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
