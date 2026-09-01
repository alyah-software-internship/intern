import { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Table,
  Empty,
  Spin,
  Button,
  message,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Drawer,
  Descriptions,
  Row,
  Col,
  Statistic,
  Popconfirm,
  Tabs,
} from "antd";
import { AppContext } from "../../context/AppContext.jsx";
import {
  CheckOutlined,
  CloseOutlined,
  EyeOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

const AdminWithdrawalsPage = () => {
  const { backendUrl } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [withdrawals, setWithdrawals] = useState([]);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [actionModal, setActionModal] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    fetchWithdrawals();
  }, [statusFilter]);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const params = statusFilter ? { status: statusFilter } : {};
      const response = await axios.get(`${backendUrl}/admin/withdrawals`, {
        params,
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

  const handleApprove = async () => {
    try {
      setActionLoading(true);
      const response = await axios.post(
        `${backendUrl}/admin/withdrawals/${selectedWithdrawal.id}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );

      if (response.data.success) {
        messageApi.success("Withdrawal approved");
        fetchWithdrawals();
        setDrawerVisible(false);
      }
    } catch (err) {
      messageApi.error(
        err.response?.data?.message || "Failed to approve withdrawal",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (values) => {
    try {
      setActionLoading(true);
      const response = await axios.post(
        `${backendUrl}/admin/withdrawals/${selectedWithdrawal.id}/reject`,
        {
          rejection_reason: values.rejection_reason,
          admin_note: values.admin_note,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );

      if (response.data.success) {
        messageApi.success("Withdrawal rejected");
        fetchWithdrawals();
        setActionModal(null);
        setDrawerVisible(false);
        form.resetFields();
      }
    } catch (err) {
      messageApi.error(
        err.response?.data?.message || "Failed to reject withdrawal",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkProcessing = async () => {
    try {
      setActionLoading(true);
      const response = await axios.post(
        `${backendUrl}/admin/withdrawals/${selectedWithdrawal.id}/processing`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );

      if (response.data.success) {
        messageApi.success("Withdrawal marked as processing");
        fetchWithdrawals();
        setDrawerVisible(false);
      }
    } catch (err) {
      messageApi.error(
        err.response?.data?.message || "Failed to update withdrawal",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkComplete = async (values) => {
    try {
      setActionLoading(true);
      const response = await axios.post(
        `${backendUrl}/admin/withdrawals/${selectedWithdrawal.id}/complete`,
        {
          transaction_id: values.transaction_id,
          admin_note: values.admin_note,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );

      if (response.data.success) {
        messageApi.success("Withdrawal marked as complete");
        fetchWithdrawals();
        setActionModal(null);
        setDrawerVisible(false);
        form.resetFields();
      }
    } catch (err) {
      messageApi.error(
        err.response?.data?.message || "Failed to complete withdrawal",
      );
    } finally {
      setActionLoading(false);
    }
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
      title: "Vendor",
      dataIndex: ["vendor", "name"],
      ellipsis: true,
      width: 150,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (amount) => `ETB ${amount}`,
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
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedWithdrawal(record);
              setDrawerVisible(true);
            }}
          />
        </Space>
      ),
      width: 80,
    },
  ];

  const stats = {
    pending: withdrawals.filter((w) => w.payout_status === "pending").length,
    approved: withdrawals.filter((w) => w.payout_status === "approved").length,
    processing: withdrawals.filter((w) => w.payout_status === "processing")
      .length,
    completed: withdrawals.filter((w) => w.payout_status === "completed")
      .length,
    rejected: withdrawals.filter((w) => w.payout_status === "rejected").length,
  };

  const statusTabs = [
    { key: "pending", label: `Pending (${stats.pending})` },
    { key: "approved", label: `Approved (${stats.approved})` },
    { key: "processing", label: `Processing (${stats.processing})` },
    { key: "completed", label: `Completed (${stats.completed})` },
    { key: "rejected", label: `Rejected (${stats.rejected})` },
  ];

  return (
    <div style={{ padding: "40px 20px", maxWidth: 1400, margin: "0 auto" }}>
      {contextHolder}

      <h1>Withdrawal Requests</h1>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12} md={4.8}>
          <Card>
            <Statistic
              title="Pending"
              value={stats.pending}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4.8}>
          <Card>
            <Statistic
              title="Approved"
              value={stats.approved}
              valueStyle={{ color: "#13c2c2" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4.8}>
          <Card>
            <Statistic
              title="Processing"
              value={stats.processing}
              valueStyle={{ color: "#fa8c16" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4.8}>
          <Card>
            <Statistic
              title="Completed"
              value={stats.completed}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4.8}>
          <Card>
            <Statistic
              title="Rejected"
              value={stats.rejected}
              valueStyle={{ color: "#f5222d" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Withdrawals Table by Status */}
      <Card>
        <Tabs
          activeKey={statusFilter}
          onChange={setStatusFilter}
          items={statusTabs}
        />

        <Table
          columns={columns}
          dataSource={withdrawals}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          loading={loading}
          scroll={{ x: 1000 }}
          locale={{
            emptyText: <Empty description={`No ${statusFilter} withdrawals`} />,
          }}
        />
      </Card>

      {/* Withdrawal Details Drawer */}
      <Drawer
        title="Withdrawal Details"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={600}
      >
        {selectedWithdrawal && (
          <div>
            <Descriptions bordered column={1} style={{ marginBottom: 16 }}>
              <Descriptions.Item label="Withdrawal ID">
                #{selectedWithdrawal.id}
              </Descriptions.Item>
              <Descriptions.Item label="Vendor">
                {selectedWithdrawal.vendor?.name}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {selectedWithdrawal.vendor?.email}
              </Descriptions.Item>
              <Descriptions.Item label="Amount">
                <strong style={{ color: "#0066cc", fontSize: 16 }}>
                  ETB {selectedWithdrawal.amount}
                </strong>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={statusColors[selectedWithdrawal.payout_status]}>
                  {selectedWithdrawal.payout_status?.toUpperCase()}
                </Tag>
              </Descriptions.Item>

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

              <Descriptions.Item label="Requested At">
                {new Date(selectedWithdrawal.created_at).toLocaleString()}
              </Descriptions.Item>

              {selectedWithdrawal.approved_at && (
                <Descriptions.Item label="Approved At">
                  {new Date(selectedWithdrawal.approved_at).toLocaleString()}
                </Descriptions.Item>
              )}

              {selectedWithdrawal.processing_at && (
                <Descriptions.Item label="Processing At">
                  {new Date(selectedWithdrawal.processing_at).toLocaleString()}
                </Descriptions.Item>
              )}

              {selectedWithdrawal.completed_at && (
                <Descriptions.Item label="Completed At">
                  {new Date(selectedWithdrawal.completed_at).toLocaleString()}
                </Descriptions.Item>
              )}

              {selectedWithdrawal.transaction_id && (
                <Descriptions.Item label="Transaction ID">
                  <code>{selectedWithdrawal.transaction_id}</code>
                </Descriptions.Item>
              )}

              {selectedWithdrawal.rejection_reason && (
                <Descriptions.Item label="Rejection Reason">
                  <p style={{ color: "#ef4444", fontWeight: "bold" }}>
                    {selectedWithdrawal.rejection_reason}
                  </p>
                </Descriptions.Item>
              )}

              {selectedWithdrawal.admin_note && (
                <Descriptions.Item label="Admin Notes">
                  {selectedWithdrawal.admin_note}
                </Descriptions.Item>
              )}

              {selectedWithdrawal.notes && (
                <Descriptions.Item label="Vendor Notes">
                  {selectedWithdrawal.notes}
                </Descriptions.Item>
              )}
            </Descriptions>

            {/* Action Buttons based on Status */}
            <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 16 }}>
              <h3>Actions</h3>
              <Space wrap>
                {selectedWithdrawal.payout_status === "pending" && (
                  <>
                    <Popconfirm
                      title="Approve Withdrawal?"
                      description={`ETB ${selectedWithdrawal.amount} will be marked for processing`}
                      onConfirm={handleApprove}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button
                        type="primary"
                        icon={<CheckOutlined />}
                        loading={actionLoading}
                      >
                        Approve
                      </Button>
                    </Popconfirm>
                    <Button
                      danger
                      icon={<CloseOutlined />}
                      onClick={() => setActionModal("reject")}
                    >
                      Reject
                    </Button>
                  </>
                )}

                {selectedWithdrawal.payout_status === "approved" && (
                  <Popconfirm
                    title="Mark as Processing?"
                    onConfirm={handleMarkProcessing}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button
                      type="primary"
                      icon={<ClockCircleOutlined />}
                      loading={actionLoading}
                    >
                      Mark as Processing
                    </Button>
                  </Popconfirm>
                )}

                {selectedWithdrawal.payout_status === "processing" && (
                  <Button
                    type="primary"
                    icon={<CheckOutlined />}
                    onClick={() => setActionModal("complete")}
                  >
                    Mark as Complete
                  </Button>
                )}
              </Space>
            </div>
          </div>
        )}
      </Drawer>

      {/* Reject Withdrawal Modal */}
      <Modal
        title="Reject Withdrawal"
        visible={actionModal === "reject"}
        onCancel={() => {
          setActionModal(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleReject}>
          <Form.Item
            name="rejection_reason"
            label="Rejection Reason"
            rules={[{ required: true, message: "Please provide a reason" }]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Why is this withdrawal being rejected?"
            />
          </Form.Item>

          <Form.Item name="admin_note" label="Admin Notes (optional)">
            <Input.TextArea rows={2} />
          </Form.Item>

          <Space>
            <Button
              type="primary"
              danger
              htmlType="submit"
              loading={actionLoading}
            >
              Reject
            </Button>
            <Button
              onClick={() => {
                setActionModal(null);
                form.resetFields();
              }}
            >
              Cancel
            </Button>
          </Space>
        </Form>
      </Modal>

      {/* Complete Withdrawal Modal */}
      <Modal
        title="Mark Withdrawal as Complete"
        visible={actionModal === "complete"}
        onCancel={() => {
          setActionModal(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleMarkComplete}>
          <Form.Item
            name="transaction_id"
            label="Transaction ID"
            rules={[{ required: true, message: "Please enter transaction ID" }]}
          >
            <Input placeholder="e.g., TXN123456" />
          </Form.Item>

          <Form.Item name="admin_note" label="Admin Notes (optional)">
            <Input.TextArea rows={2} />
          </Form.Item>

          <Space>
            <Button type="primary" htmlType="submit" loading={actionLoading}>
              Complete
            </Button>
            <Button
              onClick={() => {
                setActionModal(null);
                form.resetFields();
              }}
            >
              Cancel
            </Button>
          </Space>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminWithdrawalsPage;
