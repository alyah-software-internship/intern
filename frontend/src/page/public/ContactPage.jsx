import React from "react";
import { Row, Col, Typography, Input, Button, Card, Space } from "antd";
import {
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useTranslation } from "../../component/LanguageProvider.jsx";
import { useTheme } from "../../context/ThemeProvider.jsx";

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const ContactPage = () => {
  const { translation: t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";

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
            marginBottom: 40,
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
              {t.nav?.contact || "Contact"}
            </Text>
            <Title
              style={{
                margin: 0,
                color: isDark ? "#f8fafc" : "#0f172a",
                lineHeight: 1.1,
              }}
            >
              {t.contact?.title || "Contact Us"}
            </Title>
            <Paragraph
              style={{
                marginTop: 16,
                color: isDark ? "#cbd5e1" : "#475569",
                fontSize: 16,
                lineHeight: 1.8,
              }}
            >
              {t.contact?.subtitle || "We'd love to hear from you"}
            </Paragraph>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Button type="primary" size="large">
              {t.contact?.liveChat || "Live Chat"}
            </Button>
          </div>
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={10}>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <Card
                style={{
                  borderRadius: 24,
                  background: isDark ? "#0f172a" : "#fff",
                  border: isDark
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "1px solid rgba(15,23,42,0.08)",
                }}
              >
                <Space
                  direction="vertical"
                  size="middle"
                  style={{ width: "100%" }}
                >
                  <div>
                    <Text
                      strong
                      style={{ color: isDark ? "#f8fafc" : "#0f172a" }}
                    >
                      {t.contact?.getInTouch || "Get in Touch"}
                    </Text>
                    <Paragraph
                      style={{
                        color: isDark ? "#cbd5e1" : "#475569",
                        margin: 0,
                      }}
                    >
                      {t.contact?.liveChatDesc ||
                        "Chat with our support team in real-time"}
                    </Paragraph>
                  </div>

                  <div style={{ display: "grid", gap: 18 }}>
                    <div
                      style={{
                        display: "flex",
                        gap: 16,
                        alignItems: "flex-start",
                      }}
                    >
                      <PhoneOutlined
                        style={{ color: "#16a34a", fontSize: 20, marginTop: 4 }}
                      />
                      <div>
                        <Text
                          strong
                          style={{ color: isDark ? "#f8fafc" : "#0f172a" }}
                        >
                          {t.contact?.phone || "Phone"}
                        </Text>
                        <Paragraph
                          style={{
                            color: isDark ? "#cbd5e1" : "#475569",
                            margin: 0,
                          }}
                        >
                          +251 11 123 4567
                        </Paragraph>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: 16,
                        alignItems: "flex-start",
                      }}
                    >
                      <MailOutlined
                        style={{ color: "#16a34a", fontSize: 20, marginTop: 4 }}
                      />
                      <div>
                        <Text
                          strong
                          style={{ color: isDark ? "#f8fafc" : "#0f172a" }}
                        >
                          {t.contact?.email || "Email"}
                        </Text>
                        <Paragraph
                          style={{
                            color: isDark ? "#cbd5e1" : "#475569",
                            margin: 0,
                          }}
                        >
                          info@ishare.com
                        </Paragraph>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: 16,
                        alignItems: "flex-start",
                      }}
                    >
                      <EnvironmentOutlined
                        style={{ color: "#16a34a", fontSize: 20, marginTop: 4 }}
                      />
                      <div>
                        <Text
                          strong
                          style={{ color: isDark ? "#f8fafc" : "#0f172a" }}
                        >
                          {t.contact?.address || "Address"}
                        </Text>
                        <Paragraph
                          style={{
                            color: isDark ? "#cbd5e1" : "#475569",
                            margin: 0,
                          }}
                        >
                          Addis Ababa, Ethiopia
                        </Paragraph>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: 16,
                        alignItems: "flex-start",
                      }}
                    >
                      <ClockCircleOutlined
                        style={{ color: "#16a34a", fontSize: 20, marginTop: 4 }}
                      />
                      <div>
                        <Text
                          strong
                          style={{ color: isDark ? "#f8fafc" : "#0f172a" }}
                        >
                          {t.contact?.businessHours || "Business Hours"}
                        </Text>
                        <Paragraph
                          style={{
                            color: isDark ? "#cbd5e1" : "#475569",
                            margin: 0,
                          }}
                        >
                          Mon - Fri, 9:00 AM - 5:00 PM
                        </Paragraph>
                      </div>
                    </div>
                  </div>
                </Space>
              </Card>
            </Space>
          </Col>

          <Col xs={24} lg={14}>
            <Card
              style={{
                borderRadius: 24,
                background: isDark ? "#0f172a" : "#fff",
                border: isDark
                  ? "1px solid rgba(255,255,255,0.08)"
                  : "1px solid rgba(15,23,42,0.08)",
              }}
            >
              <div style={{ maxWidth: 640 }}>
                <Title
                  level={3}
                  style={{ color: isDark ? "#f8fafc" : "#0f172a" }}
                >
                  {t.contact?.getInTouch || "Get in Touch"}
                </Title>
                <Paragraph style={{ color: isDark ? "#cbd5e1" : "#475569" }}>
                  {t.contact?.liveChatDesc ||
                    "Chat with our support team in real-time"}
                </Paragraph>

                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12}>
                    <Input
                      size="large"
                      placeholder={t.placeholderName || "Enter your full name"}
                    />
                  </Col>
                  <Col xs={24} sm={12}>
                    <Input
                      size="large"
                      placeholder={t.placeholderEmail || "example@email.com"}
                    />
                  </Col>
                  <Col xs={24}>
                    <TextArea
                      rows={6}
                      placeholder={
                        t.contact?.messagePlaceholder ||
                        "Type your message here..."
                      }
                      style={{ resize: "none" }}
                    />
                  </Col>
                  <Col xs={24}>
                    <Button type="primary" size="large">
                      {t.contact?.sendMessage || "Send Message"}
                    </Button>
                  </Col>
                </Row>

                <div style={{ marginTop: 24 }}>
                  <Text style={{ color: isDark ? "#cbd5e1" : "#64748b" }}>
                    {t.contact?.supportTeam || "Support Team"}
                  </Text>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ContactPage;
