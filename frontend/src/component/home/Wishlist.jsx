import React from "react";
import { Card, Avatar, Typography, Button } from "antd";
import { useTranslation } from "../LanguageProvider.jsx";
import { useTheme } from "../../context/ThemeProvider.jsx";
import wishlistImage from "../../assets/buety.png";

const { Text } = Typography;

const sample = [
  {
    id: 1,
    title: "HydraFacial MD Elite Professional System",
    categoryKey: "beauty",
    price: "$120/day",
    image: wishlistImage,
  },
];

const Wishlist = () => {
  const { translation: t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const updateMobile = () => setIsMobile(window.innerWidth < 768);
    updateMobile();
    window.addEventListener("resize", updateMobile);
    return () => window.removeEventListener("resize", updateMobile);
  }, []);

  return (
    <Card
      style={{
        borderRadius: 22,
        padding: isMobile ? 14 : 18,
        marginTop: isMobile ? 12 : 16,
        background: isDark ? "#0b1220" : "#fff",
        border: isDark
          ? "1px solid rgba(255,255,255,0.06)"
          : "1px solid rgba(15,23,42,0.06)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "flex-start" : "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: isMobile ? 10 : 14,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "rgba(239,68,68,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ef4444",
              fontSize: 16,
            }}
          >
            ♥
          </div>
          <div>
            <Text
              strong
              style={{
                color: isDark ? "#f8fafc" : "#0f172a",
                fontSize: 15,
              }}
            >
              {t.home?.wishlist?.title ||
                t.home?.wishlistTitle ||
                "Your Saved Wishlist"}
            </Text>
            <div>
              <Text
                style={{
                  color: isDark ? "#94a3b8" : "#6b7280",
                  fontSize: 12,
                }}
              >
                {t.home?.wishlist?.subtitle || "Items"}
              </Text>
            </div>
          </div>
        </div>
        <div
          style={{
            background: isDark ? "rgba(52,211,153,0.14)" : "#dcfce7",
            color: isDark ? "#34d399" : "#16a34a",
            padding: "6px 12px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 700,
            minWidth: 72,
            textAlign: "center",
          }}
        >
          {sample.length} {t.home?.wishlist?.itemsLabel || "ITEMS"}
        </div>
      </div>

      <div
        style={{
          height: 1,
          background: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)",
          marginBottom: isMobile ? 10 : 14,
        }}
      />

      {sample.map((it) => (
        <div
          key={it.id}
          style={{
            borderRadius: 20,
            padding: isMobile ? 14 : 16,
            background: isDark ? "rgba(255,255,255,0.04)" : "#f8fafc",
            border: isDark
              ? "1px solid rgba(255,255,255,0.06)"
              : "1px solid rgba(15,23,42,0.1)",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: "center",
            gap: isMobile ? 12 : 16,
            marginBottom: isMobile ? 10 : 12,
          }}
        >
          <Avatar
            shape="square"
            size={isMobile ? 60 : 72}
            src={it.image}
            style={{
              background: isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0",
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <Text
              strong
              style={{
                display: "block",
                color: isDark ? "#f8fafc" : "#0f172a",
                fontSize: 14,
                marginBottom: 6,
              }}
            >
              {it.title}
            </Text>
            <Text
              style={{
                display: "block",
                color: isDark ? "#94a3b8" : "#6b7280",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                marginBottom: 6,
              }}
            >
              {t.home?.recentlyViewed?.categories?.[it.categoryKey] ||
                t.home?.search?.categories?.[it.categoryKey] ||
                ""}
            </Text>
            <Text
              style={{
                display: "block",
                color: isDark ? "#94a3b8" : "#6b7280",
                fontSize: 12,
              }}
            >
              {it.price}
            </Text>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "row" : "column",
              width: isMobile ? "100%" : "auto",
              justifyContent: isMobile ? "space-between" : "flex-end",
              gap: 8,
            }}
          >
            <Button
              type="text"
              danger
              style={{
                width: isMobile ? "48%" : "100%",
                padding: isMobile ? "8px 0" : "8px 16px",
              }}
            >
              {t.home?.wishlist?.remove || t.common?.delete || "Remove"}
            </Button>
            <Button
              type="primary"
              style={{
                borderRadius: 999,
                width: isMobile ? "48%" : "100%",
                padding: isMobile ? "8px 0" : "8px 16px",
              }}
            >
              {t.common?.rent || "Rent"}
            </Button>
          </div>
        </div>
      ))}
    </Card>
  );
};

export default Wishlist;
