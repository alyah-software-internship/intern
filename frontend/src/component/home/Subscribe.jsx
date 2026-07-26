import React, { useState } from "react";
import { Input, Button } from "antd";
import { useTranslation } from "../LanguageProvider.jsx";
import { useTheme } from "../../context/ThemeProvider.jsx";

const Subscribe = () => {
  const { translation: t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [email, setEmail] = useState("");

  const handleJoin = () => {
    // Placeholder action — you can wire this to an API
    console.log("Subscribe requested:", email);
    setEmail("");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "48px 16px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 980,
          borderRadius: 20,
          padding: 28,
          background: "linear-gradient(90deg,#0ea5e9,#10b981)",
          color: "#fff",
          boxShadow: "0 12px 30px rgba(2,6,23,0.12)",
        }}
      >
        <h2 style={{ margin: 0, fontSize: 34, fontWeight: 800 }}>
          {t.home?.subscribeTitle || "Ready to Start Renting?"}
        </h2>
        <p style={{ marginTop: 8, marginBottom: 18, opacity: 0.95 }}>
          {t.home?.subscribeSubtitle ||
            "Join thousands of verified business users and vendors on i-Share today."}
        </p>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={
              t.home?.subscribePlaceholder || "Enter your email address"
            }
            style={{
              borderRadius: 10,
              padding: "12px 16px",
              flex: 1,
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.18)",
              color: "#fff",
            }}
          />
          <Button
            onClick={handleJoin}
            style={{
              borderRadius: 10,
              padding: "8px 20px",
              background: "#fff",
              color: "#0b1724",
              fontWeight: 700,
              border: "none",
            }}
          >
            {t.home?.subscribeCTA || "Join Now"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Subscribe;
