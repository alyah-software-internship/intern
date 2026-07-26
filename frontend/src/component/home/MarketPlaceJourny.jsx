import React from "react";
import { Card, Row, Col, Typography, Button } from "antd";
import { useTranslation } from "../LanguageProvider.jsx";
import { useTheme } from "../../context/ThemeProvider.jsx";

const { Title, Text } = Typography;

const MarketPlaceJourny = () => {
  const { translation: t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const steps = [
    {
      id: 1,
      title: t.home?.marketplaceStep1Title || "Search & Discover",
      desc:
        t.home?.marketplaceStep1Desc ||
        "Find the perfect equipment across categories and locations.",
    },
    {
      id: 2,
      title: t.home?.marketplaceStep2Title || "Book & Secure",
      desc:
        t.home?.marketplaceStep2Desc ||
        "Choose dates, confirm booking, and secure via escrow.",
    },
    {
      id: 3,
      title: t.home?.marketplaceStep3Title || "Pickup & Return",
      desc:
        t.home?.marketplaceStep3Desc ||
        "Collect, use, and return the item when done.",
    },
  ];

  return (
    <Card
      style={{
        borderRadius: 24,
        padding: 24,
        background: isDark ? "#0b1220" : "#ffffff",
        border: isDark
          ? "1px solid rgba(255,255,255,0.06)"
          : "1px solid rgba(15,23,42,0.06)",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div
          style={{
            color: "#10b981",
            fontWeight: 800,
            letterSpacing: "0.28em",
            fontSize: 12,
          }}
        >
          {t.home?.marketplaceBadge || "MARKETPLACE JOURNEY"}
        </div>
        <Title level={2} style={{ margin: "8px 0 6px", fontWeight: 800 }}>
          {t.home?.marketplaceMainTitle || "How i-Share Works"}
        </Title>
        <Text type="secondary">
          {t.home?.marketplaceMainSubtitle ||
            "Five intuitive phases representing a secure, escrow-backed rental contract"}
        </Text>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <div>
          <Title level={4} style={{ margin: 0 }}>
            {t.home?.marketplaceTitle || "How the Marketplace Works"}
          </Title>
          <Text type="secondary">
            {t.home?.marketplaceSubtitle ||
              "A simple 3-step journey to start renting"}
          </Text>
        </div>

        <Button type="text" style={{ color: "#10b981", fontWeight: 700 }}>
          {t.home?.marketplaceCTA || "Start Exploring"}
        </Button>
      </div>
      <Row gutter={[16, 16]}>
        {steps.map((s) => (
          <Col key={s.id} xs={24} sm={8}>
            <div style={{ padding: 12, minHeight: 120 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: "rgba(16,185,129,0.08)",
                  display: "grid",
                  placeItems: "center",
                  marginBottom: 12,
                }}
              >
                <Text strong style={{ color: "#10b981" }}>
                  {s.id}
                </Text>
              </div>
              <Text strong style={{ display: "block", marginBottom: 6 }}>
                {s.title}
              </Text>
              <Text type="secondary">{s.desc}</Text>
            </div>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default MarketPlaceJourny;
