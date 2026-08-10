import React from "react";
import { BellOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { Card, List, Space, Tag, Typography } from "antd";
import { useTranslation } from "../../component/LanguageProvider.jsx";

const { Title, Text } = Typography;

const notificationItems = [
  {
    id: "1",
    title: "New vendor registration pending approval",
    description: "A new vendor application requires review before activation.",
    time: "2 hrs ago",
    status: "unread",
  },
  {
    id: "2",
    title: "System maintenance scheduled",
    description: "Platform maintenance is scheduled for tomorrow at 02:00 AM.",
    time: "5 hrs ago",
    status: "read",
  },
  {
    id: "3",
    title: "Audit report available",
    description: "The latest compliance audit report is ready for review.",
    time: "1 day ago",
    status: "read",
  },
];

const Notifications = () => {
  const { translation: t } = useTranslation();

  return (
    <div style={{ padding: 24, minHeight: "100vh" }}>
      <Card style={{ maxWidth: 1180, margin: "0 auto" }}>
        <Space
          direction="vertical"
          size={16}
          style={{ width: "100%", marginBottom: 24 }}
        >
          <Text
            style={{
              display: "block",
              textTransform: "uppercase",
              letterSpacing: "0.24em",
              color: "#6b7280",
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

        <List
          itemLayout="vertical"
          dataSource={notificationItems}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              style={{
                padding: 20,
                borderRadius: 18,
                marginBottom: 16,
                background: item.status === "unread" ? "#f8fafc" : "#ffffff",
                boxShadow: "0 8px 24px rgba(15, 23, 42, 0.04)",
                border: "1px solid rgba(15,23,42,0.08)",
              }}
            >
              <Space direction="vertical" size={12} style={{ width: "100%" }}>
                <Space
                  align="center"
                  style={{ justifyContent: "space-between", width: "100%" }}
                >
                  <Text strong style={{ fontSize: 16 }}>
                    {item.title}
                  </Text>
                  <Tag
                    color={item.status === "unread" ? "warning" : "default"}
                    style={{ borderRadius: 999, padding: "0 10px" }}
                  >
                    {item.status.toUpperCase()}
                  </Tag>
                </Space>
                <Text type="secondary">{item.description}</Text>
                <Space size={8} style={{ alignItems: "center" }}>
                  <ClockCircleOutlined />
                  <Text type="secondary">{item.time}</Text>
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
