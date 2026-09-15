import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, Avatar, Typography, Button, Empty } from "antd";
import { useTranslation } from "../LanguageProvider.jsx";
import { useTheme } from "../../context/ThemeProvider.jsx";
import { AppContext } from "../../context/AppContext.jsx";

const { Text } = Typography;
const authConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
});

const getImageUrl = (product) => {
  const image =
    product?.images?.find((entry) => entry.is_primary) || product?.images?.[0];
  return image?.image_url || "/logo.png";
};
const wishlistCacheKey = "customerWishlist";

const readWishlistCache = () => {
  try {
    return JSON.parse(localStorage.getItem(wishlistCacheKey) || "[]");
  } catch {
    return [];
  }
};

const Wishlist = () => {
  const { translation: t } = useTranslation();
  const { theme } = useTheme();
  const { backendUrl, currency } = useContext(AppContext);
  const isDark = theme === "dark";
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [items, setItems] = useState(readWishlistCache);
  const [loading, setLoading] = useState(
    () => readWishlistCache().length === 0,
  );

  const itemCount = items.length;

  const loadWishlist = useCallback(async () => {
    const hasCache = readWishlistCache().length > 0;
    if (!hasCache) setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/wishlist`, authConfig());
      const wishlist = response.data.wishlist || [];
      const nextItems = wishlist.map((entry) => ({
        id: entry.product_id,
        title: entry.product?.name || "Unnamed rental",
        category: entry.product?.category?.name || "Uncategorized",
        price: Number(entry.product?.price_daily || 0),
        image: getImageUrl(entry.product),
      }));
      setItems(nextItems);
      localStorage.setItem(wishlistCacheKey, JSON.stringify(nextItems));
    } finally {
      setLoading(false);
    }
  }, [backendUrl]);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        await loadWishlist();
      } catch {
        setItems([]);
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [loadWishlist]);

  useEffect(() => {
    const updateMobile = () => setIsMobile(window.innerWidth < 768);
    updateMobile();
    window.addEventListener("resize", updateMobile);
    return () => window.removeEventListener("resize", updateMobile);
  }, []);

  const handleRemove = useCallback(
    async (id) => {
      try {
        await axios.delete(`${backendUrl}/wishlist/${id}`, authConfig());
        setItems((prev) => {
          const nextItems = prev.filter((item) => item.id !== id);
          localStorage.setItem(wishlistCacheKey, JSON.stringify(nextItems));
          return nextItems;
        });
      } catch {
        await loadWishlist();
      }
    },
    [backendUrl, loadWishlist],
  );

  const handleRent = useCallback(
    (id) => {
      navigate(`/rentals/${id}`);
    },
    [navigate],
  );

  const content = useMemo(() => {
    if (itemCount === 0) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: 32,
          }}
        >
          <Empty
            description={
              t.home?.wishlist?.emptyMessage || "Your wishlist is empty."
            }
          />
        </div>
      );
    }

    return items.map((item) => (
      <div
        key={item.id}
        onClick={() => navigate(`/rentals/${item.id}`)}
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
          cursor: "pointer",
        }}
      >
        <Avatar
          shape="square"
          size={isMobile ? 60 : 72}
          src={item.image}
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
            {item.title}
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
            {item.category}
          </Text>
          <Text
            style={{
              display: "block",
              color: isDark ? "#94a3b8" : "#6b7280",
              fontSize: 12,
            }}
          >
            {currency} {item.price.toLocaleString()} / day
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
            onClick={(e) => {
              e.stopPropagation();
              handleRemove(item.id);
            }}
            style={{
              width: isMobile ? "48%" : "100%",
              padding: isMobile ? "8px 0" : "8px 16px",
            }}
          >
            {t.home?.wishlist?.remove || t.common?.delete || "Remove"}
          </Button>
          <Button
            type="primary"
            onClick={(e) => {
              e.stopPropagation();
              handleRent(item.id);
            }}
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
    ));
  }, [
    handleRemove,
    handleRent,
    itemCount,
    items,
    isDark,
    isMobile,
    t.common,
    t.home,
    navigate,
  ]);

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
          {itemCount} {t.home?.wishlist?.itemsLabel || "ITEMS"}
        </div>
      </div>

      <div
        style={{
          height: 1,
          background: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)",
          marginBottom: isMobile ? 10 : 14,
        }}
      />

      {loading ? <Text>Loading wishlist...</Text> : content}
    </Card>
  );
};

export default Wishlist;
