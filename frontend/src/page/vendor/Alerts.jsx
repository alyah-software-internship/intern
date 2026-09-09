import { useContext, useEffect, useState } from "react";
import { Button, Card, Empty, Space, Spin, Typography } from "antd";
import {
  BellOutlined,
  DollarOutlined,
  MessageOutlined,
  CalendarOutlined,
  WarningOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeProvider.jsx";
import { useTranslation } from "../../component/LanguageProvider.jsx";
import { AppContext } from "../../context/AppContext.jsx";

const { Title, Text } = Typography;

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("authToken")}`,
  Accept: "application/json",
});

const notificationRoute = (notification) => {
  const link = notification.link?.trim();
  const knownVendorRoutes = [
    "/vendor/dashboard",
    "/vendor/bookings",
    "/vendor/messages",
    "/vendor/products",
    "/vendor/profile",
    "/vendor/settings",
    "/vendor/my-wallet",
    "/vendor/wallet",
    "/vendor/alerts",
  ];
  const knownRoute = knownVendorRoutes.find(
    (route) => link === route || link?.startsWith(`${route}/`),
  );
  if (knownRoute) return knownRoute;

  const type = String(notification.type || "").toLowerCase();
  const category = String(notification.category || "").toLowerCase();

  if (category === "booking" || type.includes("booking")) {
    return "/vendor/bookings";
  }
  if (
    category === "message" ||
    type.includes("message") ||
    type.includes("chat")
  ) {
    return "/vendor/messages";
  }
  if (
    category === "payment" ||
    type.includes("payment") ||
    type.includes("payout")
  ) {
    return "/vendor/my-wallet";
  }
  if (category === "vendor" || type.includes("vendor")) {
    return "/vendor/dashboard";
  }
  if (link?.startsWith("/customer/bookings/")) return "/vendor/bookings";
  return "/vendor/alerts";
};

const notificationIcon = (notification) => {
  const value =
    `${notification.category || ""} ${notification.type || ""}`.toLowerCase();
  if (value.includes("booking")) return <CalendarOutlined />;
  if (value.includes("message") || value.includes("chat"))
    return <MessageOutlined />;
  if (value.includes("payment") || value.includes("payout"))
    return <DollarOutlined />;
  if (value.includes("approved") || value.includes("completed"))
    return <CheckCircleOutlined />;
  if (value.includes("warning") || value.includes("rejected"))
    return <WarningOutlined />;
  return <BellOutlined />;
};

const VendorAlerts = () => {
  const { theme } = useTheme();
  const { translation: t } = useTranslation();
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const isDark = theme === "dark";
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/notifications`, {
        headers: authHeaders(),
      });
      const data = await response.json();
      setNotifications(
        Array.isArray(data.notifications) ? data.notifications : [],
      );
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [backendUrl]);

  const markRead = async (notification) => {
    if (notification.is_read) return;

    try {
      await fetch(`${backendUrl}/notifications/${notification.id}/read`, {
        method: "POST",
        headers: authHeaders(),
      });
    } catch {
      return;
    } finally {
      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id ? { ...item, is_read: true } : item,
        ),
      );
    }
  };

  const openNotification = async (notification) => {
    await markRead(notification);
    navigate(notificationRoute(notification));
  };

  const markAllRead = async () => {
    await fetch(`${backendUrl}/notifications/read-all`, {
      method: "POST",
      headers: authHeaders(),
    });
    setNotifications((current) =>
      current.map((notification) => ({ ...notification, is_read: true })),
    );
  };

  return (
    <div
      style={{ minHeight: "100vh", background: isDark ? "#060b17" : "#f3f7fb" }}
    >
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <Text type="secondary">
            {t.vendor?.recentAlertsTitle || "Recent Alerts & Requests"}
          </Text>
          <Button
            onClick={markAllRead}
            disabled={!notifications.some((item) => !item.is_read)}
          >
            {t.notifications?.markAllRead || "Mark All Read"}
          </Button>
        </div>

        <Space
          orientation="vertical"
          size={16}
          style={{ width: "100%", marginTop: 24 }}
        >
          {loading ? (
            <Spin />
          ) : notifications.length === 0 ? (
            <Empty description={t.notifications?.empty || "No notifications"} />
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => openNotification(item)}
                style={{
                  borderRadius: 20,
                  padding: 24,
                  background: item.is_read
                    ? isDark
                      ? "#071323"
                      : "#f8fafc"
                    : isDark
                      ? "#10233a"
                      : "#eef8ff",
                  border: isDark
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "1px solid rgba(15,23,42,0.08)",
                  cursor: "pointer",
                }}
              >
                <Space align="start" size={16} style={{ width: "100%" }}>
                  <span
                    style={{
                      color: item.is_read ? "#64748b" : "#16a34a",
                      fontSize: 18,
                    }}
                  >
                    {notificationIcon(item)}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        strong
                        style={{ color: isDark ? "#f8fafc" : "#0f172a" }}
                      >
                        {!item.is_read && "• "}
                        {item.title}
                      </Text>
                      <Text type="secondary">
                        {new Date(item.created_at).toLocaleString()}
                      </Text>
                    </div>
                    <Text
                      style={{
                        display: "block",
                        marginTop: 8,
                        color: isDark ? "#cbd5e1" : "#475569",
                      }}
                    >
                      {item.message}
                    </Text>
                  </div>
                </Space>
              </div>
            ))
          )}
        </Space>
      </Card>
    </div>
  );
};

export default VendorAlerts;
