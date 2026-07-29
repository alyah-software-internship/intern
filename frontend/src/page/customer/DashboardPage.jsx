import React from "react";
import { Row, Col, Card, Typography, Space, Button, List } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../component/LanguageProvider.jsx";
import { useTheme } from "../../context/ThemeProvider.jsx";

const { Title, Text, Paragraph } = Typography;

const DashboardPage = () => {
  const navigate = useNavigate();
  const { translation: t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const quickActions = [
    {
      title: t.home?.dashboardButtons?.browseRentals || "Browse Rentals",
      description:
        t.home?.dashboardShortcutsSubtitle ||
        "Search available rentals and book what you need today.",
      path: "/rentals",
    },
    {
      title: t.home?.dashboardButtons?.becomeVendor || "Become a Vendor",
      description: "Start listing your assets and grow your rental business.",
      path: "/vendor",
    },
    {
      title: t.home?.dashboardButtons?.viewBookings || "View Bookings",
      description: "Review your upcoming rentals and manage your schedule.",
      path: "/bookings",
    },
  ];

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
            marginBottom: 32,
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
              {t.nav?.dashboard || "Dashboard"}
            </Text>
            <Title
              style={{
                margin: 0,
                color: isDark ? "#f8fafc" : "#0f172a",
                lineHeight: 1.1,
              }}
            >
              {t.home?.dashboardWelcome || "Welcome back"}{" "}
              <Text style={{ color: "#2563eb" }}>
                {t.home?.dashboardWelcomeName || "Marcus!"}
              </Text>
            </Title>
            <Paragraph
              style={{
                marginTop: 16,
                color: isDark ? "#cbd5e1" : "#475569",
                fontSize: 16,
                lineHeight: 1.8,
              }}
            >
              {t.home?.dashboardShortcutsSubtitle ||
                "Access your activity summary, manage bookings, and explore rentals."}
            </Paragraph>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Button type="default" onClick={() => navigate("/rentals")}>
              {t.home?.dashboardButtons?.browseRentals || "Browse Rentals"}
            </Button>
            <Button type="primary" onClick={() => navigate("/bookings")}>
              {t.home?.dashboardButtons?.viewBookings || "View Bookings"}
            </Button>
          </div>
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <Card
                  style={{
                    borderRadius: 24,
                    background: isDark ? "#0f172a" : "#fff",
                    border: isDark
                      ? "1px solid rgba(255,255,255,0.08)"
                      : "1px solid rgba(15,23,42,0.08)",
                  }}
                >
                  <Text
                    strong
                    style={{
                      display: "block",
                      marginBottom: 10,
                      color: isDark ? "#94a3b8" : "#6b7280",
                    }}
                  >
                    {t.home?.yourActiveBookings || "Your Active Bookings"}
                  </Text>
                  <Title
                    level={2}
                    style={{ color: isDark ? "#f8fafc" : "#0f172a" }}
                  >
                    {t.home?.yourActiveBookingsCount || "4 contracts"}
                  </Title>
                  <Paragraph
                    style={{
                      color: isDark ? "#cbd5e1" : "#475569",
                      margin: 0,
                    }}
                  >
                    {
                      "Track the rentals you currently have in progress and stay on top of deadlines."
                    }
                  </Paragraph>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card
                  style={{
                    borderRadius: 24,
                    background: isDark ? "#0f172a" : "#fff",
                    border: isDark
                      ? "1px solid rgba(255,255,255,0.08)"
                      : "1px solid rgba(15,23,42,0.08)",
                  }}
                >
                  <Text
                    strong
                    style={{
                      display: "block",
                      marginBottom: 10,
                      color: isDark ? "#94a3b8" : "#6b7280",
                    }}
                  >
                    {t.home?.wishlistTitle || "Your Saved Wishlist Items"}
                  </Text>
                  <Title
                    level={2}
                    style={{ color: isDark ? "#f8fafc" : "#0f172a" }}
                  >
                    {"3 saved items"}
                  </Title>
                  <Paragraph
                    style={{
                      color: isDark ? "#cbd5e1" : "#475569",
                      margin: 0,
                    }}
                  >
                    {
                      "Keep your favorite rentals handy and book them when you're ready."
                    }
                  </Paragraph>
                </Card>
              </Col>
            </Row>

            <Card
              style={{
                borderRadius: 24,
                background: isDark ? "#0f172a" : "#fff",
                border: isDark
                  ? "1px solid rgba(255,255,255,0.08)"
                  : "1px solid rgba(15,23,42,0.08)",
              }}
            >
              <Space orientation="vertical" size={18} style={{ width: "100%" }}>
                <Text
                  strong
                  style={{
                    display: "block",
                    fontSize: 16,
                    color: isDark ? "#f8fafc" : "#0f172a",
                  }}
                >
                  {t.home?.recentlyViewedTitle || "Recently Viewed Items"}
                </Text>
                <Paragraph
                  style={{
                    margin: 0,
                    color: isDark ? "#cbd5e1" : "#475569",
                  }}
                >
                  {
                    "Review items you were browsing recently so you can quickly return to the best fit."
                  }
                </Paragraph>
                <Row gutter={[16, 16]}>
                  {[
                    {
                      category:
                        t.home?.recentlyViewed?.categories?.construction ||
                        "Construction & Tools",
                      badge:
                        t.home?.recentlyViewed?.buttons?.construction ||
                        "Construction & Tools",
                    },
                    {
                      category:
                        t.home?.recentlyViewed?.categories?.agriculture ||
                        "Agriculture & Tractors",
                      badge:
                        t.home?.recentlyViewed?.buttons?.beauty ||
                        "Beauty & Wellness",
                    },
                  ].map((item, index) => (
                    <Col xs={24} md={12} key={index}>
                      <Card
                        type="inner"
                        style={{
                          borderRadius: 20,
                          border: isDark
                            ? "1px solid rgba(255,255,255,0.08)"
                            : "1px solid rgba(15,23,42,0.08)",
                          background: isDark ? "#081122" : "#f8fbff",
                        }}
                      >
                        <Text
                          strong
                          style={{
                            display: "block",
                            marginBottom: 8,
                            color: isDark ? "#f8fafc" : "#0f172a",
                          }}
                        >
                          {item.category}
                        </Text>
                        <Text
                          style={{
                            color: isDark ? "#94a3b8" : "#64748b",
                          }}
                        >
                          {item.badge}
                        </Text>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Space>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card
              style={{
                borderRadius: 24,
                background: isDark ? "#0f172a" : "#fff",
                border: isDark
                  ? "1px solid rgba(255,255,255,0.08)"
                  : "1px solid rgba(15,23,42,0.08)",
              }}
            >
              <Space orientation="vertical" size={20} style={{ width: "100%" }}>
                <Title
                  level={4}
                  style={{
                    margin: 0,
                    color: isDark ? "#f8fafc" : "#0f172a",
                  }}
                >
                  {"Quick Actions"}
                </Title>
                <List
                  dataSource={quickActions}
                  renderItem={(item) => (
                    <List.Item
                      style={{
                        padding: 0,
                        border: "none",
                        margin: 0,
                      }}
                    >
                      <Card
                        onClick={() => navigate(item.path)}
                        style={{
                          width: "100%",
                          borderRadius: 20,
                          cursor: "pointer",
                          background: isDark ? "#081122" : "#f8fbff",
                          border: isDark
                            ? "1px solid rgba(255,255,255,0.08)"
                            : "1px solid rgba(15,23,42,0.08)",
                        }}
                      >
                        <Text
                          strong
                          style={{
                            display: "block",
                            color: isDark ? "#f8fafc" : "#0f172a",
                          }}
                        >
                          {item.title}
                        </Text>
                        <Text
                          style={{
                            color: isDark ? "#94a3b8" : "#64748b",
                          }}
                        >
                          {item.description}
                        </Text>
                      </Card>
                    </List.Item>
                  )}
                />
                <Button type="primary" block>
                  {t.home?.dashboardButtons?.viewBookings || "View Bookings"}
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default DashboardPage;
