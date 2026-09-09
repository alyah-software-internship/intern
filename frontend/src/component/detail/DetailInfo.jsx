import { useContext, useState } from "react";
import axios from "axios";
import { Card, Typography, Tag, Button, Divider, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../component/LanguageProvider.jsx";
import { useTheme } from "../../context/ThemeProvider.jsx";
import { AppContext } from "../../context/AppContext.jsx";

const { Text, Title } = Typography;

const DetailInfo = ({ item }) => {
  const { translation: t } = useTranslation();
  const { isDark } = useTheme();
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [booking, setBooking] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  if (!item) return null;

  const handleBookNow = async () => {
    if (!localStorage.getItem("authToken")) {
      messageApi.info("Please sign in to book this rental.");
      navigate("/signin", { state: { from: window.location.pathname } });
      return;
    }
    if (!item.available) {
      messageApi.warning("This rental is currently unavailable.");
      return;
    }
    if (!startDate || !endDate) {
      messageApi.warning("Please select a check-in and checkout date.");
      return;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      messageApi.error("Checkout date must be after the check-in date.");
      return;
    }

    setBooking(true);
    try {
      navigate("/booking-details", {
        state: {
          item,
          startDate,
          endDate,
        },
      });
    } finally {
      setBooking(false);
    }
  };

  const images = item.images && item.images.length ? item.images : [item.image];
  const selectedImage = images[selectedIndex] || item.image;

  const rentalDays = (() => {
    if (!startDate || !endDate) return 1;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return 1;
    }

    return Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
  })();

  const rentalSubtotal = Number(item.price || 0) * rentalDays;
  const refundableDeposit = Number(
    item.deposit ?? item.refundableDeposit ?? 500,
  );
  const platformFee = Number(
    item.platformFee ?? Math.max(0, Math.round(rentalSubtotal * 0.05)),
  );
  const totalPrice = rentalSubtotal + refundableDeposit + platformFee;

  return (
    <div className="detail-layout shared-page-content">
      {contextHolder}
      <div className="detail-main">
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
          className="detail-gallery"
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
          <Card
            className="shared-surface"
            style={{ background: isDark ? "#0f172a" : "#fff" }}
          >
            <Title
              level={4}
              className="detail-hero-image"
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
                  className="detail-specs-grid"
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

                <div
                  className="detail-policy-grid"
                  style={{ display: "flex", gap: 16, marginTop: 8 }}
                >
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
                  className="detail-vendor-header"
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

      <div className="detail-booking-panel">
        <Card
          className="shared-surface detail-booking-card"
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
              value={startDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(event) => setStartDate(event.target.value)}
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
              value={endDate}
              min={startDate || new Date().toISOString().split("T")[0]}
              onChange={(event) => setEndDate(event.target.value)}
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
                  {t.productDetail?.rentSubtotal || "Rent Subtotal"} (
                  {rentalDays} day{rentalDays > 1 ? "s" : ""})
                </Text>
                <Text>${rentalSubtotal}</Text>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text type="secondary">
                  {t.productDetail?.refundableDeposit ||
                    "Refundable Escrow Deposit"}
                </Text>
                <Text>${refundableDeposit}</Text>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text type="secondary">
                  {t.productDetail?.platformFee ||
                    "Platform Commission Fee (5%)"}
                </Text>
                <Text>${platformFee}</Text>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 12,
              }}
            >
              <Text strong>{t.common?.total || "Total"}</Text>
              <Text strong>${totalPrice}</Text>
            </div>

            <Button
              type="primary"
              size="large"
              style={{ borderRadius: 8 }}
              loading={booking}
              disabled={booking}
              onClick={handleBookNow}
            >
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
