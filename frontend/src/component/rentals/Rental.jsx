import React, { useMemo, useState, useEffect } from "react";
import {
  Row,
  Col,
  Typography,
  Input,
  Select,
  Slider,
  Card,
  Space,
  Button,
} from "antd";
import ItemCard from "../../component/home/ItemCard.jsx";
import Bookings from "../home/Bookings.jsx";
import { useTranslation } from "../../component/LanguageProvider.jsx";
import { useTheme } from "../../context/ThemeProvider.jsx";
import {
  rentalItems,
  categories as dummyCategories,
  vendors as dummyVendors,
} from "../../assets/dummyAssets";
import { useNavigate, useSearchParams } from "react-router-dom";

const { Title, Text } = Typography;

const Rental = () => {
  const { translation: t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const productStrings = t.products || t.home?.products || {};
  const rentalStrings = t.rentals || t.home?.rentals || {};

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [searchParams] = useSearchParams();
  const [vendor, setVendor] = useState(
    () => searchParams.get("vendor") || "all",
  );
  const [availability, setAvailability] = useState("all");
  const [priceRange, setPriceRange] = useState([30, 500]);
  const [sortBy, setSortBy] = useState("relevance");
  const navigate = useNavigate();

  const categories = useMemo(
    () => [
      { value: "all", label: productStrings.allCategories || "All Categories" },
      {
        value: "Construction & Tools",
        label: rentalStrings.categories?.construction || "Construction & Tools",
      },
      {
        value: "Beauty & Wellness",
        label: rentalStrings.categories?.beauty || "Beauty & Wellness",
      },
      {
        value: "Agriculture & Tractors",
        label:
          rentalStrings.categories?.agriculture || "Agriculture & Tractors",
      },
      {
        value: "Event Management",
        label: rentalStrings.categories?.event || "Event Management",
      },
    ],
    [productStrings.allCategories, rentalStrings.categories],
  );

  const vendors = useMemo(
    () => [
      { value: "all", label: productStrings.allVendors || "All Vendors" },
      {
        value: "Titan Heavy Rentals",
        label: rentalStrings.vendors?.titan || "Titan Heavy Rentals",
      },
      {
        value: "GlowTech Aesthetic Suites",
        label: rentalStrings.vendors?.glowtech || "GlowTech Aesthetic Suites",
      },
      {
        value: "GreenField Agri Services",
        label: rentalStrings.vendors?.greenfield || "GreenField Agri Services",
      },
      {
        value: "SoundVibe Event Gear",
        label: rentalStrings.vendors?.soundvibe || "SoundVibe Event Gear",
      },
    ],
    [productStrings.allVendors, rentalStrings.vendors],
  );

  const availabilityOptions = useMemo(
    () => [
      { value: "all", label: t.products?.allAvailability || "All" },
      { value: "available", label: t.products?.available || "Available" },
      { value: "unavailable", label: t.products?.unavailable || "Unavailable" },
    ],
    [
      t.products?.allAvailability,
      t.products?.available,
      t.products?.unavailable,
    ],
  );

  const sortOptions = useMemo(
    () => [
      {
        value: "relevance",
        label: productStrings.sortOptions?.relevance || "Relevance",
      },
      {
        value: "priceLow",
        label: productStrings.sortOptions?.priceLow || "Price: Low to High",
      },
      {
        value: "priceHigh",
        label: productStrings.sortOptions?.priceHigh || "Price: High to Low",
      },
      {
        value: "rating",
        label: productStrings.sortOptions?.rating || "Highest Rated",
      },
      {
        value: "newest",
        label: productStrings.sortOptions?.newest || "Newest First",
      },
    ],
    [productStrings.sortOptions],
  );

  const localizedRentalItems = useMemo(
    () =>
      rentalItems.map((item) => {
        const translatedItem = rentalStrings.items?.[item.translationKey] || {};
        return {
          ...item,
          title: translatedItem.title || item.title,
          category: translatedItem.category || item.category,
          vendor: translatedItem.vendor || item.vendor,
          badge: translatedItem.badge || item.badge,
          description: translatedItem.description || item.description,
          location: translatedItem.location || item.location,
          actionLabel: t.common?.rent || "Rent Now",
        };
      }),
    [t],
  );

  const filteredItems = useMemo(() => {
    const filtered = localizedRentalItems.filter((item) => {
      const matchesSearch =
        search.length === 0 ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase()) ||
        item.vendor.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = category === "all" || item.category === category;
      const matchesVendor = vendor === "all" || item.vendor === vendor;
      const matchesAvailability =
        availability === "all" ||
        (availability === "available" && item.available) ||
        (availability === "unavailable" && !item.available);
      const matchesPrice =
        item.price >= priceRange[0] && item.price <= priceRange[1];

      return (
        matchesSearch &&
        matchesCategory &&
        matchesVendor &&
        matchesAvailability &&
        matchesPrice
      );
    });

    if (sortBy === "rating") {
      return [...filtered].sort((a, b) => Number(b.rating) - Number(a.rating));
    }
    if (sortBy === "priceLow") {
      return [...filtered].sort((a, b) => a.price - b.price);
    }
    if (sortBy === "priceHigh") {
      return [...filtered].sort((a, b) => b.price - a.price);
    }
    if (sortBy === "newest") {
      return filtered;
    }
    return filtered;
  }, [search, category, vendor, availability, priceRange, sortBy]);

  useEffect(() => {
    const vendorFromQuery = searchParams.get("vendor");
    setVendor(vendorFromQuery || "all");
  }, [searchParams]);

  const handleRentNow = (item) => {
    console.log("Rent now clicked for", item.title);
  };

  const handleSelectItem = (item) => {
    // navigate to detail page for item
    navigate(`/rentals/${item.id}`);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px 24px",
        background: isDark ? "#040b1a" : "#f8fbff",
      }}
    >
      <div style={{ maxWidth: 1440, margin: "0 auto" }}>
        <Row
          align="middle"
          justify="space-between"
          style={{ marginBottom: 24, gap: 16 }}
        >
          <Col xs={24} md={16}>
            <Text
              style={{
                display: "block",
                color: "#16a34a",
                fontSize: 12,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              {productStrings.filter || "Filter Products"}
            </Text>
            <Title
              level={2}
              style={{
                margin: 0,
                color: isDark ? "#f8fafc" : "#0f172a",
                lineHeight: 1.1,
              }}
            >
              {productStrings.title ||
                t.nav?.rentals ||
                "Marketplace Search Catalog"}
            </Title>
            <Text type="secondary">
              {filteredItems.length}{" "}
              {productStrings.productsFound || "products found"}
            </Text>
          </Col>

          <Col
            xs={24}
            md={8}
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginLeft: "auto",
            }}
          >
            <Space
              size={12}
              style={{
                width: "100%",
                justifyContent: "flex-end",
                flexWrap: "wrap",
              }}
            >
              <Text
                style={{
                  whiteSpace: "nowrap",
                  color: isDark ? "#cbd5e1" : "#334155",
                }}
              >
                {productStrings.sort || "Sort By"}
              </Text>
              <Select
                value={sortBy}
                onChange={setSortBy}
                options={sortOptions.map((option) => ({
                  value: option.value,
                  label: option.label,
                }))}
                style={{ minWidth: 220, width: 220 }}
              />
            </Space>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={6}>
            <Card
              title={productStrings.filter || "Filter Products"}
              style={{ borderRadius: 24 }}
              bodyStyle={{ padding: 24 }}
            >
              <Space direction="vertical" size={24} style={{ width: "100%" }}>
                <div>
                  <Text strong>{productStrings.keyword || "Keyword"}</Text>
                  <Input
                    placeholder={
                      productStrings.searchPlaceholder || "Type keyword..."
                    }
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ marginTop: 12, width: "100%" }}
                  />
                </div>

                <div>
                  <Text strong>
                    {productStrings.filterByCategory || "Category"}
                  </Text>
                  <Select
                    value={category}
                    onChange={setCategory}
                    options={categories}
                    style={{ marginTop: 12, width: "100%" }}
                  />
                </div>

                <div>
                  <Text strong>
                    {productStrings.filterByPrice || "Price Range"}
                  </Text>
                  <Slider
                    range
                    min={30}
                    max={500}
                    value={priceRange}
                    onChange={setPriceRange}
                    style={{ marginTop: 16 }}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: 8,
                      color: "#64748b",
                      fontSize: 12,
                    }}
                  >
                    <Text>$ {priceRange[0]}/day</Text>
                    <Text>$ {priceRange[1]}/day</Text>
                  </div>
                </div>

                <div>
                  <Text strong>
                    {productStrings.filterByVendor || "Vendor"}
                  </Text>
                  <Select
                    value={vendor}
                    onChange={setVendor}
                    options={vendors}
                    style={{ marginTop: 12, width: "100%" }}
                  />
                </div>

                <div>
                  <Text strong>
                    {productStrings.filterByAvailability || "Availability"}
                  </Text>
                  <Select
                    value={availability}
                    onChange={setAvailability}
                    options={availabilityOptions}
                    style={{ marginTop: 12, width: "100%" }}
                  />
                </div>

                <Space direction="vertical" style={{ width: "100%" }}>
                  <Button
                    type="default"
                    block
                    onClick={() => {
                      setSearch("");
                      setCategory("all");
                      setVendor("all");
                      setAvailability("all");
                      setPriceRange([30, 500]);
                      setSortBy("relevance");
                    }}
                  >
                    {productStrings.resetFilters || "Reset Filters"}
                  </Button>
                  <Button type="primary" block>
                    {productStrings.applyFilters || "Apply Filters"}
                  </Button>
                </Space>
              </Space>
            </Card>
          </Col>

          <Col xs={24} lg={18}>
            <Row gutter={[24, 24]}>
              {filteredItems.map((item) => (
                <Col key={item.id} xs={24} sm={12} lg={12}>
                  <ItemCard
                    item={item}
                    onAction={handleRentNow}
                    onSelect={handleSelectItem}
                  />
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </div>

      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "24px 0" }}>
        <Bookings />
      </div>
    </div>
  );
};

export default Rental;
