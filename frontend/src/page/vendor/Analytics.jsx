import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Row, Col, Card, Typography, Space, Button, Progress } from "antd";
import { useTheme } from "../../context/ThemeProvider.jsx";
import { formatVendorMoney } from "../../utils/currency.js";
import { AppContext } from "../../context/AppContext.jsx";

const { Title, Text } = Typography;

const defaultCategoryData = [
  {
    label: "No data yet",
    value: 0,
    percentage: "0 bookings (0%)",
    color: "#10b981",
  },
];

const Analytics = () => {
  const { theme } = useTheme();
  const { backendUrl } = useContext(AppContext);
  const isDark = theme === "dark";
  const [listingPrice] = useState(150);
  const [daysRented] = useState(18);
  const [commissionRate] = useState(0.03);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backendUrl}/vendor/analytics`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        setAnalytics(response.data?.analytics || null);
      } catch (error) {
        console.error("Failed to load analytics:", error);
        setAnalytics(null);
      } finally {
        setLoading(false);
      }
    };

    if (backendUrl) {
      fetchAnalytics();
    }
  }, [backendUrl]);

  const categoryData = useMemo(() => {
    if (
      !analytics?.popular_products ||
      analytics.popular_products.length === 0
    ) {
      return defaultCategoryData;
    }

    const maxViews = Math.max(
      ...analytics.popular_products.map((item) =>
        Number(item.views_count || 0),
      ),
    );

    return analytics.popular_products.map((product, index) => {
      const views = Number(product.views_count || 0);
      const percent = maxViews > 0 ? Math.round((views / maxViews) * 100) : 0;
      const colors = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899"];

      return {
        label: product.name || `Product ${index + 1}`,
        value: views,
        percentage: `${views} views (${percent}%)`,
        color: colors[index % colors.length],
      };
    });
  }, [analytics]);

  const totalViews = Number(analytics?.total_views ?? 0);
  const totalBookings = Number(analytics?.total_bookings ?? 0);
  const averageRating = Number(analytics?.average_rating ?? 0);
  const completionRate = Number(analytics?.completion_rate ?? 0);
  const responseTime = Number(analytics?.response_time ?? 0);
  const conversionRate = Number(analytics?.conversion_rate ?? 0);

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

            <Space orientation="vertical" size={18} style={{ width: "100%" }}>
              {loading ? (
                <Text style={{ color: isDark ? "#94a3b8" : "#64748b" }}>
                  Loading analytics...
                </Text>
              ) : (
                categoryData.map((item) => (
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
                      percent={item.value === 0 ? 0 : Math.min(item.value, 100)}
                      showInfo={false}
                      strokeColor={item.color}
                      trailColor={isDark ? "#1e293b" : "#dbeafe"}
                      style={{ marginBottom: 2 }}
                    />
                  </div>
                ))
              )}
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
                  Total Views:
                </Text>
                <Text strong style={{ color: isDark ? "#f8fafc" : "#111827" }}>
                  {totalViews}
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
                  Total Bookings:
                </Text>
                <Text strong style={{ color: isDark ? "#f8fafc" : "#111827" }}>
                  {totalBookings}
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
                  Conversion Rate:
                </Text>
                <Text strong style={{ color: "#10b981" }}>
                  {conversionRate}%
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
                  Avg. Rating:
                </Text>
                <Text strong style={{ color: isDark ? "#f8fafc" : "#111827" }}>
                  {averageRating.toFixed(1)} / 5
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
                  Completion Rate:
                </Text>
                <Text strong style={{ color: isDark ? "#f8fafc" : "#111827" }}>
                  {completionRate}%
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
                  Avg. Response Time:
                </Text>
                <Text strong style={{ color: isDark ? "#f8fafc" : "#111827" }}>
                  {responseTime}h
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
                  {formatVendorMoney(estimatedProfit)}
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
