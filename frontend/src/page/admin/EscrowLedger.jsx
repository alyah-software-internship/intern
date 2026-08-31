import { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Card,
  Input,
  Space,
  Table,
  Tag,
  Typography,
  Button,
  message,
} from "antd";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { AppContext } from "../../context/AppContext.jsx";
import { useTheme } from "../../context/ThemeProvider.jsx";

const { Title, Text } = Typography;
const authConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
});

const EscrowLedger = () => {
  const { backendUrl } = useContext(AppContext);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [ledger, setLedger] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();

  const fetchLedger = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${backendUrl}/admin/escrow-ledger?per_page=100`,
        authConfig(),
      );
      const data = response.data?.ledger?.data || response.data?.ledger || [];
      setLedger(Array.isArray(data) ? data : []);
    } catch (error) {
      messageApi.error(
        error.response?.data?.message || "Unable to load escrow ledger.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLedger();
  }, [backendUrl]);

  const filteredLedger = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return ledger;

    return ledger.filter((entry) => {
      const customer = entry.customer || {};
      const vendor = entry.vendor || {};
      const product = entry.booking?.product || {};
      const customerName =
        `${customer.first_name || ""} ${customer.last_name || ""}`.trim();
      const vendorName =
        `${vendor.user?.first_name || ""} ${vendor.user?.last_name || ""}`.trim();

      return (
        customerName.toLowerCase().includes(term) ||
        customer.email?.toLowerCase().includes(term) ||
        vendor.business_name?.toLowerCase().includes(term) ||
        vendorName.toLowerCase().includes(term) ||
        product.name?.toLowerCase().includes(term) ||
        entry.status?.toLowerCase().includes(term)
      );
    });
  }, [ledger, search]);

  const columns = [
    {
      title: "BOOKING",
      key: "booking",
      render: (_, entry) => (
        <Space direction="vertical" size={2}>
          <Text strong>{entry.booking?.booking_reference || "-"}</Text>
          <Text type="secondary">
            {entry.booking?.product?.name || "No product"}
          </Text>
        </Space>
      ),
    },
    {
      title: "CUSTOMER",
      key: "customer",
      render: (_, entry) => {
        const customer = entry.customer || {};
        return (
          <Text>
            {`${customer.first_name || ""} ${customer.last_name || ""}`.trim() ||
              customer.email ||
              "-"}
          </Text>
        );
      },
    },
    {
      title: "VENDOR",
      key: "vendor",
      render: (_, entry) =>
        entry.vendor?.business_name || entry.vendor?.user?.email || "-",
    },
    {
      title: "AMOUNT",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => `$${Number(amount || 0).toFixed(2)}`,
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const map = {
          held: "gold",
          released: "green",
          refunded: "blue",
          deducted: "red",
          pending: "orange",
          disputed: "magenta",
        };
        return (
          <Tag color={map[status] || "default"}>
            {(status || "pending").toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "HELD AT",
      key: "held_at",
      render: (_, entry) =>
        entry.held_at ? new Date(entry.held_at).toLocaleString() : "-",
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
              ESCROW LEDGER
            </Text>
            <Title level={2} style={{ margin: 0 }}>
              Security Deposit Ledger
            </Title>
            <Text type="secondary">
              Track held, released, refunded, and deducted deposits.
            </Text>
          </div>

          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchLedger}
              loading={loading}
            >
              Refresh
            </Button>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search ledger"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              allowClear
            />
          </Space>
        </div>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredLedger}
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1100 }}
          locale={{ emptyText: "No escrow ledger entries found." }}
        />
      </Card>
    </div>
  );
};

export default EscrowLedger;
