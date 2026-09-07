import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Row, Col, Card, Typography, Button } from "antd";
import { useTranslation } from "../../component/LanguageProvider.jsx";
import { useTheme } from "../../context/ThemeProvider.jsx";
import { AppContext } from "../../context/AppContext.jsx";
import {
  getCategoryImageUrl,
  useFallbackImage,
} from "../../config/categoryImage.js";

const { Title, Text } = Typography;
const categoryCacheKey = "rentalCategories";

const readCategoryCache = () => {
  try {
    return JSON.parse(localStorage.getItem(categoryCacheKey) || "[]");
  } catch {
    return [];
  }
};

const Categories = () => {
  const { translation: t } = useTranslation();
  const { theme } = useTheme();
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const [categories, setCategories] = useState(readCategoryCache);
  const [loading, setLoading] = useState(
    () => readCategoryCache().length === 0,
  );
  const isDark = theme === "dark";
  const pageSurface = isDark ? "#111827" : "#ffffff";
  const pageSurfaceAlt = isDark ? "#0f172a" : "#f8fbff";
  const cardBorder = isDark
    ? "1px solid rgba(255,255,255,0.08)"
    : "1px solid rgba(15,23,42,0.08)";

  useEffect(() => {
    const controller = new AbortController();
    axios
      .get(`${backendUrl}/categories`, { signal: controller.signal })
      .then((response) => {
        const nextCategories = response.data.categories || [];
        setCategories(nextCategories);
        setLoading(false);
        localStorage.setItem(categoryCacheKey, JSON.stringify(nextCategories));
      })
      .catch(() => {
        if (readCategoryCache().length === 0) {
          setCategories([]);
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, [backendUrl]);

  const openCategory = (category) => {
    navigate(`/rentals?category=${encodeURIComponent(category.name)}`);
  };

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
              {t.home?.categoriesTitle}
            </Text>
            <Title
              style={{
                margin: 0,
                color: isDark ? "#f8fafc" : "#0f172a",
                lineHeight: 1.1,
              }}
            >
              {t.nav?.categories}
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
              {t.home?.categoriesSubtitle}
            </Text>
          </div>

          <Button
            type="primary"
            size="large"
            onClick={() => navigate("/rentals")}
            style={{ minWidth: 180, height: 46 }}
          >
            {t.home?.browseCategories}
          </Button>
        </div>

        <Row gutter={[24, 24]}>
          {loading ? (
            <Text>Loading categories...</Text>
          ) : (
            categories.map((category) => {
              const title = category.name;
              const description =
                category.description || "Explore rentals in this category.";

              return (
                <Col key={category.id} xs={24} sm={12} lg={8} xl={8}>
                  <Card
                    hoverable
                    styles={{ body: { padding: 24 } }}
                    onClick={() => openCategory(category)}
                    style={{
                      borderRadius: 24,
                      background: pageSurface,
                      border: cardBorder,
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
                      <img
                        src={getCategoryImageUrl(
                          category.image_url,
                          backendUrl,
                        )}
                        alt={title}
                        onError={useFallbackImage}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: 18,
                        }}
                      />
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
                        {category.products_count ?? 0}{" "}
                        {t.common?.items || "items"}
                      </Text>
                      <Button
                        type="default"
                        onClick={(event) => {
                          event.stopPropagation();
                          openCategory(category);
                        }}
                      >
                        {t.common?.viewAll}
                      </Button>
                    </div>
                  </Card>
                </Col>
              );
            })
          )}
        </Row>
      </div>
    </div>
  );
};

export default Categories;
