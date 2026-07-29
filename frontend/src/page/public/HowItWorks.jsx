import React from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Card, Typography, Button } from "antd";
import { useTranslation } from "../../component/LanguageProvider.jsx";
import { useTheme } from "../../context/ThemeProvider.jsx";
import MarketPlaceJourny from "../../component/home/MarketPlaceJourny.jsx";

const { Title, Text } = Typography;

const HowItWorks = () => {
  const { translation: t } = useTranslation();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === "dark";
  const pageSurface = isDark ? "#111827" : "#ffffff";
  const pageSurfaceAlt = isDark ? "#0f172a" : "#f8fbff";
  const cardBorder = isDark
    ? "1px solid rgba(255,255,255,0.08)"
    : "1px solid rgba(15,23,42,0.08)";

  const steps = [
    {
      id: 1,
      title: t.home?.step1Title,
      description: t.home?.step1Desc,
    },
    {
      id: 2,
      title: t.home?.step2Title,
      description: t.home?.step2Desc,
    },
    {
      id: 3,
      title: t.home?.step3Title,
      description: t.home?.step3Desc,
    },
  ];

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
            marginBottom: 32,
          }}
        >
          <div style={{ maxWidth: 720 }}>
            <Text
              style={{
                display: "block",
                color: "#16a34a",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                fontSize: 12,
                fontWeight: 700,
                marginBottom: 10,
              }}
            >
              {t.home?.howItWorks}
            </Text>
            <Title
              style={{
                margin: 0,
                color: isDark ? "#f8fafc" : "#0f172a",
                lineHeight: 1.1,
              }}
            >
              {t.home?.howItWorks}
            </Title>
            <Text
              style={{
                display: "block",
                marginTop: 16,
                color: isDark ? "#cbd5e1" : "#475569",
                fontSize: 16,
                lineHeight: 1.8,
              }}
            >
              {t.home?.howItWorksSubtitle}
            </Text>
          </div>

          <Button
            type="primary"
            size="large"
            onClick={() => navigate("/rentals")}
            style={{ minWidth: 180, height: 46 }}
          >
            {t.home?.getStarted}
          </Button>
        </div>

        <Row gutter={[24, 24]} style={{ marginBottom: 40 }}>
          {steps.map((step) => (
            <Col key={step.id} xs={24} sm={12} md={8}>
              <Card
                hoverable
                bodyStyle={{ padding: 24 }}
                style={{
                  borderRadius: 24,
                  background: pageSurface,
                  border: cardBorder,
                }}
              >
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 16,
                    background: "rgba(16,185,129,0.12)",
                    display: "grid",
                    placeItems: "center",
                    marginBottom: 18,
                    fontWeight: 700,
                    color: "#10b981",
                  }}
                >
                  {step.id}
                </div>
                <Text
                  strong
                  style={{
                    display: "block",
                    color: isDark ? "#f8fafc" : "#0f172a",
                    fontSize: 18,
                    marginBottom: 12,
                  }}
                >
                  {step.title}
                </Text>
                <Text
                  type="secondary"
                  style={{ color: isDark ? "#94a3b8" : "#475569" }}
                >
                  {step.description}
                </Text>
              </Card>
            </Col>
          ))}
        </Row>

        <MarketPlaceJourny />
      </div>
    </div>
  );
};

export default HowItWorks;
