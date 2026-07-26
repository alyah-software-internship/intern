import React from "react";
import { Row, Col, Typography } from "antd";
import { StarFilled } from "@ant-design/icons";
import { useTranslation } from "../LanguageProvider.jsx";
import { useTheme } from "../../context/ThemeProvider.jsx";

const { Title, Text } = Typography;

const TrustedBy = () => {
  const { translation: t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const stats = [
    {
      id: "s1",
      value: "50,000+",
      label: t.home?.trusted?.rentalsCompleted || "Rentals Completed",
    },
    {
      id: "s2",
      value: "3,400+",
      label: t.home?.trusted?.verifiedVendors || "Verified Vendors",
    },
    {
      id: "s3",
      value: "50+",
      label: t.home?.trusted?.productCategories || "Product Categories",
    },
    {
      id: "s4",
      value: "4.8",
      label: t.home?.trusted?.averageRating || "Average User Rating",
      isRating: true,
    },
  ];

  return (
    <section
      style={{
        background: isDark ? "#030612" : "#071026",
        color: "#fff",
        padding: "56px 24px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
        <div
          style={{
            color: "#10b981",
            fontWeight: 800,
            letterSpacing: "0.28em",
            fontSize: 12,
          }}
        >
          {t.home?.trusted?.badge || "Trusted by thousands"}
        </div>
        <Title level={2} style={{ color: "#fff", marginTop: 8 }}>
          {t.home?.trusted?.title ||
            "Ethiopia's Fastest-Growing Rental Marketplace"}
        </Title>
        <Text
          type="secondary"
          style={{
            color: "rgba(255,255,255,0.65)",
            display: "block",
            marginBottom: 40,
          }}
        >
          {t.home?.trusted?.subtitle ||
            "Empowering local builders, farmers, salons, and planners with friction-free peer assets"}
        </Text>

        <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
          {stats.map((s) => (
            <Col
              key={s.id}
              xs={24}
              sm={12}
              md={6}
              style={{ textAlign: "center" }}
            >
              <div style={{ fontSize: 40, fontWeight: 800, color: "#10b981" }}>
                {s.value}
                {s.isRating ? (
                  <StarFilled style={{ marginLeft: 8, color: "#10b981" }} />
                ) : null}
              </div>
              <div
                style={{
                  marginTop: 8,
                  color: "rgba(255,255,255,0.6)",
                  letterSpacing: "0.08em",
                  fontSize: 12,
                }}
              >
                {s.label}
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default TrustedBy;
