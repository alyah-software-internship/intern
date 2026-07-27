import React from "react";
import { Row, Col, Card, Typography, Button } from "antd";
import { useTranslation } from "../../component/LanguageProvider.jsx";
import { useTheme } from "../../context/ThemeProvider.jsx";

const { Title, Text } = Typography;

const plans = [
  {
    id: "basic",
    title: "Daily Rental",
    price: "$90",
    description: "Perfect for short-term projects and quick equipment needs.",
    items: ["Single-day access", "Standard support", "Flexible return"],
    button: "Start Renting",
  },
  {
    id: "standard",
    title: "Weekly Rental",
    price: "$450",
    description:
      "Save more when you rent for a full week with premium support.",
    items: ["7-day rental", "Priority scheduling", "Escrow protection"],
    featured: true,
    button: "Choose Weekly",
  },
  {
    id: "premium",
    title: "Monthly Rental",
    price: "$1,600",
    description:
      "Best value for extended projects with the highest availability.",
    items: ["30-day rental", "Dedicated support", "Top-rated vendors"],
    button: "Get Started",
  },
];

const PricingPage = () => {
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
        <div style={{ marginBottom: 32 }}>
          <Text
            style={{
              display: "block",
              textTransform: "uppercase",
              letterSpacing: "0.24em",
              color: "#16a34a",
              fontSize: 12,
              fontWeight: 700,
              marginBottom: 10,
            }}
          >
            {t.nav?.pricing || "Pricing"}
          </Text>
          <Title
            style={{
              margin: 0,
              color: isDark ? "#f8fafc" : "#0f172a",
              lineHeight: 1.1,
            }}
          >
            {t.nav?.pricing || "Pricing"}
          </Title>
          <Text
            style={{
              display: "block",
              marginTop: 16,
              color: isDark ? "#94a3b8" : "#475569",
              fontSize: 16,
              lineHeight: 1.8,
            }}
          >
            {t.home?.marketplaceSubtitle ||
              "Choose the rental plan that fits your project, from one day to one month."}
          </Text>
        </div>

        <Row gutter={[24, 24]}>
          {plans.map((plan) => (
            <Col key={plan.id} xs={24} md={12} lg={8}>
              <Card
                hoverable
                bodyStyle={{ padding: 28 }}
                style={{
                  minHeight: 380,
                  borderRadius: 24,
                  background: isDark ? "#0f172a" : "#fff",
                  border: plan.featured
                    ? "2px solid #16a34a"
                    : isDark
                      ? "1px solid rgba(255,255,255,0.08)"
                      : "1px solid rgba(15,23,42,0.08)",
                }}
              >
                <div style={{ marginBottom: 22 }}>
                  <Text
                    strong
                    style={{
                      display: "block",
                      color: isDark ? "#f8fafc" : "#0f172a",
                      fontSize: 18,
                      marginBottom: 8,
                    }}
                  >
                    {plan.title}
                  </Text>
                  <Text
                    style={{
                      display: "block",
                      color: isDark ? "#94a3b8" : "#6b7280",
                      fontSize: 14,
                    }}
                  >
                    {plan.description}
                  </Text>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <Text
                    strong
                    style={{
                      fontSize: 42,
                      lineHeight: 1,
                      color: isDark ? "#f8fafc" : "#0f172a",
                    }}
                  >
                    {plan.price}
                  </Text>
                  <Text
                    style={{
                      display: "block",
                      marginTop: 6,
                      color: isDark ? "#94a3b8" : "#6b7280",
                    }}
                  >
                    {t.common?.price || "Price"}
                  </Text>
                </div>

                <div style={{ marginBottom: 26 }}>
                  \n{" "}
                  {plan.items.map((item) => (
                    <Text
                      key={item}
                      style={{
                        display: "block",
                        marginBottom: 10,
                        color: isDark ? "#cbd5e1" : "#475569",
                      }}
                    >
                      • {item}
                    </Text>
                  ))}
                </div>

                <Button
                  type={plan.featured ? "primary" : "default"}
                  block
                  size="large"
                  style={{
                    borderRadius: 999,
                    height: 48,
                    marginTop: "auto",
                  }}
                >
                  {plan.button}
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default PricingPage;
