import React from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Space,
  Avatar,
  Tag,
  List,
  Button,
} from "antd";
import {
  CheckCircleOutlined,
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
  WalletOutlined,
  IdcardOutlined,
  StarFilled,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { useTheme } from "../../context/ThemeProvider.jsx";
import { useTranslation } from "../../component/LanguageProvider.jsx";

const { Title, Text } = Typography;

const VendorProfile = () => {
  const { theme } = useTheme();
  const { translation: t } = useTranslation();
  const isDark = theme === "dark";

  const vendor = {
    businessName: "Sterling Constructions Ltd",
    businessType: "Heavy Machinery & Equipment Rentals",
    description:
      "A high-trust rental operation serving infrastructure, events, and industrial clients across Ethiopia.",
    address: "123 iShare Plaza, Addis Ababa, Ethiopia",
    city: "Addis Ababa",
    country: "Ethiopia",
    postalCode: "1000",
    phone: "+251-911-234-567",
    email: "operations@sterling-etc.et",
    website: "https://sterling-etc.et",
    logoUrl: "",
    verificationStatus: "approved",
    identityVerified: true,
    paymentMethodsVerified: true,
    rating: 4.9,
    totalReviews: 48,
    totalBookings: 128,
    totalRevenue: "$18,420",
    responseTimeAvg: "1.6h",
    trustScore: 92,
    taxId: "ET-TR-28719",
    registrationNumber: "REG-2044-ET",
  };

  const paymentMethods = [
    {
      type: "Bank Transfer",
      accountName: "Sterling Constructions Ltd",
      accountNumber: "1000002468",
      bankName: "Commercial Bank of Ethiopia",
      isPrimary: true,
      status: "verified",
    },
    {
      type: "Telebirr",
      accountName: "Sterling Operations",
      accountNumber: "+251-900-111-222",
      bankName: "Telebirr",
      isPrimary: false,
      status: "verified",
    },
  ];

  const identityDocuments = [
    {
      type: "National ID",
      number: "ET-909122867",
      status: "verified",
    },
    {
      type: "Business License",
      number: "BL-8834",
      status: "verified",
    },
  ];

  const operators = [
    {
      name: "Amanuel Bekele",
      role: "Operations Supervisor",
      phone: "+251-922-111-222",
      status: "available",
    },
    {
      name: "Selam Tadesse",
      role: "Field Technician",
      phone: "+251-933-333-444",
      status: "busy",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "32px",
        background: isDark ? "#060b17" : "#f4f8fd",
      }}
    >
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={8}>
          <Card
            style={{
              borderRadius: 28,
              background: isDark ? "#0f172a" : "#ffffff",
              border: isDark
                ? "1px solid rgba(255,255,255,0.08)"
                : "1px solid rgba(15,23,42,0.07)",
              boxShadow: isDark
                ? "0 20px 60px rgba(0,0,0,0.22)"
                : "0 18px 50px rgba(15,23,42,0.08)",
            }}
          >
            <Space direction="vertical" size={20} style={{ width: "100%" }}>
              <div style={{ textAlign: "center" }}>
                <Avatar
                  size={108}
                  src={vendor.logoUrl || undefined}
                  icon={!vendor.logoUrl && <IdcardOutlined />}
                  style={{
                    background: vendor.logoUrl ? undefined : "#2563eb",
                  }}
                />
                <Title
                  level={3}
                  style={{
                    marginTop: 18,
                    marginBottom: 6,
                    color: isDark ? "#f8fafc" : "#0f172a",
                  }}
                >
                  {vendor.businessName}
                </Title>
                <Text type="secondary">{vendor.businessType}</Text>
              </div>

              <div
                style={{
                  padding: 18,
                  borderRadius: 18,
                  background: isDark ? "rgba(15,23,42,0.75)" : "#eff6ff",
                }}
              >
                <Space align="center" size={10}>
                  <CheckCircleOutlined style={{ color: "#16a34a" }} />
                  <Text
                    strong
                    style={{ color: isDark ? "#f8fafc" : "#0f172a" }}
                  >
                    Verification status: {vendor.verificationStatus}
                  </Text>
                </Space>
              </div>

              <div
                style={{
                  display: "grid",
                  gap: 10,
                  color: isDark ? "#cbd5e1" : "#475569",
                }}
              >
                <Text>
                  <StarFilled style={{ color: "#f59e0b" }} /> Rating:{" "}
                  {vendor.rating}/5
                </Text>
                <Text>Total reviews: {vendor.totalReviews}</Text>
                <Text>Total bookings: {vendor.totalBookings}</Text>
                <Text>Revenue: {vendor.totalRevenue}</Text>
                <Text>Response time: {vendor.responseTimeAvg}</Text>
                <Text>Trust score: {vendor.trustScore}/100</Text>
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Row gutter={[24, 24]}>
            <Col xs={24}>
              <Card
                style={{
                  borderRadius: 24,
                  background: isDark ? "#0f172a" : "#ffffff",
                  border: isDark
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "1px solid rgba(15,23,42,0.07)",
                }}
              >
                <Title level={4} style={{ marginTop: 0 }}>
                  Business Overview
                </Title>
                <Text>{vendor.description}</Text>
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card
                style={{
                  borderRadius: 24,
                  background: isDark ? "#0f172a" : "#ffffff",
                  border: isDark
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "1px solid rgba(15,23,42,0.07)",
                }}
              >
                <Title level={5}>Contact & Location</Title>
                <Space direction="vertical" size={14}>
                  <Text>
                    <PhoneOutlined /> {vendor.phone}
                  </Text>
                  <Text>
                    <MailOutlined /> {vendor.email}
                  </Text>
                  <Text>
                    <GlobalOutlined /> {vendor.website}
                  </Text>
                  <Text>
                    <EnvironmentOutlined /> {vendor.address}
                  </Text>
                  <Text>
                    {vendor.city}, {vendor.country} · Postal:{" "}
                    {vendor.postalCode}
                  </Text>
                </Space>
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card
                style={{
                  borderRadius: 24,
                  background: isDark ? "#0f172a" : "#ffffff",
                  border: isDark
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "1px solid rgba(15,23,42,0.07)",
                }}
              >
                <Title level={5}>Verification Details</Title>
                <Space direction="vertical" size={12}>
                  <Text>Tax ID: {vendor.taxId}</Text>
                  <Text>Registration Number: {vendor.registrationNumber}</Text>
                  <Text>
                    Identity Verified: {vendor.identityVerified ? "Yes" : "No"}
                  </Text>
                  <Text>
                    Payment Methods Verified:{" "}
                    {vendor.paymentMethodsVerified ? "Yes" : "No"}
                  </Text>
                  <Text>Trust Score: {vendor.trustScore}/100</Text>
                </Space>
              </Card>
            </Col>

            <Col xs={24}>
              <Card
                style={{
                  borderRadius: 24,
                  background: isDark ? "#0f172a" : "#ffffff",
                  border: isDark
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "1px solid rgba(15,23,42,0.07)",
                }}
              >
                <Title level={5}>Payment Methods</Title>
                <List
                  dataSource={paymentMethods}
                  renderItem={(item) => (
                    <List.Item>
                      <Space direction="vertical" size={4}>
                        <Text strong>{item.type}</Text>
                        <Text>
                          {item.accountName} · {item.accountNumber}
                        </Text>
                        <Text>{item.bankName}</Text>
                        <Tag
                          color={
                            item.status === "verified" ? "green" : "orange"
                          }
                        >
                          {item.isPrimary ? "Primary" : "Secondary"} ·{" "}
                          {item.status}
                        </Tag>
                      </Space>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card
                style={{
                  borderRadius: 24,
                  background: isDark ? "#0f172a" : "#ffffff",
                  border: isDark
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "1px solid rgba(15,23,42,0.07)",
                }}
              >
                <Title level={5}>Identity Documents</Title>
                <List
                  dataSource={identityDocuments}
                  renderItem={(item) => (
                    <List.Item>
                      <Space direction="vertical" size={4}>
                        <Text strong>{item.type}</Text>
                        <Text>{item.number}</Text>
                        <Tag color="blue">{item.status}</Tag>
                      </Space>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card
                style={{
                  borderRadius: 24,
                  background: isDark ? "#0f172a" : "#ffffff",
                  border: isDark
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "1px solid rgba(15,23,42,0.07)",
                }}
              >
                <Title level={5}>Operators</Title>
                <List
                  dataSource={operators}
                  renderItem={(item) => (
                    <List.Item>
                      <Space direction="vertical" size={4}>
                        <Text strong>{item.name}</Text>
                        <Text>{item.role}</Text>
                        <Text>{item.phone}</Text>
                        <Tag
                          color={
                            item.status === "available" ? "green" : "orange"
                          }
                        >
                          {item.status}
                        </Tag>
                      </Space>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default VendorProfile;
