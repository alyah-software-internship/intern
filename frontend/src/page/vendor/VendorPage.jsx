import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Row, Col, Card, Typography, Space, Tag, Spin } from "antd";
import {
  DollarOutlined,
  AppstoreOutlined,
  ClockCircleOutlined,
  StarFilled,
  CheckCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { AppContext } from "../../context/AppContext.jsx";
import { useTheme } from "../../context/ThemeProvider.jsx";
import { useTranslation } from "../../component/LanguageProvider.jsx";

const { Title, Text } = Typography;

const authConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
});

const formatCurrency = (value, currencyCode = "ETB") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

const createAlerts = (t) => [
  {
    title: t.vendor?.alertNewBookingRequest || "New Booking Request",
    description:
      t.vendor?.alertNewBookingDesc ||
      "Elena Rostova has requested to rent HydraFacial MD Elite from Jul 22 to Jul 24.",
    time: t.vendor?.alertTime1 || "05:30 PM",
    icon: <ClockCircleOutlined style={{ color: "#16a34a" }} />,
  },
  {
    title:
      t.vendor?.alertVendorRequestPendingReview ||
      "Vendor Request Pending Review",
    description:
      t.vendor?.alertVendorRequestDesc ||
      "Apex Tool Hire & Scaffolding submitted verification documentation.",
    time: t.vendor?.alertTime2 || "02:20 PM",
    icon: <WarningOutlined style={{ color: "#2563eb" }} />,
  },
  {
    title: t.vendor?.alertWeeklyPayoutCompleted || "Weekly Payout Completed",
    description:
      t.vendor?.alertWeeklyPayoutDesc ||
      "Your vendor payout of ETB 1,250.00 has been initiated.",
    time: t.vendor?.alertTime3 || "12:15 PM",
    icon: <CheckCircleOutlined style={{ color: "#059669" }} />,
  },
];

