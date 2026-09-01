import {
  startTransition,
  useMemo,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import axios from "axios";
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
import { useTranslation } from "../../component/LanguageProvider.jsx";
import { useTheme } from "../../context/ThemeProvider.jsx";
import { AppContext } from "../../context/AppContext.jsx";
import { useNavigate, useSearchParams } from "react-router-dom";

const { Title, Text } = Typography;
const rentalProductsCacheKey = "rentalProducts";
const rentalCategoriesCacheKey = "rentalCategories";

const readCache = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) || "null");
  } catch {
    return null;
  }
};

const Rental = () => {
  const { translation: t } = useTranslation();
  const { theme } = useTheme();
  const { backendUrl } = useContext(AppContext);
  const isDark = theme === "dark";
  const productStrings = t.products || t.home?.products || {};

  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(() => {
    const queryValue =
      searchParams.get("search") || searchParams.get("query") || "";
    return queryValue;
  });
  const [category, setCategory] = useState(() => {
    const categoryValue = searchParams.get("category") || "all";
    return categoryValue;
  });
  const [vendor, setVendor] = useState(
    () => searchParams.get("vendor") || "all",
  );
  const [availability, setAvailability] = useState("all");
  const [pricePeriod, setPricePeriod] = useState("daily");
  const [priceRange, setPriceRange] = useState([0, null]);
  const [sortBy, setSortBy] = useState("relevance");
  const cachedProducts = readCache(rentalProductsCacheKey);
  const cachedCategories = readCache(rentalCategoriesCacheKey);
  const [products, setProducts] = useState(cachedProducts || []);
  const [categoryRecords, setCategoryRecords] = useState(
    cachedCategories || [],
  );
  const [loading, setLoading] = useState(!cachedProducts);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    const requestConfig = { signal: controller.signal };
    const hasCachedProducts = Boolean(readCache(rentalProductsCacheKey));

    axios
      .get(`${backendUrl}/products?per_page=100`, requestConfig)
      .then((response) => {
        const productData = response.data.products;
        const nextProducts = Array.isArray(productData)
          ? productData
          : productData?.data || [];
        setProducts(nextProducts);
        setLoading(false);
        localStorage.setItem(
          rentalProductsCacheKey,
          JSON.stringify(nextProducts),
        );
      })
      .catch(() => {
        if (!hasCachedProducts) setLoading(false);
      });

    axios
      .get(`${backendUrl}/categories`, requestConfig)
      .then((response) => {
        const nextCategories = response.data.categories || [];
        setCategoryRecords(nextCategories);
        localStorage.setItem(
          rentalCategoriesCacheKey,
          JSON.stringify(nextCategories),
        );
      })
      .catch(() => undefined);

    return () => controller.abort();
  }, [backendUrl]);

  const imageUrl = useCallback(
    (product) => {
      const image =
        product.images?.find((item) => item.is_primary) || product.images?.[0];
      if (!image?.image_url) return "/logo.png";
      if (image.image_url.startsWith("http")) return image.image_url;
      const apiBase = backendUrl.replace(/\/api\/?$/, "");
      return `${apiBase}/storage/${image.image_url.replace(/^\/+/, "")}`;
    },
    [backendUrl],
  );

  const rentalItems = useMemo(
    () =>
      products.map((product) => ({
        id: product.id,
        title: product.name,
        category: product.category?.name || "Uncategorized",
        vendor: product.vendor?.business_name || "Unknown vendor",
        rating: product.rating || 0,
        badge: product.is_featured
          ? "FEATURED"
          : product.availability_status?.toUpperCase() || "AVAILABLE",
        image: imageUrl(product),
        description: product.description || "No description available.",
        prices: {
          hourly: Number(product.price_hourly || 0),
          daily: Number(product.price_daily || product.price || 0),
          weekly: Number(product.price_weekly || 0),
          monthly: Number(product.price_monthly || 0),
        },
        location: [product.vendor?.city, product.vendor?.country]
          .filter(Boolean)
          .join(", "),
        available: product.availability_status === "available",
        actionLabel: t.common?.rent || "Rent Now",
      })),
    [products, imageUrl, t.common?.rent],
  );

  const periodLabels = {
    hourly: "hour",
    daily: "day",
    weekly: "week",
    monthly: "month",
  };
  const periodItems = useMemo(
    () =>
      rentalItems.map((item) => ({
        ...item,
        price: item.prices[pricePeriod],
      })),
    [rentalItems, pricePeriod],
  );

  const maxPrice = useMemo(
    () =>
      Math.max(
        1,
        Math.ceil(Math.max(...periodItems.map((item) => item.price), 0)),
      ),
    [periodItems],
  );
  const selectedPriceRange = useMemo(
    () => [
      Math.min(priceRange[0], maxPrice),
      Math.min(priceRange[1] ?? maxPrice, maxPrice),
    ],
    [priceRange, maxPrice],
  );

  const categories = useMemo(
    () => [
      { value: "all", label: productStrings.allCategories || "All Categories" },
      ...categoryRecords.map((item) => ({
        value: item.name,
        label: item.name,
      })),
    ],
    [categoryRecords, productStrings.allCategories],
  );

  const vendors = useMemo(
    () => [
      { value: "all", label: productStrings.allVendors || "All Vendors" },
      ...Array.from(
        new Map(
          products
            .map((item) => [
              item.vendor?.business_name,
              item.vendor?.business_name,
            ])
            .filter(([name]) => name),
        ),
      )
        .keys()
        .map((name) => ({ value: name, label: name })),
    ],
    [products, productStrings.allVendors],
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

  const filteredItems = useMemo(() => {
    const filtered = periodItems.filter((item) => {
      const matchesSearch =
        search.length === 0 ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.location.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase()) ||
        item.vendor.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = category === "all" || item.category === category;
      const matchesVendor = vendor === "all" || item.vendor === vendor;
      const matchesAvailability =
        availability === "all" ||
        (availability === "available" && item.available) ||
        (availability === "unavailable" && !item.available);
      const matchesPrice =
        item.price >= selectedPriceRange[0] &&
        item.price <= selectedPriceRange[1];

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
  }, [
    periodItems,
    search,
    category,
    vendor,
    availability,
    selectedPriceRange,
    sortBy,
  ]);

  useEffect(() => {
    const vendorFromQuery = searchParams.get("vendor");
    const searchFromQuery =
      searchParams.get("search") || searchParams.get("query") || "";
    const categoryFromQuery = searchParams.get("category") || "all";

    startTransition(() => {
      setVendor(vendorFromQuery || "all");
      setSearch(searchFromQuery);
      setCategory(categoryFromQuery);
    });
  }, [searchParams]);

  const handleRentNow = (item) => {
    if (!item.available) {
      return;
    }

    navigate(`/rentals/${item.id}`);
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
          className="flex justify-between items-center "
        >
          <Col
            flex="1"
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            <Text
              style={{
                display: "block",
                color: "#16a34a",
                fontSize: 12,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
              }}
            >
              {productStrings.filter || "Filter Products"}
            </Text>
            <div>
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
            </div>
          </Col>

          <Col
            flex="none"
            style={{
              display: "flex",
              justifyContent: "flex-end",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                whiteSpace: "nowrap",
              }}
            >
              <Text
                style={{
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
            </div>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={6}>
            <Card
              title={productStrings.filter || "Filter Products"}
              style={{ borderRadius: 24 }}
              styles={{ body: { padding: 24 } }}
            >
              <Space orientation="vertical" size={24} style={{ width: "100%" }}>
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
                  <Select
                    value={pricePeriod}
                    onChange={(nextPeriod) => {
                      setPricePeriod(nextPeriod);
                      setPriceRange([0, null]);
                    }}
                    options={Object.entries(periodLabels).map(
                      ([value, label]) => ({
                        value,
                        label: `Per ${label}`,
                      }),
                    )}
                    style={{ marginTop: 12, width: "100%" }}
                  />
                  <Slider
                    range
                    min={0}
                    max={maxPrice}
                    value={selectedPriceRange}
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
                    <Text>
                      ETB {selectedPriceRange[0].toLocaleString()}/
                      {periodLabels[pricePeriod]}
                    </Text>
                    <Text>
                      ETB {selectedPriceRange[1].toLocaleString()}/
                      {periodLabels[pricePeriod]}
                    </Text>
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

                <Space orientation="vertical" style={{ width: "100%" }}>
                  <Button
                    type="default"
                    block
                    onClick={() => {
                      setSearch("");
                      setCategory("all");
                      setVendor("all");
                      setAvailability("all");
                      setPricePeriod("daily");
                      setPriceRange([0, null]);
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
              {loading ? (
                <Text>Loading rentals...</Text>
              ) : (
                filteredItems.map((item) => (
                  <Col key={item.id} xs={24} sm={12} lg={12}>
                    <ItemCard
                      item={item}
                      onAction={handleRentNow}
                      onSelect={handleSelectItem}
                    />
                  </Col>
                ))
              )}
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Rental;
