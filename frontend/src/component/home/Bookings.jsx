import React from "react";
import { Card, Row, Col, Typography, Button as AntdButton } from "antd";
import { useTranslation } from "../LanguageProvider.jsx";
import { useTheme } from "../../context/ThemeProvider.jsx";

const { Text } = Typography;

const sampleBookings = [
  {
    id: 1,
    title: "John Deere 1025R Sub-Compact Tractor",
    vendor: "GreenField Agri Services",
    period: "2026-07-20 to 2026-07-25",
    days: "+5 days",
    status: "active",
  },
  {
    id: 2,
    title: "HydraFacial MD Elite Professional System",
    vendor: "GlowTech Aesthetic Suppliers",
    period: "2026-07-22 to 2026-07-24",
    days: "+2 days",
    status: "pending",
  },
];

const Bookings = () => {
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
      {/* Example items - visually match hero layout */}
      <div style={{ marginTop: 18 }}>
        <Row gutter={[12, 12]}>
          <Col span={24}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 12,
                borderRadius: 12,
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
                style={{ color: isDark ? "#60a5fa" : "#0ea5e9" }}
              >
                {t.common?.viewAll || "View"}
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
              alignItems: "center",
              justifyContent: "space-between",
              padding: 12,
              borderRadius: 12,
              marginBottom: 12,
              border: isDark
                ? "1px solid rgba(255,255,255,0.04)"
                : "1px solid rgba(15,23,42,0.06)",
              background: isDark ? "rgba(255,255,255,0.02)" : "#fbfdff",
            }}
          >
            <div>
              <Text
                style={{
                  fontWeight: 700,
                  color: isDark ? "#f8fafc" : "#0f172a",
                }}
              >
                {b.title}
              </Text>
              <div>
                <Text
                  style={{
                    color: isDark ? "#94a3b8" : "#6b7280",
                    fontSize: 13,
                  }}
                >{`Vendor: ${b.vendor}`}</Text>
              </div>
              <div>
                <Text
                  style={{
                    color: isDark ? "#94a3b8" : "#6b7280",
                    fontSize: 12,
                  }}
                >{`${b.period} • ${b.days}`}</Text>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ textAlign: "right" }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: isDark ? "#94a3b8" : "#6b7280",
                  }}
                >
                  ESCROW HOLDING
                </Text>
                <div>
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

              <AntdButton type="default" style={{ borderRadius: 999 }}>
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
