import React from "react";
import { Card, List, Typography } from "antd";
import { ClockCircleOutlined, WarningOutlined, CheckCircleOutlined } from "@ant-design/icons";
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
    icon: <ClockCircleOutlined style={{ color: "#16a34a", fontSize: 18 }} />,
  },
  {
    title:
      t.vendor?.alertVendorRequestPendingReview ||
      "Vendor Request Pending Review",
    description:
      t.vendor?.alertVendorRequestDesc ||
      "Apex Tool Hire & Scaffolding submitted verification documentation.",
    time: t.vendor?.alertTime2 || "02:20 PM",
    icon: <WarningOutlined style={{ color: "#2563eb", fontSize: 18 }} />,
  },
  {
    title: t.vendor?.alertWeeklyPayoutCompleted || "Weekly Payout Completed",
    description:
      t.vendor?.alertWeeklyPayoutDesc ||
      "Your vendor payout of $1,250.00 has been initiated.",
    time: t.vendor?.alertTime3 || "12:15 PM",
    icon: <CheckCircleOutlined style={{ color: "#059669", fontSize: 18 }} />,
  },
];

const VendorAlerts = () => {
  const { theme } = useTheme();
  const { translation: t } = useTranslation();
  const isDark = theme === "dark";

  return (
    <div style={{ minHeight: "100vh", background: isDark ? "#060b17" : "#f3f7fb" }}>
      <Card
        style={{
          minHeight: "72vh",
          borderRadius: 24,
          background: isDark ? "#0b1120" : "#ffffff",
          color: isDark ? "#f8fafc" : "#0f172a",
        }}
      >
        <Title style={{ color: isDark ? "#f8fafc" : "#0f172a" }}>
          {t.vendor?.alertsPageTitle || "Alerts"}
        </Title>
        <Text type="secondary">
          {t.vendor?.recentAlertsTitle || "Recent Alerts & Requests"}
        </Text>

        <List
          style={{ marginTop: 24 }}
          itemLayout="vertical"
          dataSource={createAlerts(t)}
          renderItem={(item) => (
            <List.Item
              style={{
                borderRadius: 20,
                marginBottom: 16,
                background: isDark ? "#071323" : "#f8fafc",
                border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(15,23,42,0.08)",
              }}
            >
              <List.Item.Meta
                avatar={item.icon}
                title={
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: isDark ? "#f8fafc" : "#0f172a" }}>{item.title}</span>
                    <Text type="secondary">{item.time}</Text>
                  </div>
                }
                description={
                  <Text style={{ color: isDark ? "#cbd5e1" : "#475569" }}>
                    {item.description}
                  </Text>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default VendorAlerts;
