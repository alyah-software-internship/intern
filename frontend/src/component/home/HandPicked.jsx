import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "../LanguageProvider.jsx";
import { useTheme } from "../../context/ThemeProvider.jsx";
import { useNavigate } from "react-router-dom";
import { Row, Col, Card, Typography, Button } from "antd";
import ItemCard from "./ItemCard.jsx";
import { AppContext } from "../../context/AppContext.jsx";
import { getCategoryImageUrl } from "../../config/categoryImage.js";

const { Text } = Typography;

const HandPicked = () => {
  const { translation: t } = useTranslation();
  const { theme } = useTheme();
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const isDark = theme === "dark";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    axios
      .get(`${backendUrl}/products/featured?limit=4`, {
        signal: controller.signal,
      })
      .then((response) => {
        setProducts(
          Array.isArray(response.data?.products) ? response.data.products : [],
        );
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [backendUrl]);

  const handpickedItems = products.map((product) => {
    const primaryImage =
      product.images?.find((image) => image.is_primary) || product.images?.[0];

    return {
      id: product.id,
      title: product.name,
      category: product.category?.name || "Uncategorized",
      vendor: product.vendor?.business_name || "Unknown vendor",
      rating: product.rating || 0,
      badge: "FEATURED",
      image: getCategoryImageUrl(primaryImage?.image_url, backendUrl),
      description: product.description || "No description available.",
      price: Number(product.price_daily || 0),
      accent: "#10b981",
      actionLabel: t.common?.rent || "Rent Now",
    };
  });

  const handleRentNow = (item) => {
    navigate(`/rentals/${item.id}`);
  };

  const handleSelectItem = (item) => {
    navigate(`/rentals/${item.id}`);
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
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 24,
        }}
      >
        <div style={{ minWidth: 0 }}>
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
            {t.home?.featuredSubtitle || "Handpicked rentals for you"}
          </Text>
          <Text
            style={{
              display: "block",
              color: isDark ? "#f8fafc" : "#0f172a",
              fontSize: 24,
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: 6,
            }}
          >
            {t.home?.featuredTitle || "Featured Products"}
          </Text>
        </div>

        <Button
          type="text"
          onClick={() => navigate("/rentals")}
          style={{ color: "#10b981", fontWeight: 700, padding: 0 }}
        >
          {t.common?.viewAll || "View All"}
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        {loading ? (
          <Col span={24}>
            <Text type="secondary">Loading featured products...</Text>
          </Col>
        ) : handpickedItems.length === 0 ? (
          <Col span={24}>
            <Text type="secondary">No featured products available.</Text>
          </Col>
        ) : (
          handpickedItems.map((item) => (
            <Col key={item.id} xs={24} sm={12} md={12} lg={6}>
              <ItemCard
                item={item}
                onAction={handleRentNow}
                onSelect={handleSelectItem}
              />
            </Col>
          ))
        )}
      </Row>
    </Card>
  );
};

export default HandPicked;
