import React from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Typography, Button } from "antd";
import { useTranslation } from "../../component/LanguageProvider.jsx";
import { useTheme } from "../../context/ThemeProvider.jsx";

const { Title, Paragraph, Text } = Typography;

const AboutPage = () => {
  const { translation: t } = useTranslation();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === "dark";
  const about = t.aboutPage || {};
  const pageSurface = isDark ? "#111827" : "#ffffff";
  const pageSurfaceAlt = isDark ? "#0f172a" : "#f8fbff";
  const cardBorder = isDark
    ? "1px solid rgba(255,255,255,0.08)"
    : "1px solid rgba(15,23,42,0.08)";

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px 24px",
        background: isDark ? "#040b1a" : pageSurfaceAlt,
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 24,
            flexWrap: "wrap",
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
              {t.nav?.about}
            </Text>
            <Title
              style={{
                margin: 0,
                color: isDark ? "#f8fafc" : "#0f172a",
                lineHeight: 1.1,
              }}
            >
              {about.title}
            </Title>
            <Paragraph
              style={{
                marginTop: 16,
                color: isDark ? "#cbd5e1" : "#475569",
                fontSize: 16,
                lineHeight: 1.8,
              }}
            >
              {about.subtitle}
            </Paragraph>
          </div>

          <Button
            type="primary"
            size="large"
            onClick={() => navigate("/rentals")}
            style={{ minWidth: 180, height: 46 }}
          >
            {about.ctaButton}
          </Button>
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <div
              style={{
                borderRadius: 24,
                padding: 28,
                background: isDark ? "#0f172a" : "#fff",
                border: isDark
                  ? "1px solid rgba(255,255,255,0.08)"
                  : "1px solid rgba(15,23,42,0.08)",
              }}
            >
              <Title
                level={3}
                style={{ color: isDark ? "#f8fafc" : "#0f172a" }}
              >
                {about.missionTitle}
              </Title>
              <Paragraph
                style={{
                  color: isDark ? "#cbd5e1" : "#475569",
                  lineHeight: 1.8,
                }}
              >
                {about.missionDesc}
              </Paragraph>
            </div>
          </Col>

          <Col xs={24} md={12}>
            <div
              style={{
                borderRadius: 24,
                padding: 28,
                background: pageSurface,
                border: cardBorder,
              }}
            >
              <Title
                level={3}
                style={{ color: isDark ? "#f8fafc" : "#0f172a" }}
              >
                {about.visionTitle}
              </Title>
              <Paragraph
                style={{
                  color: isDark ? "#cbd5e1" : "#475569",
                  lineHeight: 1.8,
                }}
              >
                {about.visionDesc}
              </Paragraph>
            </div>
          </Col>

          <Col xs={24} md={12}>
            <div
              style={{
                borderRadius: 24,
                padding: 28,
                background: pageSurface,
                border: cardBorder,
              }}
            >
              <Title
                level={3}
                style={{ color: isDark ? "#f8fafc" : "#0f172a" }}
              >
                {about.valuesTitle}
              </Title>
              <Paragraph
                style={{
                  color: isDark ? "#cbd5e1" : "#475569",
                  lineHeight: 1.8,
                }}
              >
                {about.valuesDesc}
              </Paragraph>
            </div>
          </Col>

          <Col xs={24} md={12}>
            <div
              style={{
                borderRadius: 24,
                padding: 28,
                background: pageSurface,
                border: cardBorder,
              }}
            >
              <Title
                level={3}
                style={{ color: isDark ? "#f8fafc" : "#0f172a" }}
              >
                {about.whyTitle}
              </Title>
              <Paragraph
                style={{
                  color: isDark ? "#cbd5e1" : "#475569",
                  lineHeight: 1.8,
                }}
              >
                {about.whyDesc}
              </Paragraph>
            </div>
          </Col>
        </Row>

        <div
          style={{
            marginTop: 40,
            display: "grid",
            gap: 24,
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          }}
        >
          {[
            {
              label: about.stats?.vendors,
              value: about.stats?.vendorsCount,
            },
            {
              label: about.stats?.rentals,
              value: about.stats?.rentalsCount,
            },
            {
              label: about.stats?.categories,
              value: about.stats?.categoriesCount,
            },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                borderRadius: 24,
                padding: 28,
                background: pageSurface,
                border: cardBorder,
              }}
            >
              <Text
                strong
                style={{
                  display: "block",
                  marginBottom: 12,
                  color: isDark ? "#f8fafc" : "#0f172a",
                }}
              >
                {item.value}
              </Text>
              <Text
                style={{
                  color: isDark ? "#cbd5e1" : "#475569",
                }}
              >
                {item.label}
              </Text>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
