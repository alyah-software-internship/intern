import React from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Card, Space, Typography, Tag } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useTheme } from "../../context/ThemeProvider.jsx";
import { useTranslation } from "../../component/LanguageProvider.jsx";
import {
  getProductsByVendor,
  getCategoryById,
} from "../../assets/dummyAssets.js";

const { Title, Text } = Typography;

const Products = () => {
  const navigate = useNavigate();
  const { translation: t, lang } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const products = getProductsByVendor("vend-1");

  const columns = [
    {
      title: t.vendor?.equipmentDetails || "Equipment Details",
      dataIndex: "name",
      key: "details",
      width: 320,
      render: (_, record) => {
        const category = getCategoryById(record.category);
        const imageUrl =
          record.images?.[0] ||
          "https://via.placeholder.com/72x72?text=No+Image";
        return (
          <Space align="start" style={{ minWidth: 0 }}>
            <div
              style={{
                width: 72,
                minWidth: 72,
                height: 72,
                borderRadius: 16,
                overflow: "hidden",
                background: isDark ? "#111827" : "#f3f7fb",
                display: "grid",
                placeItems: "center",
              }}
            >
              <img
                src={imageUrl}
                alt={record.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
            <div style={{ minWidth: 0 }}>
              <Text
                strong
                style={{ fontSize: 16, color: isDark ? "#f8fafc" : "#0f172a" }}
              >
                {lang === "am" ? record.nameAm || record.name : record.name}
              </Text>
              <div>
                <Text type="secondary">SKU: {record.id}</Text>
              </div>
              <div>
                <Text
                  type="secondary"
                  style={{ maxWidth: 360, display: "block" }}
                >
                  {lang === "am"
                    ? record.descriptionAm || record.description
                    : record.description}
                </Text>
              </div>
            </div>
          </Space>
        );
      },
    },
    {
      title: t.vendor?.industryCategory || "Industry Category",
      dataIndex: "category",
      key: "category",
      render: (categoryId) => {
        const category = getCategoryById(categoryId);
        return (
          <div>
            <Text strong>
              {lang === "am"
                ? category?.nameAm || category?.name
                : category?.name}
            </Text>
            <div>
              <Text type="secondary">
                {lang === "am"
                  ? category?.descriptionAm || category?.description
                  : category?.description}
              </Text>
            </div>
          </div>
        );
      },
    },
    {
      title: t.vendor?.dailyPricing || "Daily Pricing",
      dataIndex: "pricing",
      key: "pricing",
      render: (pricing) => (
        <Text strong>
          {lang === "am"
            ? pricing?.daily?.labelAm || pricing?.daily?.label
            : pricing?.daily?.label}
        </Text>
      ),
    },
    {
      title: t.vendor?.refundableDeposit || "Refundable Deposit",
      dataIndex: ["rentalPolicies", "securityDeposit", "label"],
      key: "deposit",
      render: (_, record) => {
        const label =
          lang === "am"
            ? record.rentalPolicies.securityDeposit.labelAm
            : record.rentalPolicies.securityDeposit.label;
        return <Text>{label}</Text>;
      },
    },
    {
      title: t.vendor?.calendarState || "Calendar State",
      dataIndex: ["availability", "status"],
      key: "availability",
      render: (_, record) => {
        const status =
          lang === "am"
            ? record.availability.statusAm || record.availability.status
            : record.availability.status;
        return (
          <Tag
            color={
              record.availability.status === "available" ? "success" : "default"
            }
            style={{ borderRadius: 999 }}
          >
            {status}
          </Tag>
        );
      },
    },
    {
      title: t.vendor?.inventoryActions || "Inventory Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={() => navigate(`/vendor/add-product`)}
          >
            {t.vendor?.editProduct || "Edit Pricing"}
          </Button>
          <Button type="text" danger icon={<DeleteOutlined />}>
            {t.vendor?.deleteProduct || "Delete"}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: isDark ? "#060b17" : "#f3f7fb",
        padding: 24,
      }}
    >
      <Card
        style={{
          borderRadius: 24,
          background: isDark ? "#0b1120" : "#ffffff",
          border: isDark
            ? "1px solid rgba(255,255,255,0.1)"
            : "1px solid rgba(15,23,42,0.08)",
        }}
        bodyStyle={{ padding: 24 }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div>
            <Title
              level={4}
              style={{ margin: 0, color: isDark ? "#f8fafc" : "#0f172a" }}
            >
              {t.vendor?.inventoryCatalogTitle || "Inventory Catalog Manager"}
            </Title>
            <Text type="secondary">
              {t.vendor?.inventoryCatalogSubtitle ||
                "List heavy machinery, verify insurance files, and block unavailable calendar dates"}
            </Text>
          </div>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/vendor/add-product")}
          >
            {t.vendor?.listNewEquipment || "List New Equipment"}
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={products}
          rowKey="id"
          pagination={false}
          bordered
          style={{ background: isDark ? "#0b1120" : "#fff" }}
        />
      </Card>
    </div>
  );
};

export default Products;
