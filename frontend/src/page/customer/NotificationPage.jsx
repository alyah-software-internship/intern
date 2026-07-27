import React from "react";
import { Typography, Row, Col, Card, Button, List, Badge } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { useTranslation } from "../../component/LanguageProvider.jsx";
import { useTheme } from "../../context/ThemeProvider.jsx";

const { Title, Paragraph, Text } = Typography;

const NotificationPage = () => {
  const { translation: t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const notifications = [
    {
      id: 1,
      title: t.notifications?.newOffer || "New rental offer available",
      description:
        t.notifications?.newOfferDesc ||
        "Check out a new discount from one of your favorite vendors.",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: 2,
      title: t.notifications?.bookingConfirmed || "Booking confirmed",
      description:
        t.notifications?.bookingConfirmedDesc ||
        "Your booking has been confirmed and is ready for pickup.",
      time: "Yesterday",
      unread: false,
    },
    {
      id: 3,
      title: t.notifications?.paymentSuccess || "Payment successful",
      description:
        t.notifications?.paymentSuccessDesc ||
        "Your payment was processed successfully.",
      time: "2 days ago",
      unread: false,
    },
  ];

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
            <Button type="default">
              {t.notifications?.clearAll || "Clear All"}
            </Button>
            <Button type="primary">
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
          <List
            itemLayout="vertical"
            dataSource={notifications}
            locale={{ emptyText: t.notifications?.empty || "No notifications" }}
            renderItem={(item) => (
              <List.Item
                key={item.id}
                style={{
                  borderRadius: 20,
                  marginBottom: 16,
                  padding: 24,
                  background: isDark ? "#091127" : "#f8fbff",
                }}
              >
                <List.Item.Meta
                  avatar={
                    <Badge dot={item.unread} offset={[0, 8]}>
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
                      {item.description}
                    </Text>
                  }
                />
                <Text style={{ color: isDark ? "#94a3b8" : "#64748b" }}>
                  {item.time}
                </Text>
              </List.Item>
            )}
          />
        </Card>
      </div>
    </div>
  );
};

export default NotificationPage;
