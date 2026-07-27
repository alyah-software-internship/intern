import React from "react";
import { Card, Row, Col, Typography, Button as AntdButton } from "antd";
import { useTranslation } from "../LanguageProvider.jsx";
import { useTheme } from "../../context/ThemeProvider.jsx";
import { bookings, rentalItems, vendors } from "../../assets/dummyAssets";

const { Text } = Typography;

const sampleBookings = bookings.slice(0, 2).map((booking) => {
  const product = rentalItems.find((item) => item.id === booking.productId);
  const vendor = vendors.find((item) => item.id === booking.vendorId);
  const days = Math.max(
    1,
    Math.ceil(
      (new Date(booking.endDate) - new Date(booking.startDate)) /
        (1000 * 60 * 60 * 24),
    ),
  );

  return {
    ...booking,
    title: product?.title || booking.productId,
    vendor: vendor?.name || product?.vendor || booking.vendorId,
    period: `${booking.startDate} to ${booking.endDate}`,
    days: `+${days} days`,
  };
});

const Bookings = () => {
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
        borderRadius: 12,
        padding: 14,
        marginTop: 16,
        background: isDark ? "#0b1220" : "#fff",
        border: isDark
          ? "1px solid rgba(255,255,255,0.06)"
          : "1px solid rgba(15,23,42,0.06)",
      }}
    >
      {/* Example items - visually match hero layout */}
      <div style={{ marginTop: 18 }}>
        <Row gutter={[12, 12]}>
          <Col span={24}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 12,
                borderRadius: 12,
                gap: 12,
                flexWrap: "wrap",
                background: isDark ? "rgba(255,255,255,0.02)" : "#fbfdff",
                border: isDark
                  ? "1px solid rgba(255,255,255,0.03)"
                  : "1px solid rgba(15,23,42,0.04)",
              }}
            >
              <div>
                <Text
                  style={{
                    color: isDark ? "#f8fafc" : "#0f172a",
                    fontWeight: 700,
                  }}
                >
                  {t.home?.yourActiveBookings || "Your Active Bookings"}
                </Text>
                <div>
                  <Text
                    style={{
                      color: isDark ? "#94a3b8" : "#6b7280",
                      fontSize: 12,
                    }}
                  >
                    {t.home?.yourActiveBookingsCount || "4 contracts"}
                  </Text>
                </div>
              </div>

              <AntdButton
                type="text"
                style={{
                  color: isDark ? "#60a5fa" : "#0ea5e9",
                  padding: "8px 0",
                }}
              >
                {t.common?.viewAll || "View All"}
              </AntdButton>
            </div>
          </Col>
        </Row>
      </div>

      <div>
        {sampleBookings.map((b) => (
          <div
            key={b.id}
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "stretch" : "center",
              justifyContent: "space-between",
              padding: isMobile ? 12 : 14,
              borderRadius: 12,
              marginBottom: 12,
              border: isDark
                ? "1px solid rgba(255,255,255,0.04)"
                : "1px solid rgba(15,23,42,0.06)",
              background: isDark ? "rgba(255,255,255,0.02)" : "#fbfdff",
              gap: isMobile ? 12 : 0,
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <Text
                style={{
                  fontWeight: 700,
                  color: isDark ? "#f8fafc" : "#0f172a",
                  display: "block",
                }}
              >
                {b.title}
              </Text>
              <div style={{ marginTop: 8 }}>
                <Text
                  style={{
                    color: isDark ? "#94a3b8" : "#6b7280",
                    fontSize: 13,
                  }}
                >
                  {`Vendor: ${b.vendor}`}
                </Text>
              </div>
              <div style={{ marginTop: 6 }}>
                <Text
                  style={{
                    color: isDark ? "#94a3b8" : "#6b7280",
                    fontSize: 12,
                  }}
                >
                  {`${b.period} • ${b.days}`}
                </Text>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "row" : "column",
                alignItems: isMobile ? "center" : "flex-end",
                justifyContent: isMobile ? "space-between" : "center",
                gap: 10,
                width: isMobile ? "100%" : "auto",
                minWidth: 0,
                marginTop: isMobile ? 8 : 0,
              }}
            >
              <div
                style={{
                  textAlign: isMobile ? "left" : "right",
                  minWidth: isMobile ? 0 : 100,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: isDark ? "#94a3b8" : "#6b7280",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}
                >
                  ESCROW HOLDING
                </Text>
                <div style={{ marginTop: 4 }}>
                  <Text
                    strong
                    style={{
                      color:
                        b.status === "active"
                          ? "#10b981"
                          : b.status === "pending"
                            ? "#f59e0b"
                            : "#6b7280",
                    }}
                  >
                    {b.status.toUpperCase()}
                  </Text>
                </div>
              </div>

              <AntdButton
                type="default"
                style={{ borderRadius: 999, minWidth: isMobile ? 42 : 48 }}
              >
                &gt;
              </AntdButton>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default Bookings;
