import React from "react";
import { Row, Col, Card, Typography, Space, Tag, List } from "antd";
import {
  DollarOutlined,
  AppstoreOutlined,
  ClockCircleOutlined,
  StarFilled,
  CheckCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { useTheme } from "../../context/ThemeProvider.jsx";
import { useTranslation } from "../../component/LanguageProvider.jsx";

const { Title, Text } = Typography;

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
      "Your vendor payout of $1,250.00 has been initiated.",
    time: t.vendor?.alertTime3 || "12:15 PM",
    icon: <CheckCircleOutlined style={{ color: "#059669" }} />,
  },
];

const VendorPage = () => {
  const { theme } = useTheme();
  const { translation: t } = useTranslation();
  const isDark = theme === "dark";

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
              bodyStyle={{ padding: 24 }}
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
                $500
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
                +12.4% vs last month
              </Tag>
            </Card>
          </Col>

          <Col xs={24} sm={12} xl={6}>
            <Card
              style={{ borderRadius: 24, minHeight: 170 }}
              bodyStyle={{ padding: 24 }}
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
                1
              </Title>
              <Text style={{ color: isDark ? "#94a3b8" : "#475569" }}>
                Machinery working outdoors
              </Text>
            </Card>
          </Col>

          <Col xs={24} sm={12} xl={6}>
            <Card
              style={{ borderRadius: 24, minHeight: 170 }}
              bodyStyle={{ padding: 24 }}
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
                50%
              </Title>
              <Text style={{ color: isDark ? "#94a3b8" : "#475569" }}>
                Rent days vs idle catalog slots
              </Text>
            </Card>
          </Col>

          <Col xs={24} sm={12} xl={6}>
            <Card
              style={{ borderRadius: 24, minHeight: 170 }}
              bodyStyle={{ padding: 24 }}
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
                4.8 / 5
              </Title>
              <Text style={{ color: isDark ? "#94a3b8" : "#475569" }}>
                Based on 38 verification checks
              </Text>
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
          <Col xs={24} xl={16}>
            <Card
              style={{ borderRadius: 24, minHeight: 420 }}
              bodyStyle={{ padding: 24 }}
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
                  height: 280,
                  borderRadius: 20,
                  background: isDark ? "#071323" : "#f0f6ff",
                  display: "grid",
                  placeItems: "center",
                  color: isDark ? "#f8fafc" : "#0f172a",
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                Chart placeholder
              </div>
            </Card>
          </Col>

          <Col xs={24} xl={8}>
            <Card
              style={{ borderRadius: 24, minHeight: 420 }}
              bodyStyle={{ padding: 24 }}
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
              <List
                dataSource={createAlerts(t)}
                renderItem={(item) => (
                  <List.Item style={{ padding: 0, border: "none" }}>
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
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default VendorPage;
