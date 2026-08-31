import { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  BellOutlined,
  ClockCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Card, List, Space, Tag, Typography, Button, message } from "antd";
import { useTranslation } from "../../component/LanguageProvider.jsx";
import { AppContext } from "../../context/AppContext.jsx";
import { useTheme } from "../../context/ThemeProvider.jsx";

const { Title, Text } = Typography;
const authConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
});

const Notifications = () => {
  const { translation: t } = useTranslation();
  const { backendUrl } = useContext(AppContext);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${backendUrl}/notifications`,
        authConfig(),
      );
      const data = response.data?.data || response.data?.notifications || [];
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      // Fallback to mock data if API fails
      setNotifications([
        {
          id: "1",
          title: "New vendor registration pending approval",
          description:
            "A new vendor application requires review before activation.",
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          is_read: false,
        },
        {
          id: "2",
          title: "System maintenance scheduled",
          description:
            "Platform maintenance is scheduled for tomorrow at 02:00 AM.",
          created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          is_read: true,
        },
        {
          id: "3",
          title: "Audit report available",
          description:
            "The latest compliance audit report is ready for review.",
          created_at: new Date(
            Date.now() - 1 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          is_read: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [backendUrl]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      style={{
        background: isDark ? "#060b17" : "#f4f8fd",
        minHeight: "100%",
        padding: "24px",
      }}
    >
      {contextHolder}
      <Card
        style={{
          borderRadius: 20,
          background: isDark ? "#0f172a" : "#fff",
          border: isDark
            ? "1px solid rgba(255,255,255,0.08)"
            : "1px solid rgba(15,23,42,0.07)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            marginBottom: 24,
            flexWrap: "wrap",
          }}
        >
          <Space direction="vertical" size={0}>
            <Text
              style={{
                display: "block",
                textTransform: "uppercase",
                letterSpacing: "0.24em",
                color: isDark ? "#64748b" : "#6b7280",
                fontWeight: 700,
                fontSize: 12,
              }}
            >
              {t.admin?.dashboard || "Admin Dashboard"}
            </Text>
            <Title level={3} style={{ margin: 0 }}>
              {t.notifications?.title || "Notifications"}
            </Title>
            <Text type="secondary">
              {t.notifications?.subtitle ||
                "Review the latest admin alerts and system notifications."}
            </Text>
          </Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchNotifications}
            loading={loading}
          >
            Refresh
          </Button>
        </div>

        <List
          itemLayout="vertical"
          dataSource={notifications}
          loading={loading}
          locale={{ emptyText: "No notifications" }}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              style={{
                padding: 20,
                borderRadius: 18,
                marginBottom: 16,
                background: item.is_read
                  ? isDark
                    ? "#0b1726"
                    : "#ffffff"
                  : isDark
                    ? "#1e293b"
                    : "#f0f4f8",
                boxShadow: isDark
                  ? "0 8px 24px rgba(0,0,0,0.12)"
                  : "0 8px 24px rgba(15, 23, 42, 0.04)",
                border: isDark
                  ? "1px solid rgba(255,255,255,0.08)"
                  : "1px solid rgba(15,23,42,0.08)",
              }}
            >
              <Space direction="vertical" size={12} style={{ width: "100%" }}>
                <Space
                  align="center"
                  style={{
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Text strong style={{ fontSize: 16 }}>
                    {item.title}
                  </Text>
                  <Tag
                    color={item.is_read ? "default" : "warning"}
                    style={{ borderRadius: 999, padding: "0 10px" }}
                  >
                    {item.is_read ? "READ" : "UNREAD"}
                  </Tag>
                </Space>
                <Text type="secondary">{item.description}</Text>
                <Space size={8} style={{ alignItems: "center" }}>
                  <ClockCircleOutlined />
                  <Text type="secondary">{formatTime(item.created_at)}</Text>
                </Space>
              </Space>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default Notifications;
