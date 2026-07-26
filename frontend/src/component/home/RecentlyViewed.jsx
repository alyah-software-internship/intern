import React from "react";
import { Card, List, Avatar, Typography } from "antd";
import { useTranslation } from "../LanguageProvider.jsx";
import { useTheme } from "../../context/ThemeProvider.jsx";

const { Text } = Typography;

const sample = [
  {
    id: 1,
    title: "Caterpillar 301.8 Mini Excavator",
    category: "Construction & Tools",
    price: "$250/day",
  },
  {
    id: 2,
    title: "John Deere 1025R Sub-Compact Tractor",
    category: "Agriculture & Tractors",
    price: "$180/day",
  },
];

const RecentlyViewed = () => {
  const { translation: t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    {
      id: 1,
      title: "Caterpillar 301.8 Mini Excavator",
      categoryKey: "construction",
      price: "$250/day",
    },
    {
      id: 2,
      title: "John Deere 1025R Sub-Compact Tractor",
      categoryKey: "agriculture",
      price: "$180/day",
    },
        style={{
          display: "block",
          marginBottom: 12,
          color: isDark ? "#f8fafc" : undefined,
        }}
      >
        {t.home?.recentlyViewedTitle || "Recently Viewed Items"}
      </Text>

      <List
        itemLayout="horizontal"
        dataSource={sample}
        renderItem={(item) => (
          <List.Item style={{ padding: 8, borderRadius: 10 }}>
            <List.Item.Meta
              avatar={<Avatar shape="square" size={48} src={null} />}
              title={
                <Text strong style={{ color: isDark ? "#f8fafc" : undefined }}>
                  {item.title}
                </Text>
              }
              description={
                <Text
                  style={{
                    color: isDark ? "#94a3b8" : "#6b7280",
                    fontSize: 13,
                  }}
                >
                  {item.category}
                </Text>
              }
            />
            <div>
              <Text
                style={{
                  color: isDark ? "#10b981" : "#10b981",
                  fontWeight: 700,
                }}
              >
                {item.price}
              </Text>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
                    {t.home?.recentlyViewed?.categories?.[item.categoryKey] || t.home?.search?.categories?.[item.categoryKey] || ""}

export default RecentlyViewed;
