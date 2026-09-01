import { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Empty,
  Spin,
  Tabs,
  Button,
  message,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
} from "antd";
import { AppContext } from "../../context/AppContext.jsx";
import {
  WalletOutlined,
  DollarOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";

const VendorWalletPage = () => {
  const { backendUrl } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const [walletRes, transactionsRes, withdrawalsRes] = await Promise.all([
        axios.get(`${backendUrl}/vendor/wallet`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }),
        axios.get(`${backendUrl}/vendor/wallet/transactions`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }),
        axios.get(`${backendUrl}/vendor/withdrawals`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }),
      ]);

      setWallet(walletRes.data.wallet);
      setTransactions(transactionsRes.data.transactions?.data || []);
      setWithdrawals(withdrawalsRes.data.withdrawals?.data || []);
    } catch (err) {
      messageApi.error("Failed to load wallet data");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestWithdrawal = async (values) => {
    try {
      setSubmitting(true);
      const response = await axios.post(
        `${backendUrl}/vendor/withdrawals`,
        {
          amount: values.amount,
          payment_method_id: values.payment_method_id,
          notes: values.notes,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );

      if (response.data.success) {
        messageApi.success("Withdrawal request submitted successfully");
        setIsModalVisible(false);
        form.resetFields();
        fetchWalletData();
      }
    } catch (err) {
      messageApi.error(
        err.response?.data?.message || "Failed to request withdrawal",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const transactionColumns = [
    {
      title: "Date",
      dataIndex: "created_at",
      render: (date) => new Date(date).toLocaleDateString(),
      width: 120,
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (type) => (
        <span style={{ textTransform: "capitalize" }}>
          {type.replace(/_/g, " ")}
        </span>
      ),
      width: 150,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (amount, record) => (
        <span style={{ color: amount > 0 ? "#22c55e" : "#ef4444" }}>
          {amount > 0 ? "+" : ""} ETB {Math.abs(amount)}
        </span>
      ),
      width: 120,
    },
    {
      title: "Balance",
      dataIndex: "balance_after",
      render: (balance) => `ETB ${balance}`,
      width: 120,
    },
    {
      title: "Description",
      dataIndex: "description",
      ellipsis: true,
    },
  ];

  const withdrawalColumns = [
    {
      title: "Amount",
      dataIndex: "amount",
      render: (amount) => `ETB ${amount}`,
      width: 120,
    },
    {
      title: "Status",
      dataIndex: "payout_status",
      render: (status) => {
        const colors = {
          pending: "blue",
          approved: "blue",
          processing: "orange",
          completed: "green",
          rejected: "red",
        };
        return (
          <span
            style={{
              color: colors[status] || "gray",
              textTransform: "uppercase",
              fontSize: 12,
            }}
          >
            {status}
          </span>
        );
      },
      width: 120,
    },
    {
      title: "Method",
      dataIndex: ["payment_method", "account_number"],
      ellipsis: true,
      width: 150,
    },
    {
      title: "Requested",
      dataIndex: "created_at",
      render: (date) => new Date(date).toLocaleDateString(),
      width: 120,
    },
    {
      title: "Approved",
      dataIndex: "approved_at",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "-"),
      width: 120,
    },
    {
      title: "Completed",
      dataIndex: "completed_at",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "-"),
      width: 120,
    },
  ];

  if (loading) {
    return (
      <div style={{ minHeight: "70vh", display: "grid", placeItems: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: "40px 20px", maxWidth: 1200, margin: "0 auto" }}>
      {contextHolder}

      <h1>My Wallet</h1>

      {/* Wallet Summary */}
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Available Balance"
              value={wallet?.available_balance || 0}
              prefix="ETB "
              valueStyle={{ color: "#22c55e" }}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Pending Balance"
              value={wallet?.pending_balance || 0}
              prefix="ETB "
              valueStyle={{ color: "#f59e0b" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Earnings"
              value={wallet?.total_earnings || 0}
              prefix="ETB "
              valueStyle={{ color: "#0066cc" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Withdrawn"
              value={wallet?.total_withdrawn || 0}
              prefix="ETB "
              valueStyle={{ color: "#6366f1" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Withdrawal Request Button */}
      <Card style={{ marginBottom: 32 }} title="Actions">
        <Button
          type="primary"
          size="large"
          icon={<ArrowDownOutlined />}
          onClick={() => setIsModalVisible(true)}
          disabled={!wallet || (wallet?.available_balance || 0) <= 0}
        >
          Request Withdrawal
        </Button>
      </Card>

      {/* Withdrawal Modal */}
      <Modal
        title="Request Withdrawal"
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleRequestWithdrawal}>
          <Form.Item
            label="Available Balance"
            value={`ETB ${wallet?.available_balance || 0}`}
          >
            <Input disabled value={`ETB ${wallet?.available_balance || 0}`} />
          </Form.Item>

          <Form.Item
            name="amount"
            label="Withdrawal Amount"
            rules={[
              { required: true, message: "Please enter amount" },
              {
                validator: (_, value) => {
                  if (value && value > (wallet?.available_balance || 0)) {
                    return Promise.reject("Insufficient balance");
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber
              min={1}
              max={wallet?.available_balance || 0}
              step={10}
              style={{ width: "100%" }}
              addonAfter="ETB"
            />
          </Form.Item>

          <Form.Item
            name="payment_method_id"
            label="Payment Method"
            rules={[{ required: true, message: "Please select a method" }]}
          >
            <Select placeholder="Select payment method" />
          </Form.Item>

          <Form.Item name="notes" label="Additional Notes (optional)">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={submitting}>
            Submit Withdrawal Request
          </Button>
        </Form>
      </Modal>

      {/* Tabs for Transactions and Withdrawals */}
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: "1",
            label: "Recent Transactions",
            children: (
              <Table
                columns={transactionColumns}
                dataSource={transactions}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                locale={{
                  emptyText: <Empty description="No transactions" />,
                }}
              />
            ),
          },
          {
            key: "2",
            label: "Withdrawal History",
            children: (
              <Table
                columns={withdrawalColumns}
                dataSource={withdrawals}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                locale={{
                  emptyText: <Empty description="No withdrawals" />,
                }}
              />
            ),
          },
        ]}
      />
    </div>
  );
};

export default VendorWalletPage;
