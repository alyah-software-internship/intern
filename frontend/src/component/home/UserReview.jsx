import React from "react";
import { Row, Col, Avatar } from "antd";
import { useTranslation } from "../LanguageProvider.jsx";
import { useTheme } from "../../context/ThemeProvider.jsx";

const UserReview = () => {
  const { translation: t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const reviews = [
    {
      id: "r1",
      quote:
        "“i-Share made it incredibly easy to rent equipment for my construction project. Saved me thousands compared to buying.”",
      name: "Michael Tesfaye",
      role: "General Contractor",
      location: "Addis Ababa",
    },
    {
      id: "r2",
      quote:
        "“As a vendor, I've tripled my equipment revenue by listing on i-Share. The platform handles everything seamlessly.”",
      name: "Sara Bekele",
      role: "Equipment Vendor",
      location: "Dire Dawa",
    },
    {
      id: "r3",
      quote:
        "“From booking to return, every step was smooth. The calendar availability system is brilliant.”",
      name: "Daniel Haile",
      role: "Event Planner",
      location: "Hawassa",
    },
  ];

  return (
    <section
      style={{
        padding: "56px 24px",
        background: isDark ? "#071025" : "#ffffff",
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
          {t.home?.userReviewsBadge || "USER REVIEWS"}
        </div>
        <h2 style={{ marginTop: 8, fontSize: 28, fontWeight: 800 }}>
          {t.home?.userReviewsTitle || "User Reviews"}
        </h2>
        <p
          style={{
            color: "rgba(0,0,0,0.56)",
            maxWidth: 760,
            margin: "8px auto 32px",
          }}
        >
          {t.home?.userReviewsSubtitle ||
            "Honest feedback from verified active renters and rental store operators"}
        </p>

        <Row gutter={[24, 24]}>
          {reviews.map((r) => (
            <Col key={r.id} xs={24} md={12} lg={8}>
              <div
                style={{
                  borderRadius: 12,
                  padding: 20,
                  background: isDark ? "#081426" : "#f5f8fb",
                  minHeight: 220,
                }}
              >
                <div style={{ color: "#f6b83d", marginBottom: 8 }}>★★★★★</div>
                <blockquote
                  style={{
                    fontStyle: "italic",
                    color: isDark ? "#cbd5e1" : "#475569",
                    marginBottom: 16,
                  }}
                >
                  {r.quote}
                </blockquote>
                <div
                  style={{
                    borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.06)"}`,
                    paddingTop: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <Avatar
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(r.name)}&background=fff&color=333`}
                  />
                  <div>
                    <div style={{ fontWeight: 700 }}>{r.name}</div>
                    <div style={{ color: "rgba(0,0,0,0.45)", fontSize: 12 }}>
                      {r.role} • {r.location}
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default UserReview;
