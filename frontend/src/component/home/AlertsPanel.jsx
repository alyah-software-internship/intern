import React from "react";
import { Card, List, Typography, Badge } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { useTranslation } from "../LanguageProvider.jsx";
import { useTheme } from "../../context/ThemeProvider.jsx";

const { Text } = Typography;

const sampleAlerts = [
  {
    id: 1,
    title: "New Booking Request",
    body: "Elena Rostova has requested to rent HydraFacial MD Elite from Jul 22 to Jul 24.",
    date: "7/17/2026 at 05:30 PM",
  },
  {
    id: 2,
    title: "Vendor Request Pending Review",
    body: "Apex Tool Hire & Scaffolding submitted verification documentation.",
    date: "7/16/2026 at 02:20 PM",
  },
  {
    id: 3,
    title: "Weekly Payout Completed",
    body: "Your vendor payout of $1,250.00 has been initiated to your linked account.",
    date: "7/15/2026 at 11:00 AM",
  },
];

const AlertsPanel = () => {
  const { translation: t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Card
      style={{
        borderRadius: 12,
        padding: 12,
        background: isDark ? "#0b1220" : "#fff",
        border: isDark
          ? "1px solid rgba(255,255,255,0.06)"
          : "1px solid rgba(15,23,42,0.06)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <BellOutlined
            style={{ fontSize: 18, color: isDark ? "#60a5fa" : "#0ea5e9" }}
          />
          <Text strong style={{ color: isDark ? "#f8fafc" : undefined }}>
            {t.alerts?.panelTitle || "Alerts Panel"}
          </Text>
        </div>

        <Badge status="success" />
      </div>

      <div style={{ marginTop: 12 }}>
        <List
          dataSource={sampleAlerts}
          renderItem={(item) => (
            <List.Item style={{ padding: 0 }}>
              <div
                style={{
                  width: "100%",
                  padding: 12,
                  borderRadius: 10,
                  background: isDark
                    ? "linear-gradient(90deg, rgba(99,102,241,0.06), rgba(56,189,248,0.04))"
                    : "linear-gradient(180deg, #f0faf6 0%, #f9fbff 100%)",
                  border: isDark
                    ? "1px solid rgba(255,255,255,0.02)"
                    : "1px solid rgba(14,165,233,0.06)",
                }}
              >
                <Text
                  strong
                  style={{
                    display: "block",
                    color: isDark ? "#052e56" : "#052e56",
                  }}
                >
                  {item.title}
                </Text>
                <Text
                  style={{
                    display: "block",
                    color: isDark ? "#94a3b8" : "#6b7280",
                    marginTop: 6,
                  }}
                >
                  {item.body}
                </Text>
                <Text
                  style={{
                    display: "block",
                    color: isDark ? "#94a3b8" : "#94a3b8",
                    fontSize: 12,
                    marginTop: 8,
                  }}
                >
                  {item.date}
                </Text>
              </div>
            </List.Item>
          )}
        />
      </div>
    </Card>
  );
};

export default AlertsPanel;
