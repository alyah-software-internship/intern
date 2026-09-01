import { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Card,
  Col,
  Empty,
  Row,
  Spin,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import { WalletOutlined, ReloadOutlined } from "@ant-design/icons";
import { AppContext } from "../../context/AppContext.jsx";
import { useTheme } from "../../context/ThemeProvider.jsx";

const { Title, Text } = Typography;
const authConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
});

const Wallet = () => {
  const { backendUrl } = useContext(AppContext);
  const { theme } = useTheme();
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const isDark = theme === "dark";
  const surface = isDark ? "#0d1b2d" : "#fff";
  const text = isDark ? "#f8fafc" : "#16251b";

  const loadWallet = async () => {
    try {
      setLoading(true);
      const [walletResponse, transactionResponse] = await Promise.all([
        axios.get(`${backendUrl}/vendor/wallet`, authConfig()),
        axios.get(`${backendUrl}/vendor/wallet/transactions`, authConfig()),
      ]);
      setSummary(walletResponse.data?.wallet || null);
      const rows = transactionResponse.data?.transactions;
      setTransactions(Array.isArray(rows) ? rows : rows?.data || []);
    } catch (error) {
      messageApi.error(
        error.response?.data?.message || "Unable to load wallet.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (backendUrl) {
      Promise.resolve().then(loadWallet);
    }
  }, [backendUrl]);

  const money = (value) =>
    `${summary?.currency || "ETB"} ${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  const columns = [
    {
      title: "Date",
      dataIndex: "created_at",
      render: (value) => (value ? new Date(value).toLocaleDateString() : "-"),
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (value) => <Tag>{String(value || "").replaceAll("_", " ")}</Tag>,
    },
    { title: "Amount", dataIndex: "amount", render: (value) => money(value) },
    {
      title: "Status",
      dataIndex: "status",
      render: (value) => (
        <Tag color={value === "completed" ? "green" : "gold"}>{value}</Tag>
      ),
    },
    { title: "Reference", dataIndex: "reference" },
  ];

  return (
    <div className="vendor-wallet-page">
      {contextHolder}
      <div className="vendor-wallet-heading">
        <div>
          <Text className="operator-kicker">Financial center</Text>
          <Title level={2} style={{ color: text }}>
            Vendor wallet
          </Title>
          <Text type="secondary">
            Track available earnings, pending releases, and ledger activity.
          </Text>
        </div>
        <Button
          icon={<ReloadOutlined />}
          onClick={loadWallet}
          loading={loading}
        >
          Refresh
        </Button>
      </div>
      {loading && !summary ? (
        <Card>
          <Spin size="large" />
        </Card>
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {[
              ["Available balance", summary?.available_balance],
              ["Pending balance", summary?.pending_balance],
              ["Total earnings", summary?.total_earnings],
              ["Total withdrawn", summary?.total_withdrawn],
            ].map(([label, value]) => (
              <Col xs={24} sm={12} lg={6} key={label}>
                <Card style={{ background: surface, borderRadius: 14 }}>
                  <WalletOutlined style={{ color: "#16803c", fontSize: 20 }} />
                  <Text
                    type="secondary"
                    style={{ display: "block", marginTop: 12 }}
                  >
                    {label}
                  </Text>
                  <Title level={3} style={{ color: text, margin: "6px 0" }}>
                    {money(value)}
                  </Title>
                </Card>
              </Col>
            ))}
          </Row>
          <Card
            title="Wallet transactions"
            style={{ marginTop: 16, background: surface, borderRadius: 14 }}
          >
            <Table
              rowKey="id"
              columns={columns}
              dataSource={transactions}
              loading={loading}
              locale={{
                emptyText: <Empty description="No wallet transactions yet" />,
              }}
              pagination={{ pageSize: 10 }}
              scroll={{ x: 680 }}
            />
          </Card>
        </>
      )}
    </div>
  );
};

export default Wallet;
