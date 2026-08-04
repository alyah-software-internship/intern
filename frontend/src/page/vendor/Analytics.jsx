import React, { useMemo, useState } from "react";
import { Row, Col, Card, Typography, Space, Button, Progress } from "antd";
import { useTheme } from "../../context/ThemeProvider.jsx";

const { Title, Text } = Typography;

const categoryData = [
  {
    label: "Agriculture & Tractors",
    value: 14,
    percentage: "14 bookings (85%)",
    color: "#10b981",
  },
  {
    label: "Construction & Loaders",
    value: 8,
    percentage: "8 bookings (55%)",
    color: "#3b82f6",
  },
  {
    label: "Lawn & Gardening",
    value: 3,
    percentage: "3 bookings (20%)",
    color: "#f59e0b",
  },
  {
    label: "Material Handling & Lifts",
    value: 1,
    percentage: "1 bookings (10%)",
    color: "#8b5cf6",
  },
];

const Analytics = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [listingPrice] = useState(150);
  const [daysRented] = useState(18);
  const [commissionRate] = useState(0.03);

  const estimatedProfit = useMemo(() => {
    const commission = listingPrice * daysRented * commissionRate;
    return Math.round(listingPrice * daysRented - commission);
  }, [listingPrice, daysRented, commissionRate]);

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
          <div>
            <Title
              level={2}
              style={{
                marginBottom: 4,
                color: isDark ? "#f8fafc" : "#0f172a",
              }}
            >
              Fleet Analytics & Earnings Model
            </Title>
            <Text
              style={{
                color: isDark ? "#94a3b8" : "#64748b",
                fontSize: 16,
              }}
            >
              Review live equipment rental performance data, customer rating
              metrics, and average utilization rates.
            </Text>
          </div>
        </Col>

        <Col xs={24} lg={15}>
          <Card
            style={{
              borderRadius: 18,
              background: isDark ? "#0f172a" : "#ffffff",
              border: isDark
                ? "1px solid rgba(255,255,255,0.08)"
                : "1px solid rgba(15,23,42,0.08)",
              padding: 8,
            }}
          >
            <Title
              level={4}
              style={{
                marginBottom: 18,
                color: isDark ? "#f8fafc" : "#111827",
              }}
            >
              Asset Category Rental Frequency
            </Title>

            <Space direction="vertical" size={18} style={{ width: "100%" }}>
              {categoryData.map((item) => (
                <div key={item.label}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <Text
                      strong
                      style={{ color: isDark ? "#f8fafc" : "#111827" }}
                    >
                      {item.label}
                    </Text>
                    <Text style={{ color: isDark ? "#94a3b8" : "#64748b" }}>
                      {item.percentage}
                    </Text>
                  </div>
                  <Progress
                    percent={item.value * 7}
                    showInfo={false}
                    strokeColor={item.color}
                    trailColor={isDark ? "#1e293b" : "#dbeafe"}
                    style={{ marginBottom: 2 }}
                  />
                </div>
              ))}
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={9}>
          <Card
            style={{
              borderRadius: 18,
              background: isDark ? "#0f172a" : "#ffffff",
              border: isDark
                ? "1px solid rgba(255,255,255,0.08)"
                : "1px solid rgba(15,23,42,0.08)",
              padding: 8,
            }}
          >
            <Title
              level={4}
              style={{
                marginBottom: 10,
                color: isDark ? "#f8fafc" : "#111827",
              }}
            >
              Instant Yield Calculator
            </Title>
            <Text style={{ color: isDark ? "#94a3b8" : "#64748b" }}>
              Determine your estimated monthly profit based on your average
              equipment price points and days leased.
            </Text>

            <div style={{ marginTop: 26 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 12,
                }}
              >
                <Text strong style={{ color: isDark ? "#f8fafc" : "#111827" }}>
                  Avg. Listing Price:
                </Text>
                <Text strong style={{ color: isDark ? "#f8fafc" : "#111827" }}>
                  ${listingPrice} / day
                </Text>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 12,
                }}
              >
                <Text strong style={{ color: isDark ? "#f8fafc" : "#111827" }}>
                  Days rented / month:
                </Text>
                <Text strong style={{ color: isDark ? "#f8fafc" : "#111827" }}>
                  {daysRented} Days
                </Text>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 12,
                }}
              >
                <Text strong style={{ color: isDark ? "#f8fafc" : "#111827" }}>
                  Commission fee (3%):
                </Text>
                <Text strong style={{ color: "#ef4444" }}>
                  ${Math.round(listingPrice * daysRented * commissionRate)}
                </Text>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 18,
                  paddingTop: 14,
                  borderTop: isDark
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "1px solid rgba(15,23,42,0.08)",
                }}
              >
                <Text strong style={{ color: isDark ? "#f8fafc" : "#111827" }}>
                  Est. Profit / Item:
                </Text>
                <Text strong style={{ color: "#4f46e5", fontSize: 28 }}>
                  ${estimatedProfit}
                </Text>
              </div>
            </div>

            <div style={{ marginTop: 24 }}>
              <Button
                type="primary"
                block
                style={{
                  background: "#0f172a",
                  border: "none",
                  height: 48,
                  borderRadius: 10,
                  fontWeight: 700,
                }}
              >
                Recalculate Profit Map
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Analytics;
