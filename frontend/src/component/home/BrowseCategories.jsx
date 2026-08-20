import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Card, Row, Col, Typography, Button } from "antd";
import { useTranslation } from "../LanguageProvider.jsx";
import { useTheme } from "../../context/ThemeProvider.jsx";
import { AppContext } from "../../context/AppContext.jsx";

const { Text } = Typography;

const BrowseCategories = () => {
  const { translation: t } = useTranslation();
  const { theme } = useTheme();
  const { backendUrl } = useContext(AppContext);
  const isDark = theme === "dark";
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get(`${backendUrl}/categories`)
      .then((response) => setCategories(response.data.categories || []))
      .catch(() => setCategories([]));
  }, [backendUrl]);

  const categoryImage = (category) => {
    if (!category.image_url) return "/logo.png";
    if (category.image_url.startsWith("http")) return category.image_url;
    const apiBase = backendUrl.replace(/\/api\/?$/, "");
    return `${apiBase}/storage/${category.image_url.replace(/^\/+/, "")}`;
  };

  return (
    <Card
      style={{
        borderRadius: 24,
        padding: 24,
        background: isDark ? "#0b1220" : "#ffffff",
        border: isDark
          ? "1px solid rgba(255,255,255,0.08)"
          : "1px solid rgba(15,23,42,0.08)",
        boxShadow: isDark
          ? "0 20px 60px rgba(0,0,0,0.08)"
          : "0 16px 40px rgba(15,23,42,0.08)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          alignItems: "center",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <div>
          <Text
            strong
            style={{
              textTransform: "uppercase",
              letterSpacing: "0.24em",
              color: "#16a34a",
              fontSize: 12,
              display: "block",
              marginBottom: 8,
            }}
          >
            {t.home?.categoriesTitle || "Browse Categories"}
          </Text>
          <Text
            style={{
              display: "block",
              color: isDark ? "#f8fafc" : "#0f172a",
              fontSize: 20,
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: 6,
            }}
          >
            {t.home?.categoriesTitle || "Browse Categories"}
          </Text>
          <Text
            style={{
              color: isDark ? "#94a3b8" : "#475569",
              fontSize: 14,
              lineHeight: 1.7,
            }}
          >
            {t.home?.categoriesSubtitle ||
              "Secure asset leasing options across diverse professional industries in Ethiopia"}
          </Text>
        </div>

        <div style={{ justifySelf: "end" }}>
          <Button
            type="text"
            style={{
              color: "#10b981",
              fontWeight: 700,
              padding: 0,
            }}
          >
            {t.home?.browseCategories || "Explore All Categories"}
          </Button>
        </div>
      </div>

      <Row gutter={[16, 16]}>
        {categories.map((category) => {
          const title = category.name;
          const subtitle = category.description || "Explore available rentals.";

          return (
            <Col key={category.id} xs={24} sm={12} md={12} lg={6} xl={6}>
              <div
                style={{
                  borderRadius: 18,
                  minHeight: 160,
                  padding: 18,
                  background: isDark ? "rgba(255,255,255,0.03)" : "#f8fafc",
                  border: isDark
                    ? "1px solid rgba(255,255,255,0.04)"
                    : "1px solid rgba(15,23,42,0.08)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: 16,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    background: category.accent + "1A",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={categoryImage(category)}
                    alt={title}
                    style={{ width: 28, height: 28, objectFit: "contain" }}
                  />
                </div>

                <div>
                  <Text
                    strong
                    style={{
                      display: "block",
                      color: isDark ? "#f8fafc" : "#0f172a",
                      fontSize: 14,
                      marginBottom: 8,
                    }}
                  >
                    {title}
                  </Text>
                  <Text
                    style={{
                      color: isDark ? "#94a3b8" : "#6b7280",
                      fontSize: 12,
                    }}
                  >
                    {subtitle}
                  </Text>
                </div>

                <Text
                  strong
                  style={{
                    color: isDark ? "#10b981" : "#059669",
                    fontSize: 12,
                  }}
                >
                  {t.common?.rent || "Rent Now"} →
                </Text>
              </div>
            </Col>
          );
        })}
      </Row>
    </Card>
  );
};

export default BrowseCategories;