const VendorPage = () => {
  const { backendUrl } = useContext(AppContext);
  const { theme } = useTheme();
  const { translation: t } = useTranslation();
  const isDark = theme === "dark";
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/vendor/dashboard`,
          authConfig(),
        );
        setStats(response.data?.stats || {});
      } catch (error) {
        console.error("Failed to load vendor dashboard", error);
        setStats({});
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [backendUrl]);

  const totalBookings = Number(stats.total_bookings || 0);
  const activeBookings = Number(stats.active_bookings || 0);
  const rating = Number(stats.rating || 0);
  const completedRevenue = Number(stats.total_revenue || 0);
  const revenueByMonth = Array.isArray(stats.revenue_by_month)
    ? stats.revenue_by_month
    : [];
  const maxMonthlyRevenue = Math.max(
    ...revenueByMonth.map((entry) => Number(entry.amount || 0)),
    1,
  );
  const utilization =
    totalBookings > 0
      ? Math.min(100, (activeBookings / totalBookings) * 100)
      : 0;
  const reviewsText = stats.total_reviews
    ? `${stats.total_reviews} reviews`
    : "No reviews yet";

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: isDark ? "#060b17" : "#f3f7fb",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: isDark ? "#060b17" : "#f3f7fb",
      }}
    >
      <div
        style={{
          flex: 1,
          padding: 32,
          overflow: "auto",
        }}
      >
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} xl={6}>
            <Card
              style={{ borderRadius: 24, minHeight: 170 }}
              styles={{ body: { padding: 24 } }}
            >
              <Space align="center" style={{ marginBottom: 16 }}>
                <DollarOutlined style={{ fontSize: 24, color: "#16a34a" }} />
                <Text strong style={{ color: isDark ? "#f8fafc" : "#0f172a" }}>
                  {t.vendor?.completedRevenue || "Completed Revenue"}
                </Text>
              </Space>
              <Title
                level={2}
                style={{ margin: 0, color: isDark ? "#f8fafc" : "#0f172a" }}
              >
                {formatCurrency(completedRevenue, "ETB")}
              </Title>
              <Tag
                style={{
                  marginTop: 16,
                  borderRadius: 999,
                  background: isDark ? "#164e63" : "#dcfce7",
                  color: isDark ? "#cffafe" : "#166534",
                  fontWeight: 700,
                }}
              >
                {stats.pending_payouts
                  ? `Pending payout: ${formatCurrency(stats.pending_payouts, "ETB")}`
                  : "No pending payout"}
              </Tag>
            </Card>
          </Col>

          <Col xs={24} sm={12} xl={6}>
            <Card
              style={{ borderRadius: 24, minHeight: 170 }}
              styles={{ body: { padding: 24 } }}
            >
              <Space align="center" style={{ marginBottom: 16 }}>
                <AppstoreOutlined style={{ fontSize: 24, color: "#2563eb" }} />
                <Text strong style={{ color: isDark ? "#f8fafc" : "#0f172a" }}>
                  {t.vendor?.activeFieldLeases || "Active Field Leases"}
                </Text>
              </Space>
              <Title
                level={2}
                style={{ margin: 0, color: isDark ? "#f8fafc" : "#0f172a" }}
              >
                {activeBookings}
              </Title>
              <Text style={{ color: isDark ? "#94a3b8" : "#475569" }}>
                {stats.pending_bookings
                  ? `${stats.pending_bookings} pending bookings`
                  : "No active bookings"}
              </Text>
            </Card>
          </Col>

          <Col xs={24} sm={12} xl={6}>
            <Card
              style={{ borderRadius: 24, minHeight: 170 }}
              styles={{ body: { padding: 24 } }}
            >
              <Space align="center" style={{ marginBottom: 16 }}>
                <ClockCircleOutlined
                  style={{ fontSize: 24, color: "#f97316" }}
                />
                <Text strong style={{ color: isDark ? "#f8fafc" : "#0f172a" }}>
                  {t.vendor?.assetUtilization || "Asset Utilization"}
                </Text>
              </Space>
              <Title
                level={2}
                style={{ margin: 0, color: isDark ? "#f8fafc" : "#0f172a" }}
              >
                {Math.round(utilization)}%
              </Title>
              <Text style={{ color: isDark ? "#94a3b8" : "#475569" }}>
                {totalBookings
                  ? `${totalBookings} total bookings`
                  : "No booking history yet"}
              </Text>
            </Card>
          </Col>

          <Col xs={24} sm={12} xl={6}>
            <Card
              style={{ borderRadius: 24, minHeight: 170 }}
              styles={{ body: { padding: 24 } }}
            >
              <Space align="center" style={{ marginBottom: 16 }}>
                <StarFilled style={{ fontSize: 24, color: "#facc15" }} />
                <Text strong style={{ color: isDark ? "#f8fafc" : "#0f172a" }}>
                  {t.vendor?.feedbackRating || "Feedback Rating"}
                </Text>
              </Space>
              <Title
                level={2}
                style={{ margin: 0, color: isDark ? "#f8fafc" : "#0f172a" }}
              >
                {rating > 0 ? `${Number(rating).toFixed(1)} / 5` : "0.0 / 5"}
              </Title>
              <Text style={{ color: isDark ? "#94a3b8" : "#475569" }}>
                {reviewsText}
              </Text>
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
          <Col xs={24} xl={16}>
            <Card
              style={{ borderRadius: 24, minHeight: 420 }}
              styles={{ body: { padding: 24 } }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 24,
                }}
              >
                <div>
                  <Text
                    strong
                    style={{ color: isDark ? "#94a3b8" : "#64748b" }}
                  >
                    {t.vendor?.revenuePerformanceTitle ||
                      "Revenue Generation Performance"}
                  </Text>
                  <Title
                    level={4}
                    style={{ margin: 0, color: isDark ? "#f8fafc" : "#0f172a" }}
                  >
                    {t.vendor?.revenuePerformanceSubtitle ||
                      "Monthly breakdown of gross rental value vs commissions"}
                  </Title>
                </div>
                <Tag
                  style={{
                    fontWeight: 700,
                    borderRadius: 999,
                    background: isDark ? "#064e3b" : "#dcfce7",
                    color: isDark ? "#d1fae5" : "#166534",
                  }}
                >
                  {t.vendor?.payoutScheduleWeekly || "Payout schedule: weekly"}
                </Tag>
              </div>
              <div
                style={{
                  width: "100%",
                  minHeight: 280,
                  borderRadius: 20,
                  background: isDark ? "#071323" : "#f0f6ff",
                  padding: "24px 20px 18px",
                  display: "flex",
                  alignItems: "stretch",
                  gap: 14,
                }}
              >
                {revenueByMonth.map((entry) => {
                  const amount = Number(entry.amount || 0);
                  const height = Math.max(
                    8,
                    (amount / maxMonthlyRevenue) * 190,
                  );

                  return (
                    <div
                      key={entry.month}
                      style={{
                        flex: 1,
                        minWidth: 34,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <Text
                        style={{
                          color: isDark ? "#cbd5e1" : "#475569",
                          fontSize: 11,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatCurrency(amount, "ETB")}
                      </Text>
                      <div
                        title={`${entry.month}: ${formatCurrency(amount, "ETB")}`}
                        style={{
                          width: "min(44px, 100%)",
                          height,
                          minHeight: 8,
                          borderRadius: "10px 10px 4px 4px",
                          background:
                            amount > 0
                              ? "linear-gradient(180deg, #16a34a, #0f766e)"
                              : isDark
                                ? "#1e293b"
                                : "#cbd5e1",
                          transition: "height 0.4s ease",
                        }}
                      />
                      <Text
                        strong
                        style={{ color: isDark ? "#f8fafc" : "#0f172a" }}
                      >
                        {entry.month}
                      </Text>
                    </div>
                  );
                })}
              </div>
            </Card>
          </Col>

          <Col xs={24} xl={8}>
            <Card
              style={{ borderRadius: 24, minHeight: 420 }}
              styles={{ body: { padding: 24 } }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 24,
                }}
              >
                <Title
                  level={4}
                  style={{ margin: 0, color: isDark ? "#f8fafc" : "#0f172a" }}
                >
                  {t.vendor?.recentAlertsTitle || "Recent Alerts & Requests"}
                </Title>
              </div>
              <div>
                {createAlerts(t).map((item) => (
                  <div key={`${item.title}-${item.time}`}>
                    <Card
                      type="inner"
                      style={{
                        width: "100%",
                        borderRadius: 18,
                        border: isDark
                          ? "1px solid rgba(255,255,255,0.08)"
                          : "1px solid rgba(15,23,42,0.08)",
                        background: isDark ? "#081122" : "#f8fbff",
                        marginBottom: 16,
                      }}
                    >
                      <Space align="start" size={16}>
                        <div style={{ fontSize: 20 }}>{item.icon}</div>
                        <div style={{ flex: 1 }}>
                          <Text
                            strong
                            style={{ color: isDark ? "#f8fafc" : "#0f172a" }}
                          >
                            {item.title}
                          </Text>
                          <Text
                            style={{
                              display: "block",
                              color: isDark ? "#94a3b8" : "#475569",
                              marginTop: 8,
                            }}
                          >
                            {item.description}
                          </Text>
                          <Text
                            type="secondary"
                            style={{ color: isDark ? "#64748b" : "#94a3b8" }}
                          >
                            {item.time}
                          </Text>
                        </div>
                      </Space>
                    </Card>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default VendorPage;
