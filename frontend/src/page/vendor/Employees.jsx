import React from "react";
import { Row, Col, Card, Typography, Space, Button, Tag } from "antd";
import { PhoneOutlined, MailOutlined } from "@ant-design/icons";
import { useTheme } from "../../context/ThemeProvider.jsx";

const { Title, Text } = Typography;

const operators = [
  {
    initials: "MV",
    name: "Marcus Vance",
    role: "Heavy Transport Driver",
    phone: "+256 712 345 678",
    email: "m.vance@ishare.com",
    status: "ON DELIVERY",
    statusColor: "#4f46e5",
    statusBg: "#eef2ff",
    joined: "Joined Jan 2024",
  },
  {
    initials: "ER",
    name: "Elena Rostova",
    role: "Lead Hydraulics Inspector",
    phone: "+256 712 987 654",
    email: "e.rostova@ishare.com",
    status: "AT WORKSHOP",
    statusColor: "#f59e0b",
    statusBg: "#fff7ed",
    joined: "Joined Mar 2024",
  },
  {
    initials: "ST",
    name: "Samuel Tekle",
    role: "Loader Operator & Safety Trainer",
    phone: "+256 715 443 210",
    email: "s.tekle@ishare.com",
    status: "AVAILABLE",
    statusColor: "#059669",
    statusBg: "#ecfdf5",
    joined: "Joined Nov 2023",
  },
  {
    initials: "LC",
    name: "Lydia Carter",
    role: "Billing & Operations Coordinator",
    phone: "+256 715 112 233",
    email: "l.carter@ishare.com",
    status: "AT OFFICE",
    statusColor: "#d97706",
    statusBg: "#fffbeb",
    joined: "Joined Feb 2025",
  },
];

const Employees = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 28,
        background: isDark ? "#060b17" : "#f4f8fd",
      }}
    >
      <Row gutter={[20, 20]}>
        <Col xs={24}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div>
              <Title
                level={2}
                style={{
                  marginBottom: 4,
                  color: isDark ? "#f8fafc" : "#0f172a",
                }}
              >
                Authorized Operator Registry
              </Title>
              <Text
                style={{
                  color: isDark ? "#94a3b8" : "#64748b",
                  fontSize: 16,
                }}
              >
                Assign drivers and hydraulic engineers to handle specific rental
                logistics & safety inspections.
              </Text>
            </div>

            <Button
              type="primary"
              size="large"
              style={{
                borderRadius: 10,
                background: "#4f46e5",
                border: "none",
                fontWeight: 700,
              }}
            >
              + Add Operator
            </Button>
          </div>
        </Col>

        {operators.map((operator) => (
          <Col xs={24} sm={12} xl={6} key={operator.name}>
            <Card
              style={{
                borderRadius: 18,
                background: isDark ? "#0f172a" : "#ffffff",
                border: isDark
                  ? "1px solid rgba(255,255,255,0.08)"
                  : "1px solid rgba(15,23,42,0.08)",
                boxShadow: isDark
                  ? "0 12px 32px rgba(0,0,0,0.18)"
                  : "0 10px 24px rgba(15,23,42,0.06)",
              }}
              bodyStyle={{ padding: 20 }}
            >
              <Space direction="vertical" size={16} style={{ width: "100%" }}>
                <Space align="center" size={12}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      background: "#e5e7eb",
                      display: "grid",
                      placeItems: "center",
                      fontWeight: 800,
                      color: "#1f2937",
                    }}
                  >
                    {operator.initials}
                  </div>

                  <Tag
                    style={{
                      borderRadius: 8,
                      padding: "2px 10px",
                      fontWeight: 700,
                      background: operator.statusBg,
                      color: operator.statusColor,
                      border: "none",
                    }}
                  >
                    {operator.status}
                  </Tag>
                </Space>

                <div>
                  <Title
                    level={4}
                    style={{
                      margin: 0,
                      marginBottom: 4,
                      color: isDark ? "#f8fafc" : "#111827",
                    }}
                  >
                    {operator.name}
                  </Title>
                  <Text style={{ color: isDark ? "#94a3b8" : "#64748b" }}>
                    {operator.role}
                  </Text>
                </div>

                <Space direction="vertical" size={6}>
                  <Text style={{ color: isDark ? "#cbd5e1" : "#374151" }}>
                    <PhoneOutlined style={{ marginRight: 6 }} />
                    {operator.phone}
                  </Text>
                  <Text style={{ color: isDark ? "#cbd5e1" : "#374151" }}>
                    <MailOutlined style={{ marginRight: 6 }} />
                    {operator.email}
                  </Text>
                </Space>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                    marginTop: 8,
                  }}
                >
                  <Text style={{ color: isDark ? "#94a3b8" : "#64748b" }}>
                    {operator.joined}
                  </Text>
                  <Button danger size="small">
                    Revoke
                  </Button>
                </div>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Employees;
