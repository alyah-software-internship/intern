import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Row, Col, Typography } from "antd";
import ItemCard from "../../component/home/ItemCard.jsx";
import { rentalItems } from "../../assets/dummyAssets";
import { useTranslation } from "../../component/LanguageProvider.jsx";

const { Title, Text } = Typography;

const VendorPage = () => {
  const { translation: t } = useTranslation();
  const location = useLocation();
  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );
  const vendorQuery = params.get("vendor") || "";

  const filtered = useMemo(() => {
    const name = decodeURIComponent(vendorQuery || "");
    if (!name) return rentalItems;
    return rentalItems.filter(
      (it) =>
        (it.vendor && it.vendor.toLowerCase() === name.toLowerCase()) ||
        (it.vendorInfo &&
          it.vendorInfo.name &&
          it.vendorInfo.name.toLowerCase() === name.toLowerCase()),
    );
  }, [vendorQuery]);

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ marginBottom: 18 }}>
        <Title level={2}>
          {vendorQuery
            ? `${vendorQuery} ${t.common?.listings || "Listings"}`
            : t.nav?.rentals || "Vendor Listings"}
        </Title>
        <Text type="secondary">
          {filtered.length} {t.common?.items || "items"}
        </Text>
      </div>

      <Row gutter={[24, 24]}>
        {filtered.map((item) => (
          <Col key={item.id} xs={24} sm={12} lg={8}>
            <ItemCard item={item} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default VendorPage;
