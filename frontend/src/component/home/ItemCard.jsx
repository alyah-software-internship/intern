import React from "react";
import { Card, Typography, Button } from "antd";
import { HeartOutlined, StarFilled } from "@ant-design/icons";
import { useTranslation } from "../LanguageProvider.jsx";

const { Text } = Typography;

const ItemCard = ({ item, onAction, onSelect }) => {
  const { title, category, vendor, rating, badge, image, description, accent } =
    item;

  const { translation: t } = useTranslation();

  return (
    <Card
      hoverable
      styles={{ body: { padding: 16 } }}
      style={{ borderRadius: 24, overflow: "hidden", cursor: "pointer" }}
      onClick={() => onSelect?.(item)}
    >
      <div
        style={{ position: "relative", borderRadius: 20, overflow: "hidden" }}
      >
        <img
          src={image}
          alt={title}
          style={{ width: "100%", height: 200, objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            background: accent || "#10b981",
            color: "#fff",
            borderRadius: 999,
            padding: "6px 14px",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {badge}
        </div>
        <div
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            width: 38,
            height: 38,
            borderRadius: "50%",
            background: "rgba(15, 23, 42, 0.8)",
            display: "grid",
            placeItems: "center",
          }}
          onClick={(event) => {
            event.stopPropagation();
            onSelect?.(item);
          }}
        >
          <HeartOutlined style={{ color: "#fff", fontSize: 16 }} />
        </div>
      </div>

      <div style={{ marginTop: 16, marginBottom: 12 }}>
        <Text
          type="secondary"
          style={{
            display: "block",
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          {category}
        </Text>
        <Text strong style={{ display: "block", fontSize: 18, marginTop: 8 }}>
          {title}
        </Text>
      </div>

      <Text
        type="secondary"
        style={{ display: "block", marginBottom: 16, lineHeight: 1.6 }}
      >
        {description}
      </Text>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Text type="secondary" style={{ fontSize: 12, marginRight: 6 }}>
            {t.common?.vendor || "Vendor"}:
          </Text>
          <Text strong style={{ fontSize: 13 }}>
            {vendor}
          </Text>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <StarFilled style={{ color: "#f59e0b", fontSize: 16 }} />
          <div style={{ textAlign: "right" }}>
            <Text strong style={{ display: "block", fontSize: 16 }}>
              {rating}
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {t.common?.rating || "Rating"}
            </Text>
          </div>
        </div>
      </div>

      <Button
        type="primary"
        block
        style={{ borderRadius: 999, height: 44 }}
        onClick={(event) => {
          event.stopPropagation();
          onAction?.(item);
        }}
      >
        {t.common?.rent || "Rent Now"}
      </Button>
    </Card>
  );
};

export default ItemCard;
