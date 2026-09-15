import React, { useContext } from "react";
import { Card, Avatar, Typography } from "antd";
import { useTranslation } from "../LanguageProvider.jsx";
import { useTheme } from "../../context/ThemeProvider.jsx";
import { AppContext } from "../../context/AppContext.jsx";
import excavatorImage from "../../assets/excavator.png";
import carImage from "../../assets/car.png";

const { Text } = Typography;

const sample = [
  {
    id: 1,
    title: "Caterpillar 301.8 Mini Excavator",
    categoryKey: "construction",
    price: 250,
    image: excavatorImage,
  },
  {
    id: 2,
    title: "John Deere 1025R Sub-Compact Tractor",
    categoryKey: "agriculture",
    price: 180,
    image: carImage,
  },
];

const RecentlyViewed = () => {
  const { translation: t } = useTranslation();
  const { theme } = useTheme();
  const { currency } = useContext(AppContext);
  const isDark = theme === "dark";

  return (
    <Card
      style={{
        borderRadius: 12,
        padding: 2,
        background: isDark ? "#0b1220" : "#fff",
        border: isDark
          ? "1px solid rgba(255,255,255,0.06)"
          : "1px solid rgba(15,23,42,0.06)",
      }}
    >
      <Text
        strong
        style={{
          display: "block",
          marginBottom: 12,
          color: isDark ? "#f8fafc" : undefined,
        }}
      >
        {t.home?.recentlyViewedTitle || "Recently Viewed Items"}
      </Text>

      {sample.map((item) => (
        <div
          key={item.id}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 10,
            borderRadius: 10,
            marginBottom: 10,
            background: isDark ? "rgba(255,255,255,0.02)" : "#f8fafc",
            border: isDark
              ? "1px solid rgba(255,255,255,0.04)"
              : "1px solid rgba(15,23,42,0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar shape="square" size={48} src={item.image} />
            <div>
              <Text strong style={{ color: isDark ? "#f8fafc" : undefined }}>
                {item.title}
              </Text>
              <div>
                <Text
                  style={{
                    color: isDark ? "#94a3b8" : "#6b7280",
                    fontSize: 13,
                  }}
                >
                  {t.home?.recentlyViewed?.categories?.[item.categoryKey] ||
                    t.home?.search?.categories?.[item.categoryKey] ||
                    ""}
                </Text>
              </div>
            </div>
          </div>

          <Text style={{ color: "#10b981", fontWeight: 700 }}>
            {currency} {item.price.toLocaleString()}/day
          </Text>
        </div>
      ))}

      <div style={{ marginTop: 12 }}>
        <div
          style={{ borderTop: "1px solid rgba(15,23,42,0.06)", paddingTop: 12 }}
        />
        <Text
          style={{
            display: "block",
            color: isDark ? "#94a3b8" : "#6b7280",
            fontSize: 12,
            marginTop: 12,
          }}
        >
          {t.home?.recentlyViewed?.continueBrowsing ||
            t.home?.recentlyViewedTitle}
        </Text>

        <div
          style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}
        >
          <button
            style={{
              padding: "8px 12px",
              borderRadius: 20,
              background: isDark ? "rgba(255,255,255,0.04)" : "#eef7ff",
              border: "none",
              cursor: "pointer",
            }}
          >
            {t.home?.recentlyViewed?.buttons?.construction ||
              "Construction & Tools"}
          </button>

          <button
            style={{
              padding: "8px 12px",
              borderRadius: 20,
              background: isDark ? "rgba(255,255,255,0.04)" : "#eef7ff",
              border: "none",
              cursor: "pointer",
            }}
          >
            {t.home?.recentlyViewed?.buttons?.beauty || "Beauty & Wellness"}
          </button>
        </div>
      </div>
    </Card>
  );
};

export default RecentlyViewed;
