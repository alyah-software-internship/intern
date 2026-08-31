import { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  Card,
  Input,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import { EyeOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { AppContext } from "../../context/AppContext.jsx";
import { useTheme } from "../../context/ThemeProvider.jsx";

const { Title, Text } = Typography;
const authConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
});

const VendorsDirectory = () => {
  const { backendUrl } = useContext(AppContext);
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === "dark";

  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${backendUrl}/admin/vendors?per_page=100`,
        authConfig(),
      );

      const data = response.data?.vendors?.data || response.data?.vendors || [];
      const approvedVendors = (Array.isArray(data) ? data : []).filter(
        (vendor) => (vendor.verification_status || "pending") === "approved",
      );

      setVendors(approvedVendors);
    } catch (error) {
      messageApi.error(
        error.response?.data?.message || "Unable to load vendor directory.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, [backendUrl]);

  const filteredVendors = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return vendors;

    return vendors.filter(
      (vendor) =>
        vendor.business_name?.toLowerCase().includes(term) ||
        vendor.user?.email?.toLowerCase().includes(term) ||
        vendor.user?.full_name?.toLowerCase().includes(term) ||
        vendor.business_type?.toLowerCase().includes(term),
    );
  }, [vendors, search]);

  const columns = [
    {
      title: "BUSINESS",
      key: "business",
      render: (_, vendor) => {
        const user = vendor.user || {};
        const initials = (user.full_name || vendor.business_name || "VD")
          .split(" ")
          .filter(Boolean)
          .slice(0, 2)
          .map((part) => part[0])
          .join("")
          .toUpperCase();

        return (
          <Space>
            <Avatar style={{ background: "#fed7aa", color: "#c2410c" }}>
              {initials}
            </Avatar>
            <div>
              <Text strong>{vendor.business_name || "Unnamed Vendor"}</Text>
              <Text type="secondary" style={{ display: "block" }}>
                {user.email || "No email"}
              </Text>
            </div>
          </Space>
        );
      },
    },
    {
      title: "OWNER",
      key: "owner",
      render: (_, vendor) =>
        vendor.user?.full_name ||
        `${vendor.user?.first_name || ""} ${vendor.user?.last_name || ""}`.trim() ||
        "Unknown",
    },
    {
      title: "TYPE",
      dataIndex: "business_type",
      key: "business_type",
      render: (type) => (
        <Tag color="blue">
          {type?.replaceAll("_", " ").toUpperCase() || "-"}
        </Tag>
      ),
    },
    {
      title: "STATUS",
      key: "status",
      render: (_, vendor) => (
        <Tag color={vendor.is_active ? "green" : "red"}>
          {vendor.is_active ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "ACTION",
      key: "action",
      width: 120,
      render: (_, vendor) => (
        <Button
          size="small"
          type="link"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/admin/vendors/${vendor.id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div
      style={{
        background: isDark ? "#060b17" : "#f4f8fd",
        minHeight: "100%",
        padding: "24px",
      }}
    >
      {contextHolder}

      <Card
        style={{
          borderRadius: 20,
          background: isDark ? "#0f172a" : "#fff",
          border: isDark
            ? "1px solid rgba(255,255,255,0.08)"
            : "1px solid rgba(15,23,42,0.07)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            marginBottom: 20,
            flexWrap: "wrap",
          }}
        >
          <div>
            <Text
              style={{ display: "block", letterSpacing: 1.2, fontSize: 12 }}
            >
              VENDOR DIRECTORY
            </Text>
            <Title level={2} style={{ margin: 0 }}>
              Approved Vendors
            </Title>
            <Text type="secondary">
              View and manage approved vendor accounts.
            </Text>
          </div>

          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchVendors}
              loading={loading}
            >
              Refresh
            </Button>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search vendors"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              allowClear
            />
          </Space>
        </div>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredVendors}
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 900 }}
          locale={{ emptyText: "No approved vendors found." }}
        />
      </Card>
    </div>
  );
};

export default VendorsDirectory;
