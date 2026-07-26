import React from "react";
import { Card, Row, Col, Avatar, Typography, Button } from "antd";
import { useTranslation } from "../LanguageProvider.jsx";
import { useTheme } from "../../context/ThemeProvider.jsx";

const { Text } = Typography;

const sample = [
  {
    id: 1,
    title: "HydraFacial MD Elite Professional System",
    categoryKey: "beauty",
    price: "$120/day",
  },
];

const Wishlist = () => {
  const { translation: t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Card
      style={{
        borderRadius: 12,
        padding: 18,
        marginTop: 16,
        background: isDark ? "#0b1220" : "#fff",
        border: isDark
          ? "1px solid rgba(255,255,255,0.06)"
          : "1px solid rgba(15,23,42,0.06)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <Text strong style={{ color: isDark ? "#f8fafc" : undefined }}>
          {t.home?.wishlist?.title ||
            t.home?.wishlistTitle ||
            "Your Saved Wishlist Items"}
        </Text>
        <div
          style={{
            background: "#fde8ef",
            color: "#ef4444",
            padding: "4px 8px",
            borderRadius: 999,
            fontSize: 12,
          }}
        >
          {sample.length} {t.home?.wishlist?.itemsLabel || "ITEMS"}
        </div>
      </div>

      {sample.map((it) => (
        <div
          key={it.id}
          style={{
            border: isDark
              ? "1px solid rgba(255,255,255,0.04)"
              : "1px solid rgba(15,23,42,0.06)",
            borderRadius: 12,
            padding: 12,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Avatar shape="square" size={64} src={null} />
          <div style={{ flex: 1 }}>
            <Text strong style={{ color: isDark ? "#f8fafc" : "#0f172a" }}>
              {it.title}
            </Text>
            <div>
              <Text
                style={{ color: isDark ? "#94a3b8" : "#6b7280", fontSize: 12 }}
              >
                {t.home?.recentlyViewed?.categories?.[it.categoryKey] ||
                  t.home?.search?.categories?.[it.categoryKey] ||
                  ""}
              </Text>
            </div>
            <div>
              <Text
                style={{ color: isDark ? "#94a3b8" : "#94a3b8", fontSize: 12 }}
              >
                {it.price}
              </Text>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Button type="text" danger>
              {t.home?.wishlist?.remove || t.common?.delete || "Remove"}
            </Button>
            <Button type="primary" style={{ borderRadius: 999 }}>
              {t.common?.rent || "Rent"}
            </Button>
          </div>
        </div>
      ))}
    </Card>
  );
};

export default Wishlist;
