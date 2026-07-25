import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "../../component/LanguageProvider.jsx";
import { GoogleOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Segmented,
  Typography,
} from "antd";
import carImage from "../../assets/car.png";

const { Title, Paragraph, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { lang, setLanguage, translation: t } = useTranslation();

  const onFinish = (values) => {
    setLoading(true);
    setTimeout(() => {
      console.log("Login success", values);
      setLoading(false);
    }, 900);
  };

  return (
    <Row
      justify="center"
      align="middle"
      style={{ minHeight: "100vh", background: "#eef4fb", padding: 24 }}
    >
      <Col xs={24} lg={20} xl={16}>
        <Card
          variant="borderless"
          style={{
            borderRadius: 32,
            boxShadow: "0 30px 90px rgba(15,23,42,0.14)",
            overflow: "hidden",
          }}
        >
          <Row gutter={[24, 24]} style={{ minHeight: "calc(100vh - 80px)" }}>
            <Col xs={0} sm={0} md={0} lg={12}>
              <div
                style={{
                  position: "relative",
                  minHeight: 660,
                  background: "#0f172a",
                  color: "#fff",
                }}
              >
                <img
                  src={carImage}
                  alt={t.backgroundImageAlt}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    opacity: 0.72,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(15,23,42,0.62)",
                  }}
                />
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%",
                    padding: 32,
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 12,
                        borderRadius: 999,
                        background: "rgba(15,23,42,0.45)",
                        border: "1px solid rgba(56,189,248,0.24)",
                        padding: "10px 16px",
                        fontSize: 12,
                        textTransform: "uppercase",
                        letterSpacing: "0.18em",
                        fontWeight: 700,
                        color: "#e2e8f0",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 40,
                          height: 40,
                          borderRadius: 16,
                          background: "#0ea5e9",
                          color: "#fff",
                          fontWeight: 700,
                        }}
                      >
                        i
                      </span>
                      i-Share
                    </div>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        borderRadius: 999,
                        border: "1px solid rgba(56,189,248,0.24)",
                        background: "rgba(56,189,248,0.1)",
                        padding: "10px 16px",
                        marginTop: 24,
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.24em",
                        color: "#7dd3fc",
                      }}
                    >
                      {t.heroBadge}
                    </div>
                    <Title
                      level={1}
                      style={{
                        marginTop: 32,
                        maxWidth: 420,
                        color: "#fff",
                        lineHeight: 1.02,
                        fontSize: 44,
                      }}
                    >
                      {t.heroTitle}
                    </Title>
                    <Paragraph
                      style={{
                        maxWidth: 420,
                        marginTop: 20,
                        color: "rgba(241,245,249,0.85)",
                        fontSize: 16,
                      }}
                    >
                      {t.heroSubtitle}
                    </Paragraph>
                  </div>
                  <div
                    style={{
                      borderRadius: 26,
                      border: "1px solid rgba(229,231,235,0.12)",
                      background: "rgba(15,23,42,0.78)",
                      padding: 24,
                      backdropFilter: "blur(16px)",
                    }}
                  >
                    <Text
                      strong
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 10,
                        textTransform: "uppercase",
                        letterSpacing: "0.28em",
                        color: "#7dd3fc",
                        fontSize: 13,
                      }}
                    >
                      ★ {t.heroProductName}
                    </Text>
                    <div
                      style={{
                        marginTop: 20,
                        display: "flex",
                        flexDirection: "column",
                        gap: 20,
                      }}
                    >
                      <div>
                        <Text
                          style={{
                            display: "block",
                            textTransform: "uppercase",
                            letterSpacing: "0.35em",
                            color: "#94a3b8",
                            fontSize: 12,
                          }}
                        >
                          {t.heroProductDescription}
                        </Text>
                        <Title
                          level={3}
                          style={{
                            marginTop: 12,
                            color: "#fff",
                            fontSize: 28,
                          }}
                        >
                          {t.heroProductRate}
                        </Title>
                      </div>
                      <div
                        style={{
                          alignSelf: "flex-start",
                          borderRadius: 999,
                          background: "rgba(255,255,255,0.08)",
                          padding: "8px 16px",
                          textTransform: "uppercase",
                          letterSpacing: "0.20em",
                          color: "#7dd3fc",
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        {t.heroProductLabel}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>

            <Col
              xs={24}
              lg={12}
              style={{ display: "flex", alignItems: "center" }}
            >
              <div style={{ width: "100%", maxWidth: 420, padding: 24 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 16,
                    marginBottom: 24,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.14em",
                      color: "#475569",
                    }}
                  >
                    {t.language}
                  </Text>
                  <Segmented
                    options={[
                      { label: "EN", value: "en" },
                      { label: "አማ", value: "am" },
                    ]}
                    value={lang}
                    onChange={setLanguage}
                    style={{ width: 180 }}
                  />
                </div>

                <Title level={2} style={{ marginBottom: 8, color: "#0f172a" }}>
                  {t.loginTitle}
                </Title>
                <Paragraph style={{ marginBottom: 32, color: "#64748b" }}>
                  {t.loginSubtitle}
                </Paragraph>

                <Form
                  layout="vertical"
                  name="login"
                  initialValues={{ remember: true }}
                  onFinish={onFinish}
                  size="large"
                >
                  <Form.Item
                    label={t.email}
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: t.emailRequired,
                      },
                    ]}
                  >
                    <Input
                      prefix={<MailOutlined />}
                      placeholder={t.placeholderEmail}
                      style={{ borderRadius: 18, height: 56 }}
                    />
                  </Form.Item>

                  <Form.Item
                    label={
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: 12,
                        }}
                      >
                        <span style={{ lineHeight: 1.3 }}>{t.password}</span>
                        <Link
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#0ea5e9",
                          }}
                          to="/forgot-password"
                        >
                          {t.forgot}
                        </Link>
                      </div>
                    }
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: t.passwordRequired,
                      },
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder={t.placeholderPassword}
                      style={{ borderRadius: 18, height: 56 }}
                    />
                  </Form.Item>

                  <Form.Item
                    name="remember"
                    valuePropName="checked"
                    style={{ marginBottom: 24 }}
                  >
                    <Checkbox>{t.remember}</Checkbox>
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      loading={loading}
                      style={{
                        height: 56,
                        borderRadius: 18,
                        fontSize: 16,
                        fontWeight: 700,
                      }}
                    >
                      {t.submitLogin}
                    </Button>
                  </Form.Item>
                </Form>

                <Divider style={{ color: "#cbd5e1", margin: "32px 0" }}>
                  {t.orContinue}
                </Divider>

                <Button
                  icon={<GoogleOutlined />}
                  block
                  style={{
                    height: 56,
                    borderRadius: 18,
                    background: "#fff",
                    color: "#0f172a",
                    borderColor: "#d1d5db",
                    fontWeight: 700,
                  }}
                >
                  {t.continueWithGoogle}
                </Button>

                <Paragraph
                  style={{
                    marginTop: 32,
                    textAlign: "center",
                    color: "#64748b",
                  }}
                >
                  {t.noAccount}{" "}
                  <Link
                    style={{ fontWeight: 700, color: "#0ea5e9" }}
                    to="/signup"
                  >
                    {t.signUp}
                  </Link>
                </Paragraph>
              </div>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default Login;
