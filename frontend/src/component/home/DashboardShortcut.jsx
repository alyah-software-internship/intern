import React from "react";
import { Card, Col, Row, Typography, Button as AntdButton } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useTranslation } from "../LanguageProvider.jsx";
import { useTheme } from "../../context/ThemeProvider.jsx";

const { Title, Text } = Typography;

const DashboardShortcut = () => {
  const { translation: t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Card
      style={{
        borderRadius: 12,
        padding: 18,
        background: isDark ? "#0b1220" : "#fff",
        border: isDark
          ? "1px solid rgba(255,255,255,0.06)"
          : "1px solid rgba(15,23,42,0.06)",
        boxShadow: isDark
          ? "0 8px 24px rgba(2,6,23,0.6)"
          : "0 8px 24px rgba(15,23,42,0.06)",
      }}
    >
      <Row align="middle" justify="space-between">
        <Col>
          <Title
            level={4}
            style={{
              margin: 0,
              color: isDark ? "#f8fafc" : undefined,
              fontWeight: 800,
            }}
          >
            {t.home?.dashboardShortcutsTitle || "Dashboard Shortcuts"}
          </Title>
          <Text
            style={{
              color: isDark ? "#94a3b8" : "#6b7280",
              display: "block",
              marginTop: 6,
            }}
          >
            {t.home?.dashboardShortcutsSubtitle ||
              "Access quick links and recent activity."}
          </Text>
        </Col>

        <Col>
          <AntdButton
            type="default"
            icon={<ArrowRightOutlined />}
            style={{
              borderRadius: 999,
              minWidth: 44,
              height: 44,
              background: isDark ? "rgba(255,255,255,0.04)" : "#f1f5f9",
              borderColor: isDark ? "rgba(255,255,255,0.06)" : undefined,
            }}
          />
        </Col>
      </Row>

     
    </Card>
  );
};

export default DashboardShortcut;
