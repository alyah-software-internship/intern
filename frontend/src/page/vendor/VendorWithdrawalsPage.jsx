import { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Table,
  Empty,
  Spin,
  Button,
  message,
  Modal,
  Form,
  InputNumber,
  Tag,
  Space,
  Popconfirm,
  Descriptions,
  Drawer,
} from "antd";
import { AppContext } from "../../context/AppContext.jsx";
import { formatVendorMoney } from "../../utils/currency.js";
import { DeleteOutlined, EyeOutlined, CopyOutlined } from "@ant-design/icons";

const VendorWithdrawalsPage = () => {
  const { backendUrl } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [withdrawals, setWithdrawals] = useState([]);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/vendor/withdrawals`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      setWithdrawals(response.data.withdrawals?.data || []);
    } catch (err) {
      messageApi.error("Failed to load withdrawals");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelWithdrawal = async (id) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/vendor/withdrawals/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );

      if (response.data.success) {
        messageApi.success("Withdrawal cancelled successfully");
        fetchWithdrawals();
      }
    } catch (err) {
      messageApi.error(
        err.response?.data?.message || "Failed to cancel withdrawal",
      );
    }
  };

  const handleViewDetails = (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setDrawerVisible(true);
  };

  const statusColors = {
    pending: "blue",
    approved: "cyan",
    processing: "orange",
    completed: "green",
    rejected: "red",
  };

  const columns = [
    {
      title: "Amount",
      dataIndex: "amount",
      render: (amount) => formatVendorMoney(amount),
      width: 120,
    },
    {
      title: "Status",
      dataIndex: "payout_status",
      render: (status) => (
        <Tag color={statusColors[status] || "gray"}>
          {status?.toUpperCase()}
        </Tag>
      ),
      width: 120,
    },
    {
      title: "Bank Account",
      dataIndex: ["payment_method", "account_number"],
      render: (account) => account || "-",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Bank Name",
      dataIndex: ["payment_method", "bank_name"],
      render: (bank) => bank || "-",
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
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          />
          {record.payout_status === "pending" && (
            <Popconfirm
              title="Cancel Withdrawal?"
              description="This action will return the amount to your available balance."
              onConfirm={() => handleCancelWithdrawal(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          )}
        </Space>
      ),
      width: 100,
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

      <h1>Withdrawal Requests</h1>

      <Card>
        <Table
          columns={columns}
          dataSource={withdrawals}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          loading={loading}
          scroll={{ x: 1200 }}
          locale={{
            emptyText: <Empty description="No withdrawal requests" />,
          }}
        />
      </Card>

      {/* Withdrawal Details Drawer */}
      <Drawer
        title="Withdrawal Details"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={500}
      >
        {selectedWithdrawal && (
          <div>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Amount">
                <strong>{formatVendorMoney(selectedWithdrawal.amount)}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={statusColors[selectedWithdrawal.payout_status]}>
                  {selectedWithdrawal.payout_status?.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Requested">
                {new Date(selectedWithdrawal.created_at).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Approved">
                {selectedWithdrawal.approved_at
                  ? new Date(selectedWithdrawal.approved_at).toLocaleString()
                  : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Processing">
                {selectedWithdrawal.processing_at
                  ? new Date(selectedWithdrawal.processing_at).toLocaleString()
                  : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Completed">
                {selectedWithdrawal.completed_at
                  ? new Date(selectedWithdrawal.completed_at).toLocaleString()
                  : "-"}
              </Descriptions.Item>

              {selectedWithdrawal.transaction_id && (
                <Descriptions.Item label="Transaction ID">
                  <Space>
                    <code>{selectedWithdrawal.transaction_id}</code>
                    <Button
                      type="text"
                      size="small"
                      icon={<CopyOutlined />}
                      onClick={() => {
                        navigator.clipboard.writeText(
                          selectedWithdrawal.transaction_id,
                        );
                        messageApi.success("Copied to clipboard");
                      }}
                    />
                  </Space>
                </Descriptions.Item>
              )}

              <Descriptions.Item label="Payment Method">
                <div>
                  <div>
                    <strong>Bank:</strong>{" "}
                    {selectedWithdrawal.payment_method?.bank_name}
                  </div>
                  <div>
                    <strong>Account:</strong>{" "}
                    {selectedWithdrawal.payment_method?.account_number}
                  </div>
                  <div>
                    <strong>Name:</strong>{" "}
                    {selectedWithdrawal.payment_method?.account_holder_name}
                  </div>
                </div>
              </Descriptions.Item>

              {selectedWithdrawal.rejection_reason && (
                <Descriptions.Item label="Rejection Reason">
                  <p style={{ color: "#ef4444" }}>
                    {selectedWithdrawal.rejection_reason}
                  </p>
                </Descriptions.Item>
              )}

              {selectedWithdrawal.admin_note && (
                <Descriptions.Item label="Admin Notes">
                  {selectedWithdrawal.admin_note}
                </Descriptions.Item>
              )}

              <Descriptions.Item label="Notes">
                {selectedWithdrawal.notes || "-"}
              </Descriptions.Item>
            </Descriptions>

            {selectedWithdrawal.payout_status === "pending" && (
              <Button
                danger
                block
                style={{ marginTop: 16 }}
                onClick={() => {
                  handleCancelWithdrawal(selectedWithdrawal.id);
                  setDrawerVisible(false);
                }}
              >
                Cancel This Withdrawal
              </Button>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default VendorWithdrawalsPage;
