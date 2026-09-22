import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import axios from "axios";
import { Card, Typography, Button, Row, message } from "antd";
import { HeartFilled, HeartOutlined, StarFilled } from "@ant-design/icons";
import { useTranslation } from "../LanguageProvider.jsx";
import { AppContext } from "../../context/AppContext.jsx";
import { useFallbackImage } from "../../config/categoryImage.js";

const { Text } = Typography;

const ItemCard = ({ item, onAction, onSelect, equalHeight = false }) => {
  const {
    title,
    category,
    vendor,
    rating,
    badge,
    image,
    description: rawDescription,
    accent,
    price,
    location,
    actionLabel,
  } = item;
  const description = rawDescription || "No description available.";

  const { translation: t } = useTranslation();
  const { backendUrl, currency } = useContext(AppContext);
  const [isFavorite, setIsFavorite] = useState(Boolean(item.isFavorite));
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [descriptionOverflowing, setDescriptionOverflowing] = useState(false);
  const descriptionRef = useRef(null);
  const [messageApi, contextHolder] = message.useMessage();

  useLayoutEffect(() => {
    if (!equalHeight || !descriptionRef.current) return;

    setDescriptionOverflowing(
      descriptionRef.current.scrollHeight > descriptionRef.current.clientHeight,
    );
  }, [description, descriptionExpanded, equalHeight]);

  const canExpandDescription = equalHeight && descriptionOverflowing;
  const descriptionId = `rental-description-${item.id}`;

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token || !Number.isFinite(Number(item.id))) return;

    axios
      .get(`${backendUrl}/wishlist/check/${item.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setIsFavorite(Boolean(response.data.in_wishlist)))
      .catch(() => undefined);
  }, [backendUrl, item.id]);

  const handleFavorite = async (event) => {
    event.stopPropagation();
    const token = localStorage.getItem("authToken");
    if (!token) {
      messageApi.info("Please sign in to save favorites.");
      return;
    }
    if (!Number.isFinite(Number(item.id))) {
      messageApi.error("This item cannot be saved yet.");
      return;
    }

    setFavoriteLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/wishlist/toggle/${item.id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setIsFavorite(Boolean(response.data.in_wishlist));
      messageApi.success(response.data.message);
      item.onFavorite?.(item, response.data.in_wishlist);
    } catch (error) {
      messageApi.error(
        error.response?.data?.message || "Unable to update favorites.",
      );
    } finally {
      setFavoriteLoading(false);
    }
  };

  return (
    <Card
      hoverable
      className={equalHeight ? "rental-product-card" : undefined}
      styles={{
        body: {
          display: "flex",
          flexDirection: "column",
          height: equalHeight && !descriptionExpanded ? "100%" : "auto",
          padding: 16,
        },
      }}
      style={{
        borderRadius: 24,
        overflow: "hidden",
        cursor: "pointer",
        height: equalHeight && !descriptionExpanded ? 610 : "auto",
      }}
      onClick={() => onSelect?.(item)}
    >
      {contextHolder}
      <div
        className={equalHeight ? "rental-product-image" : undefined}
        style={{
          position: "relative",
          width: "100%",
          height: 200,
          flexShrink: 0,
          borderRadius: 20,
          overflow: "hidden",
        }}
      >
        <img
          src={image}
          alt={title}
          onError={useFallbackImage}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
        <button
          type="button"
          aria-label={
            isFavorite
              ? `Remove ${title} from favorites`
              : `Add ${title} to favorites`
          }
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          onClick={handleFavorite}
          disabled={favoriteLoading}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            width: 40,
            height: 40,
            display: "grid",
            placeItems: "center",
            border: "none",
            borderRadius: "50%",
            background: isFavorite ? "#ef4444" : "rgba(255,255,255,0.92)",
            color: isFavorite ? "#ffffff" : "#64748b",
            fontSize: 20,
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(15,23,42,0.18)",
          }}
        >
          {isFavorite ? <HeartFilled /> : <HeartOutlined />}
        </button>
      </div>

      <div style={{ marginTop: 16, marginBottom: 12, flexShrink: 0 }}>
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
              style={{
                display: "-webkit-box",
                minHeight: equalHeight ? 54 : undefined,
                marginTop: 8,
                overflow: "hidden",
                fontSize: 18,
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: equalHeight ? 2 : "unset",
              }}
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
          <Text
            type="secondary"
            style={{
              display: "block",
              minHeight: equalHeight ? 22 : undefined,
              marginTop: 8,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {location}
          </Text>
        )}
        {equalHeight && !location && <div style={{ minHeight: 22 }} />}
      </div>

      <div
        className={equalHeight ? "rental-product-description" : undefined}
        style={{
          height: equalHeight && !descriptionExpanded ? 77 : undefined,
          marginBottom: canExpandDescription ? 4 : 16,
          overflow: equalHeight && descriptionExpanded ? "visible" : "hidden",
          overflowWrap: "anywhere",
        }}
      >
        <Text
          ref={descriptionRef}
          id={descriptionId}
          type="secondary"
          style={{
            display:
              equalHeight && !descriptionExpanded ? "-webkit-box" : "block",
            lineHeight: 1.6,
            maxHeight: equalHeight && !descriptionExpanded ? 77 : undefined,
            overflow: "hidden",
            overflowWrap: "anywhere",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: equalHeight && !descriptionExpanded ? 3 : "unset",
          }}
        >
          {description}
        </Text>
      </div>

      {canExpandDescription && (
        <Button
          type="link"
          size="small"
          onClick={(event) => {
            event.stopPropagation();
            setDescriptionExpanded((expanded) => !expanded);
          }}
          aria-expanded={descriptionExpanded}
          aria-controls={descriptionId}
          aria-label={`${descriptionExpanded ? "Collapse" : "Expand"} description for ${title}`}
          style={{ alignSelf: "flex-start", padding: 0, marginBottom: 12 }}
        >
          {descriptionExpanded ? "Less" : "More"}
        </Button>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          marginTop: equalHeight ? "auto" : undefined,
          flexShrink: 0,
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

      <div className="flex justify-around" style={{ flexShrink: 0 }}>
        <div>
          <Text strong style={{ display: "block", fontSize: 20 }}>
            {price ? `${currency} ${price}/day` : `${currency} 250/day`}
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {t.home?.dailyRental || "Daily Rental"}
          </Text>
        </div>

        <Button
          type="primary"
          block
          style={{ borderRadius: 999, height: 44, maxWidth: 100 }}
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
