import React from "react";
import { Card, Typography, Button, Row } from "antd";
import { HeartOutlined, StarFilled,  } from "@ant-design/icons";
import { useTranslation } from "../LanguageProvider.jsx";

const { Text } = Typography;

const ItemCard = ({ item, onAction, onSelect }) => {
  const {
    title,
    category,
    vendor,
    rating,
    badge,
    image,
    description,
    accent,
    price,
    location,
    actionLabel,
  } = item;

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
        {item.available !== undefined && (
          <div
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              borderRadius: 999,
              background: item.available ? "#10b981" : "#ef4444",
              color: "#ffffff",
              padding: "6px 14px",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {item.available
              ? t.products?.available || "AVAILABLE"
              : t.products?.unavailable || "UNAVAILABLE"}
          </div>
        )}
      </div>

      <div style={{ marginTop: 16, marginBottom: 12 }}>
        <Row className="flex justify-between">
          <div>
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

            <Text
              strong
              style={{ display: "block", fontSize: 18, marginTop: 8 }}
            >
              {title}
            </Text>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <StarFilled style={{ color: "#f59e0b", fontSize: 16 }} />
            <div className="flex items-center gap-2">
              <Text strong style={{ display: "block", fontSize: 16 }}>
                {rating}
              </Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {t.common?.rating || "Rating"}
              </Text>
            </div>
          </div>
        </Row>
        {location && (
          <Text type="secondary" style={{ display: "block", marginTop: 8 }}>
            {location}
          </Text>
        )}
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
        <div style={{ textAlign: "right" }} className="flex gap-2">
          <Text type="secondary" style={{ fontSize: 12, display: "block" }}>
            {t.common?.vendor || "Vendor"}
          </Text>
          <Text strong style={{ fontSize: 13 }}>
            {vendor}
          </Text>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      ></div>

      <div className="flex justify-around ">
        <div>
          <Text strong style={{ display: "block", fontSize: 20 }}>
            {price ? `$${price}/day` : "$250/day"}
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {t.home?.dailyRental || "Daily Rental"}
          </Text>
        </div>

        <Button
          type="primary"
          block
          style={{ borderRadius: 999, height: 44 , maxWidth:100}}
          onClick={(event) => {
            event.stopPropagation();
            onAction?.(item);
          }}
        >
          {actionLabel || t.common?.rent || "Rent Now"}
        </Button>
      </div>
    </Card>
  );
};

export default ItemCard;
