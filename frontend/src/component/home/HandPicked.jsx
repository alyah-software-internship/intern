import React from "react";
import { useTranslation } from "../LanguageProvider.jsx";
import { useTheme } from "../../context/ThemeProvider.jsx";
import { Row, Col, Card, Typography, Button } from "antd";
import ItemCard from "./ItemCard.jsx";
import excavatorImage from "../../assets/excavator.png";
import beautyImage from "../../assets/buety.png";
import carImage from "../../assets/car.png";
import weddingImage from "../../assets/wedding.png";

const { Text } = Typography;

const handpickedItems = [
  {
    id: "item-1",
    title: "Compact Excavator",
    category: "Construction & Tools",
    vendor: "Titan Heavy Rentals",
    rating: "4.8",
    badge: "Popular",
    image: excavatorImage,
    accent: "#f59e0b",
    description:
      "High performance in a compact size. The Caterpillar 301.8 Mini Excavator delivers reliable power and speed.",
  },
  {
    id: "item-2",
    title: "Beauty & Wellness Kit",
    category: "Beauty & Wellness",
    vendor: "GlowTech Aesthetic Suites",
    rating: "4.9",
    badge: "Premium",
    image: beautyImage,
    accent: "#2563eb",
    description:
      "The premier aesthetic skincare system preferred by medical spas worldwide.",
  },
  {
    id: "item-3",
    title: "Agriculture Tractor",
    category: "Agriculture & Tractors",
    vendor: "GreenField Agri Services",
    rating: "4.7",
    badge: "Verified",
    image: carImage,
    accent: "#10b981",
    description:
      "The ultimate utility tractor for landowners, small farms, and commercial landscape projects.",
  },
  {
    id: "item-4",
    title: "Event Sound System",
    category: "Event Management",
    vendor: "SoundVibe Event Gear",
    rating: "4.6",
    badge: "Fast Escrow",
    image: weddingImage,
    accent: "#8b5cf6",
    description:
      "Elevate your outdoor event with this high-peak elegant canopy and complete sound setup.",
  },
];

const HandPicked = () => {
  const { translation: t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleRentNow = (item) => {
    console.log("Rent now clicked for", item.title);
  };

  const handleSelectItem = (item) => {
    console.log("Selected item", item.title);
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
          style={{ color: "#10b981", fontWeight: 700, padding: 0 }}
        >
          {t.common?.viewAll || "View All"}
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        {handpickedItems.map((item) => (
          <Col key={item.id} xs={24} sm={12} md={12} lg={6}>
            <ItemCard
              item={item}
              onAction={handleRentNow}
              onSelect={handleSelectItem}
            />
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default HandPicked;
