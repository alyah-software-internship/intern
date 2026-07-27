import React from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Card, Typography, Button } from "antd";
import { useTranslation } from "../../component/LanguageProvider.jsx";
import { useTheme } from "../../context/ThemeProvider.jsx";
import { categories } from "../../assets/dummyAssets";

const { Title, Text } = Typography;

const Categories = () => {
  const { translation: t, lang } = useTranslation();
  const { theme } = useTheme();
  const navigate = useNavigate();
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
            alignItems: "flex-start",
            gap: 24,
            flexWrap: "wrap",
            marginBottom: 32,
          }}
        >
          <div style={{ maxWidth: 680 }}>
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
              {t.home?.categoriesTitle || "Browse Categories"}
            </Text>
            <Title
              style={{
                margin: 0,
                color: isDark ? "#f8fafc" : "#0f172a",
                lineHeight: 1.1,
              }}
            >
              {t.nav?.categories || "Categories"}
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
              {t.home?.categoriesSubtitle ||
                "Find the perfect rental in any category."}
            </Text>
          </div>

          <Button
            type="primary"
            size="large"
            onClick={() => navigate("/rentals")}
            style={{ minWidth: 180, height: 46 }}
          >
            {t.home?.browseCategories || "Explore All Categories"}
          </Button>
        </div>

        <Row gutter={[24, 24]}>
          {categories.map((category) => {
            const title = lang === "am" ? category.nameAm : category.name;
            const description =
              lang === "am" ? category.descriptionAm : category.description;

            return (
              <Col key={category.id} xs={24} sm={12} lg={8} xl={8}>
                <Card
                  hoverable
                  bodyStyle={{ padding: 24 }}
                  style={{
                    borderRadius: 24,
                    background: isDark ? "#0f172a" : "#fff",
                    border: isDark
                      ? "1px solid rgba(255,255,255,0.08)"
                      : "1px solid rgba(15,23,42,0.08)",
                  }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 18,
                      background: "rgba(22, 163, 74, 0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 22,
                      fontSize: 24,
                    }}
                  >
                    {category.icon}
                  </div>

                  <Text
                    strong
                    style={{
                      display: "block",
                      fontSize: 18,
                      marginBottom: 10,
                      color: isDark ? "#f8fafc" : "#0f172a",
                    }}
                  >
                    {title}
                  </Text>

                  <Text
                    style={{
                      display: "block",
                      marginBottom: 18,
                      color: isDark ? "#cbd5e1" : "#64748b",
                      lineHeight: 1.7,
                    }}
                  >
                    {description}
                  </Text>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <Text
                      strong
                      style={{ color: isDark ? "#d1fae5" : "#16a34a" }}
                    >
                      {category.count} {t.common?.items || "items"}
                    </Text>
                    <Button type="default" onClick={() => navigate("/rentals")}>
                      {t.common?.viewAll || "View All"}
                    </Button>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
};

export default Categories;
