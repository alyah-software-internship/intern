import { useContext, useEffect, useState } from "react";
import { Typography, Row, Col, Card, Button, List, Badge, Spin } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../component/LanguageProvider.jsx";
import { useTheme } from "../../context/ThemeProvider.jsx";
import { AppContext } from "../../context/AppContext.jsx";

const { Title, Paragraph, Text } = Typography;

const NotificationPage = () => {
  const { translation: t } = useTranslation();
  const { theme } = useTheme();
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const isDark = theme === "dark";
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    Accept: "application/json",
  });

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

  const markAllRead = async () => {
    await fetch(`${backendUrl}/notifications/read-all`, {
      method: "POST",
      headers: authHeaders(),
    });
    await loadNotifications();
  };

  const markRead = async (notification) => {
    if (!notification.is_read) {
      await fetch(`${backendUrl}/notifications/${notification.id}/read`, {
        method: "POST",
        headers: authHeaders(),
      });
    }
    setNotifications((current) =>
      current.map((item) =>
        item.id === notification.id ? { ...item, is_read: true } : item,
      ),
    );
  };

  const openNotification = async (notification) => {
    await markRead(notification);

    const notificationType = String(notification.type || "").toLowerCase();
    const notificationTitle = String(notification.title || "").toLowerCase();
    const notificationCategory = String(
      notification.category || "",
    ).toLowerCase();
    const isMessageNotification =
      notificationCategory === "message" ||
      notificationType.includes("message") ||
      notificationType.includes("chat") ||
      notificationTitle.includes("message");

    if (isMessageNotification) {
      const bookingId = notification.link?.match(
        /(?:bookings|booking-details)\/(\d+)/,
      )?.[1];
      navigate("/messages", {
        state: bookingId ? { bookingId } : undefined,
      });
      return;
    }

    const isBookingConfirmed =
      notificationType === "booking_confirmed" ||
      notificationTitle.includes("booking confirmed");

    if (isBookingConfirmed) {
      navigate("/bookings");
      return;
    }

    if (!notification.link) return;

    const link = notification.link.replace(
      /^\/customer\/bookings\/(\d+)/,
      "/booking-details/$1",
    );

    if (link.startsWith("http://") || link.startsWith("https://")) {
      window.location.assign(link);
      return;
    }

    navigate(link.startsWith("/") ? link : `/${link}`);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px 24px",
        background: isDark ? "#040b1a" : "#f8fbff",
      }}
    >
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
                color: "#16a34a",
                fontWeight: 700,
              }}
            >
              {t.nav?.dashboard || "Dashboard"}
            </Text>
            <Title
              style={{
                margin: 0,
                color: isDark ? "#f8fafc" : "#0f172a",
                lineHeight: 1.1,
              }}
            >
              {t.notifications?.title || "Notifications"}
            </Title>
            <Paragraph
              style={{
                marginTop: 16,
                color: isDark ? "#cbd5e1" : "#475569",
                fontSize: 16,
                lineHeight: 1.8,
              }}
            >
              {t.notifications?.subtitle ||
                "Review your recent alerts and stay up to date with rental activity."}
            </Paragraph>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Button type="primary" onClick={markAllRead}>
              {t.notifications?.markAllRead || "Mark All Read"}
            </Button>
          </div>
        </div>

        <Card
          style={{
            borderRadius: 24,
            background: isDark ? "#0f172a" : "#fff",
            border: isDark
              ? "1px solid rgba(255,255,255,0.08)"
              : "1px solid rgba(15,23,42,0.08)",
          }}
        >
          {loading ? (
            <Spin />
          ) : (
            <List
              itemLayout="vertical"
              dataSource={notifications}
              locale={{
                emptyText: t.notifications?.empty || "No notifications",
              }}
              renderItem={(item) => (
                <List.Item
                  key={item.id}
                  onClick={() => openNotification(item)}
                  style={{
                    borderRadius: 20,
                    marginBottom: 16,
                    padding: 24,
                    background: isDark ? "#091127" : "#f8fbff",
                    cursor: item.link ? "pointer" : "default",
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      <Badge dot={!item.is_read} offset={[0, 8]}>
                        <BellOutlined
                          style={{ fontSize: 24, color: "#16a34a" }}
                        />
                      </Badge>
                    }
                    title={
                      <Text
                        strong
                        style={{ color: isDark ? "#f8fafc" : "#0f172a" }}
                      >
                        {item.title}
                      </Text>
                    }
                    description={
                      <Text style={{ color: isDark ? "#cbd5e1" : "#475569" }}>
                        {item.message}
                      </Text>
                    }
                  />
                  <Text style={{ color: isDark ? "#94a3b8" : "#64748b" }}>
                    {new Date(item.created_at).toLocaleString()}
                  </Text>
                </List.Item>
              )}
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default NotificationPage;
