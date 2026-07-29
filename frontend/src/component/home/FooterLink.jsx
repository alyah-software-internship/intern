import React from "react";
import {
  Layout,
  Row,
  Col,
  Typography,
  Space,
  Divider,
  Tag,
  Grid,
  Button,
  Badge,
} from "antd";
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  YoutubeOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import { useTranslation } from "../LanguageProvider.jsx";

const { Footer } = Layout;
const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

const FooterLink = () => {
  const { translation: t } = useTranslation();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const footerSections = [
    {
      title: t.footer?.company || "COMPANY",
      links: [
        { label: t.footer?.aboutUs || "About Us", href: "/about" },
        { label: t.footer?.careers || "Careers", href: "/careers" },
        { label: t.footer?.press || "Press", href: "/press" },
        { label: t.footer?.blog || "Blog", href: "/blog" },
      ],
    },
    {
      title: t.footer?.categories || "CATEGORIES",
      links: [
        {
          label: t.footer?.equipment || "Equipment",
          href: "/category/equipment",
        },
        { label: t.footer?.vehicles || "Vehicles", href: "/category/vehicles" },
        { label: t.footer?.tools || "Tools", href: "/category/tools" },
        {
          label: t.footer?.beautyWellness || "Beauty & Wellness",
          href: "/category/beauty",
        },
      ],
    },
    {
      title: t.footer?.support || "SUPPORT",
      links: [
        { label: t.footer?.helpCenter || "Help Center", href: "/help" },
        { label: t.footer?.contactUs || "Contact Us", href: "/contact" },
        {
          label: t.footer?.platformStatus || "Platform Status",
          href: "/status",
        },
        { label: t.footer?.community || "Community", href: "/community" },
      ],
    },
  ];

  const socialLinks = [
    { icon: <FacebookOutlined />, href: "#", color: "#1877f2" },
    { icon: <TwitterOutlined />, href: "#", color: "#1da1f2" },
    { icon: <InstagramOutlined />, href: "#", color: "#e4405f" },
    { icon: <LinkedinOutlined />, href: "#", color: "#0a66c2" },
    { icon: <YoutubeOutlined />, href: "#", color: "#ff0000" },
  ];

  const paymentMethods = [
    { name: "VISA" },
    { name: "MC" },
    { name: "PayPal" },
    { name: "Chapa" },
  ];

  return (
    <Footer
      style={{
        background: "#000",
        padding: isMobile ? "40px 16px 20px" : "60px 40px 30px",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        marginTop: 40,
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Row gutter={[32, 32]}>
          <Col xs={24} lg={8}>
            <Space orientation="vertical" size={12} style={{ width: "100%" }}>
              <Title
                level={3}
                style={{
                  margin: 0,
                  color: "#ffffff",
                  fontWeight: 900,
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <span
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 10,
                      background: "#111",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#ffffff",
                      fontWeight: 900,
                      fontSize: 18,
                    }}
                  >
                    i
                  </span>
                  <span>Share</span>
                </span>
              </Title>

              <Paragraph
                style={{
                  color: "#cbd5e1",
                  fontSize: isMobile ? 14 : 15,
                  lineHeight: 1.8,
                  maxWidth: 400,
                }}
              >
                {t.footer?.aboutDesc ||
                  "Ethiopia's premier multi-vendor SaaS rental marketplace. Connecting renters with trusted commercial vendors securely."}
              </Paragraph>

              <Space size={8} wrap>
                {socialLinks.map((social, index) => (
                  <Button
                    key={index}
                    type="text"
                    icon={social.icon}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "#e2e8f0",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = social.color;
                      e.currentTarget.style.color = "#ffffff";
                      e.currentTarget.style.borderColor = social.color;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.05)";
                      e.currentTarget.style.color = "#e2e8f0";
                      e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.08)";
                    }}
                  />
                ))}
              </Space>
            </Space>
          </Col>

          {footerSections.map((section, index) => (
            <Col xs={24} sm={8} lg={4} key={index}>
              <Space orientation="vertical" size={8} style={{ width: "100%" }}>
                <Text
                  strong
                  style={{
                    color: "#f8fafc",
                    fontSize: isMobile ? 12 : 13,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    display: "block",
                    marginBottom: 4,
                  }}
                >
                  {section.title}
                </Text>
                {section.links.map((link, linkIndex) => (
                  <a
                    key={linkIndex}
                    href={link.href}
                    style={{
                      color: "#cbd5e1",
                      fontSize: isMobile ? 13 : 14,
                      textDecoration: "none",
                      display: "block",
                      padding: "4px 0",
                      transition: "all 0.2s ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#ffffff";
                      e.currentTarget.style.transform = "translateX(4px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#cbd5e1";
                      e.currentTarget.style.transform = "translateX(0px)";
                    }}
                  >
                    {link.label}
                  </a>
                ))}
              </Space>
            </Col>
          ))}
        </Row>

        <Divider
          style={{
            margin: "32px 0 24px",
            background: "rgba(255,255,255,0.08)",
          }}
        />

        <Row
          align="middle"
          justify="space-between"
          gutter={[16, 16]}
          style={{
            flexDirection: isMobile ? "column" : "row",
            textAlign: isMobile ? "center" : "left",
          }}
        >
          <Col xs={24} md={12}>
            <Text
              style={{
                color: "#cbd5e1",
                fontSize: isMobile ? 12 : 13,
              }}
            >
              {t.footer?.copyright ||
                "© 2026 i-Share Ethiopia. All rights reserved."}
            </Text>
          </Col>

          <Col xs={24} md={12}>
            <Space
              wrap
              size={16}
              style={{
                justifyContent: isMobile ? "center" : "flex-end",
                display: "flex",
              }}
            >
              <Space size={8}>
                <Text
                  style={{
                    color: "#f8fafc",
                    fontSize: isMobile ? 11 : 12,
                  }}
                >
                  {t.footer?.securePayments || "SECURE PAYMENTS:"}
                </Text>
                {paymentMethods.map((method, index) => (
                  <Tag
                    key={index}
                    style={{
                      padding: "2px 10px",
                      borderRadius: 4,
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "#e2e8f0",
                      fontSize: isMobile ? 10 : 11,
                      fontWeight: 600,
                      cursor: "default",
                    }}
                  >
                    {method.name}
                  </Tag>
                ))}
              </Space>

              <Badge
                count={<SafetyOutlined style={{ fontSize: 16 }} />}
                style={{
                  backgroundColor: "#10b981",
                  display: isMobile ? "none" : "inline-flex",
                }}
              >
                <Text
                  style={{
                    color: "#cbd5e1",
                    fontSize: 12,
                    marginLeft: 8,
                  }}
                >
                  {t.footer?.secureTrusted || "Secure & Trusted"}
                </Text>
              </Badge>
            </Space>
          </Col>
        </Row>

        {isMobile && (
          <Row style={{ marginTop: 16, textAlign: "center" }}>
            <Col span={24}>
              <Space size={8} wrap justify="center" style={{ display: "flex" }}>
                <SafetyOutlined style={{ color: "#10b981" }} />
                <Text
                  style={{
                    color: "#cbd5e1",
                    fontSize: 11,
                  }}
                >
                  {t.footer?.secureTrusted || "Secure & Trusted"}
                </Text>
              </Space>
            </Col>
          </Row>
        )}
      </div>
    </Footer>
  );
};

export default FooterLink;
