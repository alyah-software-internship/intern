import { Button, Card, Col, DatePicker, Row, Select, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../LanguageProvider.jsx";
import { useTheme } from "../../context/ThemeProvider.jsx";

const { RangePicker } = DatePicker;
const { Text } = Typography;

const Searchbar = () => {
  const { translation: t } = useTranslation();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === "dark";
  const [selectedCategory, setSelectedCategory] = useState(undefined);
  const [selectedLocation, setSelectedLocation] = useState(undefined);
  const [rentalPeriod, setRentalPeriod] = useState([]);

  const categories = [
    { label: t.home.search.categories.construction, value: "construction" },
    { label: t.home.search.categories.vehicles, value: "vehicles" },
    { label: t.home.search.categories.tools, value: "tools" },
  ];

  const locations = [
    { label: t.home.search.locations.ethiopia, value: "ethiopia" },
    { label: t.home.search.locations.addis, value: "addis" },
    { label: t.home.search.locations.bahirDar, value: "bahir" },
  ];

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (selectedCategory) {
      params.set("category", selectedCategory);
    }

    if (selectedLocation) {
      params.set("location", selectedLocation);
    }

    if (rentalPeriod[0] && rentalPeriod[1]) {
      params.set("start_date", rentalPeriod[0].format("YYYY-MM-DD"));
      params.set("end_date", rentalPeriod[1].format("YYYY-MM-DD"));
    }

    navigate(`/rentals${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <Card
      style={{
        borderRadius: 32,
        padding: 24,
        background: isDark ? "#111827" : "rgba(255,255,255,0.95)",
        boxShadow: isDark
          ? "0 24px 60px rgba(0,0,0,0.55)"
          : "0 24px 60px rgba(15,23,42,0.12)",
        border: isDark
          ? "1px solid rgba(255,255,255,0.08)"
          : "1px solid rgba(15,23,42,0.1)",
      }}
      styles={{ body: { padding: 24 } }}
    >
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} md={7}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <Text
              strong
              style={{
                fontSize: 12,
                letterSpacing: "0.18em",
                color: "#64748b",
              }}
            >
              {t.home.search.assetCategory}
            </Text>
            <Select
              value={selectedCategory}
              onChange={setSelectedCategory}
              options={categories}
              placeholder={t.home.search.categoryPlaceholder}
              style={{ width: "100%", borderRadius: 24 }}
            />
          </div>
        </Col>

        <Col xs={24} md={7}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <Text
              strong
              style={{
                fontSize: 12,
                letterSpacing: "0.18em",
                color: "#64748b",
              }}
            >
              {t.home.search.location}
            </Text>
            <Select
              value={selectedLocation}
              onChange={setSelectedLocation}
              options={locations}
              placeholder={t.home.search.locationPlaceholder}
              style={{ width: "100%", borderRadius: 24 }}
            />
          </div>
        </Col>

        <Col xs={24} md={7}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <Text
              strong
              style={{
                fontSize: 12,
                letterSpacing: "0.18em",
                color: "#64748b",
              }}
            >
              {t.home.search.rentalPeriod}
            </Text>
            <RangePicker
              value={rentalPeriod}
              onChange={(dates) => setRentalPeriod(dates || [])}
              style={{ width: "100%", borderRadius: 24 }}
            />
          </div>
        </Col>

        <Col xs={24} md={3}>
          <Button
            type="primary"
            block
            icon={<SearchOutlined style={{ fontSize: 18, marginRight: 8 }} />}
            onClick={handleSearch}
            style={{
              height: 56,
              borderRadius: 24,
              fontWeight: 700,
              background: isDark ? "#2563eb" : "#0ea5e9",
              borderColor: isDark ? "#2563eb" : "#0ea5e9",
              boxShadow: isDark
                ? "0 12px 24px rgba(37, 99, 235, 0.35)"
                : "0 12px 24px rgba(14, 165, 233, 0.25)",
              color: "#ffffff",
            }}
          >
            {t.home.search.searchButton}
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default Searchbar;
