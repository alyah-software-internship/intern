import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, Col, Row, Typography, Button as AntdButton, Space } from "antd";
import { useTranslation } from "../LanguageProvider.jsx";
import { useTheme } from "../../context/ThemeProvider.jsx";
import Bookings from "./Bookings.jsx";
import Wishlist from "./Wishlist.jsx";
import AlertsPanel from "./AlertsPanel.jsx";
import RecentlyViewed from "./RecentlyViewed.jsx";

const { Title, Text } = Typography;

const DashboardShortcut = () => {
  const navigate = useNavigate();
  const { translation: t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const updateMobile = () => setIsMobile(window.innerWidth < 768);
    updateMobile();
    window.addEventListener("resize", updateMobile);
    return () => window.removeEventListener("resize", updateMobile);
  }, []);

  return (
    <Card
      style={{
        borderRadius: 24,
        padding: "28px 26px",
        background: isDark ? "#0b1220" : "#ffffff",
        border: isDark
          ? "1px solid rgba(255,255,255,0.08)"
          : "1px solid rgba(15,23,42,0.08)",
        boxShadow: isDark
          ? "0 24px 80px rgba(0,0,0,0.12)"
          : "0 24px 60px rgba(15,23,42,0.08)",
      }}
    >
      <Row align="middle" justify="space-between" gutter={[24, 24]}>
        <Col xs={24} lg={14}>
          <Text
            strong
            style={{
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              fontSize: 12,
              color: "#22c55e",
              display: "block",
            }}
          >
            {t.home?.dashboardShortcutsCaption || "Dashboard Shortcuts"}
          </Text>

          <Title
            level={2}
            style={{
              margin: "12px 0 8px",
              color: isDark ? "#f8fafc" : "#0f172a",
              fontWeight: 900,
            }}
          >
            {t.home?.dashboardWelcome || "Welcome back"}{" "}
            <Text style={{ color: "#2563eb" }}>
              {t.home?.dashboardWelcomeName || "Marshal!"}
            </Text>
          </Title>

          <Text
            style={{
              color: isDark ? "#94a3b8" : "#475569",
              fontSize: 16,
              lineHeight: 1.8,
              maxWidth: 680,
            }}
          >
            {t.home?.dashboardShortcutsSubtitle ||
              "Access your active contracts, security escrow holding, and recommended machinery."}
          </Text>
        </Col>

        <Col xs={24} lg={10}>
          <Space
            wrap
            style={{
              justifyContent: isMobile ? "flex-start" : "flex-end",
              display: "flex",
            }}
            size={12}
          >
            <AntdButton
              type="primary"
              block={isMobile}
              style={{
                minWidth: isMobile ? "100%" : 160,
                borderRadius: 999,
                padding: "12px 20px",
                fontWeight: 700,
                background: "linear-gradient(90deg, #3b82f6 0%, #10b981 100%)",
                borderColor: "transparent",
                color: "#ffffff",
              }}
            >
              {t.home?.dashboardButtons?.browseRentals || "Browse Rentals"}
            </AntdButton>
            <AntdButton
              type="default"
              block={isMobile}
              onClick={() => navigate("/signin")}
              style={{
                minWidth: isMobile ? "100%" : 160,
                borderRadius: 999,
                padding: "12px 20px",
                fontWeight: 700,
                background: isDark ? "rgba(255,255,255,0.05)" : "#f8fafc",
                borderColor: isDark
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(15,23,42,0.12)",
              }}
            >
              {t.home?.dashboardButtons?.becomeVendor || "Become a Vendor"}
            </AntdButton>
            <AntdButton
              type="default"
              block={isMobile}
              style={{
                minWidth: isMobile ? "100%" : 160,
                borderRadius: 999,
                padding: "12px 20px",
                fontWeight: 700,
                background: isDark ? "rgba(255,255,255,0.05)" : "#f8fafc",
                borderColor: isDark
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(15,23,42,0.12)",
              }}
            >
              {t.home?.dashboardButtons?.viewBookings || "View Bookings"}
            </AntdButton>
          </Space>
        </Col>
      </Row>

      <Row gutter={[12, 12]} style={{ marginTop: 14 }}>
        <Col xs={24} md={12}>
          <Space orientation="vertical" size={22} style={{ width: "100%" }}>
            <Bookings />
            <Wishlist />
          </Space>
        </Col>

        <Col xs={24} md={12}>
          <Space orientation="vertical" size={12} style={{ width: "100%" }}>
            <AlertsPanel />
            <RecentlyViewed />
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

export default DashboardShortcut;
