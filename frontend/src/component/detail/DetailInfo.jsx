import React, { useState } from "react";
import { Card, Typography, Tag, Button, Divider } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../component/LanguageProvider.jsx";
import { useTheme } from "../../context/ThemeProvider.jsx";

const { Text, Title } = Typography;

const DetailInfo = ({ item }) => {
  const { translation: t } = useTranslation();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!item) return null;

  const images = item.images && item.images.length ? item.images : [item.image];
  const selectedImage = images[selectedIndex] || item.image;

  return (
    <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
      <div style={{ flex: 1 }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <Tag color="blue">{item.category}</Tag>
            {item.available && (
              <Tag color="green">{t.products?.available || "Available"}</Tag>
            )}
          </div>

          <Title level={2} style={{ margin: 0 }}>
            {item.title}
          </Title>
        </div>

        <div
          style={{
            borderRadius: 12,
            overflow: "hidden",
            background: isDark ? "#0f172a" : "#fff",
            padding: 12,
          }}
        >
          <img
            src={selectedImage}
            alt={item.title}
            style={{
              width: "100%",
              height: 360,
              objectFit: "cover",
              borderRadius: 12,
            }}
          />

          <div
            style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}
          >
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`thumb-${idx}`}
                onClick={() => setSelectedIndex(idx)}
                style={{
                  width: 72,
                  height: 72,
                  objectFit: "cover",
                  borderRadius: 8,
                  cursor: "pointer",
                  border:
                    idx === selectedIndex
                      ? "2px solid #2563eb"
                      : "1px solid #e6e8eb",
                }}
              />
            ))}
          </div>
        </div>

        <div style={{ marginTop: 18 }}>
          <Card style={{ background: isDark ? "#0f172a" : "#fff" }}>
            <Title
              level={4}
              style={{
                marginBottom: 12,
                color: isDark ? "#f8fafc" : undefined,
              }}
            >
              {t.common?.description || "Description"}
            </Title>

            <Text style={{ display: "block", marginBottom: 8 }}>
              {item.longDescription || item.description}
            </Text>

            {item.specs && item.specs.length > 0 && (
              <div style={{ marginTop: 18 }}>
                <Title level={5} style={{ marginBottom: 12 }}>
                  {t.productDetail?.technicalSpecs ||
                    "Technical Specifications"}
                </Title>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                  }}
                >
                  {item.specs.map((spec, idx) => (
                    <div
                      key={idx}
                      style={{
                        border: "1px solid #e6edf3",
                        borderRadius: 8,
                        padding: 12,
                      }}
                    >
                      <Text
                        strong
                        style={{ display: "block", marginBottom: 6 }}
                      >
                        {spec.label}
                      </Text>
                      <Text type="secondary">{spec.value}</Text>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Escrow / Policies */}
            {(item.deposit || item.overdueFee || item.cancellationWindow) && (
              <div style={{ marginTop: 24 }}>
                <Title level={5} style={{ marginBottom: 12 }}>
                  {t.productDetail?.escrowTitle ||
                    "Escrowed Security Deposit & Late Policies"}
                </Title>

                <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                  <div
                    style={{
                      flex: 1,
                      borderRadius: 12,
                      padding: 20,
                      background: isDark ? "#111827" : "#f1f7fb",
                      textAlign: "center",
                      border: isDark
                        ? "1px solid #334155"
                        : "1px solid #e6eef6",
                    }}
                  >
                    <Text
                      type="secondary"
                      style={{ display: "block", fontSize: 12 }}
                    >
                      {" "}
                      {t.productDetail?.securityDeposit ||
                        "SECURITY DEPOSIT"}{" "}
                    </Text>
                    <div
                      style={{ fontSize: 20, fontWeight: 800, margin: "8px 0" }}
                    >
                      ${item.deposit || 0}
                    </div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {t.productDetail?.depositNote || "Fully refundable"}
                    </Text>
                  </div>

                  <div
                    style={{
                      flex: 1,
                      borderRadius: 12,
                      padding: 20,
                      background: isDark ? "#111827" : "#fff7f0",
                      textAlign: "center",
                      border: isDark
                        ? "1px solid #334155"
                        : "1px solid #fae6d8",
                    }}
                  >
                    <Text
                      type="secondary"
                      style={{ display: "block", fontSize: 12 }}
                    >
                      {t.productDetail?.overdueFee || "OVERDUE FEE"}
                    </Text>
                    <div
                      style={{ fontSize: 20, fontWeight: 800, margin: "8px 0" }}
                    >
                      ${item.overdueFee || 0}
                    </div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {t.productDetail?.overdueNote || "Charged per late hour"}
                    </Text>
                  </div>

                  <div
                    style={{
                      flex: 1,
                      borderRadius: 12,
                      padding: 20,
                      background: isDark ? "#111827" : "#f8fafc",
                      textAlign: "center",
                      border: isDark
                        ? "1px solid #334155"
                        : "1px solid #e6edf3",
                    }}
                  >
                    <Text
                      type="secondary"
                      style={{ display: "block", fontSize: 12 }}
                    >
                      {t.productDetail?.cancellation || "CANCELLATION"}
                    </Text>
                    <div
                      style={{ fontSize: 20, fontWeight: 800, margin: "8px 0" }}
                    >
                      {item.cancellationWindow || "N/A"}
                    </div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {t.productDetail?.cancellationNote || "Free cancellation"}
                    </Text>
                  </div>
                </div>
              </div>
            )}

            {/* Vendor instructions & agreements */}
            {item.vendorInstructions && (
              <div style={{ marginTop: 24 }}>
                <Title level={5} style={{ marginBottom: 12 }}>
                  {t.productDetail?.vendorInstructionsTitle ||
                    "VENDOR CHECKOUT INSTRUCTIONS & AGREEMENTS"}
                </Title>
                <div
                  style={{
                    border: isDark ? "1px solid #334155" : "1px solid #e6edf3",
                    borderRadius: 8,
                    padding: 16,
                    background: isDark ? "#111827" : "#fff",
                  }}
                >
                  <Text style={{ fontStyle: "italic" }}>
                    "{item.vendorInstructions}"
                  </Text>
                </div>
              </div>
            )}
          </Card>

          {/* Vendor card */}
          {item.vendorInfo && (
            <div style={{ marginTop: 24 }}>
              <Card style={{ borderRadius: 12 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{ display: "flex", gap: 12, alignItems: "center" }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 999,
                        background: isDark ? "#1f2937" : "#eef2f7",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                      }}
                    >
                      {(item.vendorInfo.name || "T").charAt(0)}
                    </div>
                    <div>
                      <Text strong style={{ display: "block" }}>
                        {item.vendorInfo.name}
                      </Text>
                      <Text
                        type="secondary"
                        style={{ display: "block", fontSize: 12 }}
                      >
                        <span style={{ color: "#f59e0b", marginRight: 6 }}>
                          ★ {item.vendorInfo.rating}
                        </span>
                        {item.vendorInfo.onTimePercent} On-time Handovers
                      </Text>
                    </div>
                  </div>

                  <div>
                    <Button
                      type="default"
                      onClick={() =>
                        navigate(
                          `/rentals?vendor=${encodeURIComponent(
                            item.vendorInfo.name || item.vendor,
                          )}`,
                        )
                      }
                    >
                      {t.productDetail?.viewVendorListings ||
                        t.common?.viewAll ||
                        "View All Vendor Listings"}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      <div style={{ width: 360 }}>
        <Card
          style={{ borderRadius: 12, background: isDark ? "#0f172a" : "#fff" }}
        >
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <img
              src={selectedImage}
              alt="mini"
              style={{
                width: 72,
                height: 72,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />

            <div>
              <Text type="secondary">
                {t.productDetail?.pricePer ||
                  t.products?.price ||
                  "Rental Price Rate"}
              </Text>
              <Title level={3} style={{ margin: 0 }}>
                ${item.price} <Text type="secondary">/day</Text>
              </Title>
            </div>
          </div>

          <Divider />

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <label style={{ fontSize: 12, color: "#64748b" }}>
              {t.productDetail?.checkIn || "Check-in Date"}
            </label>
            <input
              type="date"
              style={{
                padding: 10,
                borderRadius: 6,
                border: isDark ? "1px solid #334155" : "1px solid #e5e7eb",
                background: isDark ? "#0f172a" : "#fff",
                color: isDark ? "#f8fafc" : undefined,
              }}
            />

            <label style={{ fontSize: 12, color: "#64748b" }}>
              {t.productDetail?.checkOut || "Checkout Date"}
            </label>
            <input
              type="date"
              style={{
                padding: 10,
                borderRadius: 6,
                border: isDark ? "1px solid #334155" : "1px solid #e5e7eb",
                background: isDark ? "#0f172a" : "#fff",
                color: isDark ? "#f8fafc" : undefined,
              }}
            />

            <div
              style={{
                background: isDark ? "#111827" : "#f8fafc",
                padding: 12,
                borderRadius: 8,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text type="secondary">
                  {t.productDetail?.rentSubtotal || "Rent Subtotal (3 days)"}
                </Text>
                <Text>${item.price * 3}</Text>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text type="secondary">
                  {t.productDetail?.refundableDeposit ||
                    "Refundable Escrow Deposit"}
                </Text>
                <Text>$500</Text>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text type="secondary">
                  {t.productDetail?.platformFee ||
                    "Platform Commission Fee (5%)"}
                </Text>
                <Text>$38</Text>
              </div>
            </div>

            <Button type="primary" size="large" style={{ borderRadius: 8 }}>
              {t.productDetail?.bookNow ||
                t.common?.bookNow ||
                "Request to Book Asset"}
            </Button>

            <Text type="secondary" style={{ fontSize: 12 }}>
              {t.productDetail?.bookingNote ||
                "You won't be charged yet. The escrow holding is authorized only after the vendor approves this booking."}
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DetailInfo;
