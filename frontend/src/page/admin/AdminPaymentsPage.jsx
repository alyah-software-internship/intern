import { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Table,
  Empty,
  Button,
  message,
  Space,
  Tag,
  DatePicker,
  Select,
  Row,
  Col,
  Drawer,
  Descriptions,
} from "antd";
import { AppContext } from "../../context/AppContext.jsx";
import { EyeOutlined, UndoOutlined } from "@ant-design/icons";

const AdminPaymentsPage = () => {
  const { backendUrl } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [filters, setFilters] = useState({
    status: null,
    startDate: null,
    endDate: null,
  });
  const [messageApi, contextHolder] = message.useMessage();

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.startDate)
        params.start_date = filters.startDate.format("YYYY-MM-DD");
      if (filters.endDate)
        params.end_date = filters.endDate.format("YYYY-MM-DD");

      const response = await axios.get(`${backendUrl}/admin/payments`, {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      setPayments(response.data.payments?.data || []);
    } catch {
      messageApi.error("Failed to load payments");
    } finally {
      setLoading(false);
    }
  }, [backendUrl, filters, messageApi]);

  useEffect(() => {
    const timer = window.setTimeout(fetchPayments, 0);
    return () => window.clearTimeout(timer);
  }, [fetchPayments]);

  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
    setDrawerVisible(true);
  };

  const handleInitiateRefund = async (paymentId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/admin/payments/${paymentId}/refund`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );

      if (response.data.success) {
        messageApi.success("Refund initiated successfully");
        fetchPayments();
        setDrawerVisible(false);
      }
    } catch (err) {
      messageApi.error(
        err.response?.data?.message || "Failed to initiate refund",
      );
    }
  };

  const handleVerifyPayment = async (paymentId, approved) => {
    try {
      const reason = approved
        ? undefined
        : window.prompt("Rejection reason (optional)");
      if (!approved && reason === null) return;

      const response = await axios.post(
        `${backendUrl}/admin/payments/${paymentId}/${approved ? "approve" : "reject"}`,
        approved ? {} : { reason },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );

      if (response.data.success) {
        messageApi.success(
          approved
            ? "Payment approved and both parties notified"
            : "Payment rejected",
        );
        await fetchPayments();
        setDrawerVisible(false);
      }
    } catch (err) {
      messageApi.error(
        err.response?.data?.message || "Unable to update payment verification",
      );
    }
  };

  const statusColors = {
    pending: "blue",
    processing: "orange",
    paid: "green",
    failed: "red",
  };

  const columns = [
    {
      title: "Payment ID",
      dataIndex: "id",
      render: (id) => `#${id}`,
      width: 100,
    },
    {
      title: "Booking",
      dataIndex: ["booking", "id"],
      render: (id) => `Booking #${id}`,
      width: 120,
    },
    {
      title: "Customer",
      dataIndex: ["customer", "name"],
      ellipsis: true,
      width: 150,
    },
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
      title: "Platform Fee",
      dataIndex: "platform_fee",
      render: (fee) => `ETB ${fee}`,
      width: 120,
    },
    {
      title: "Vendor Amount",
      dataIndex: "vendor_amount",
      render: (amount) => `ETB ${amount}`,
      width: 120,
    },
    {
      title: "Status",
      dataIndex: "payment_status",
      render: (status) => (
        <Tag color={statusColors[status] || "gray"}>
          {status?.toUpperCase()}
        </Tag>
      ),
      width: 100,
    },
    {
      title: "Provider",
      dataIndex: "payment_method",
      width: 100,
    },
    {
      title: "Date",
      dataIndex: "created_at",
      render: (date) => new Date(date).toLocaleDateString(),
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
          {record.payment_status === "paid" && (
            <Button
              type="text"
              danger
              icon={<UndoOutlined />}
              onClick={() => handleInitiateRefund(record.id)}
            />
          )}
        </Space>
      ),
      width: 100,
    },
  ];

  return (
    <div style={{ padding: "40px 20px", maxWidth: 1400, margin: "0 auto" }}>
      {contextHolder}

      <h1>All Payments</h1>

      {/* Filters */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Filter by status"
              allowClear
              style={{ width: "100%" }}
              onChange={(value) => setFilters({ ...filters, status: value })}
              options={[
                { label: "Pending", value: "pending" },
                { label: "Processing", value: "processing" },
                { label: "Paid", value: "paid" },
                { label: "Failed", value: "failed" },
              ]}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <DatePicker
              placeholder="Start date"
              style={{ width: "100%" }}
              onChange={(date) => setFilters({ ...filters, startDate: date })}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <DatePicker
              placeholder="End date"
              style={{ width: "100%" }}
              onChange={(date) => setFilters({ ...filters, endDate: date })}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Button
              onClick={() =>
                setFilters({ status: null, startDate: null, endDate: null })
              }
              block
            >
              Reset Filters
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Totals Summary */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <div>
              <div style={{ fontSize: 12, color: "#666" }}>Total Payments</div>
              <div
                style={{ fontSize: 18, fontWeight: "bold", color: "#0066cc" }}
              >
                ETB{" "}
                {payments
                  .reduce((sum, p) => sum + (p.amount || 0), 0)
                  .toLocaleString()}
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div>
              <div style={{ fontSize: 12, color: "#666" }}>
                Platform Revenue
              </div>
              <div
                style={{ fontSize: 18, fontWeight: "bold", color: "#22c55e" }}
              >
                ETB{" "}
                {payments
                  .reduce((sum, p) => sum + (p.platform_fee || 0), 0)
                  .toLocaleString()}
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div>
              <div style={{ fontSize: 12, color: "#666" }}>Vendor Amount</div>
              <div
                style={{ fontSize: 18, fontWeight: "bold", color: "#f59e0b" }}
              >
                ETB{" "}
                {payments
                  .reduce((sum, p) => sum + (p.vendor_amount || 0), 0)
                  .toLocaleString()}
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div>
              <div style={{ fontSize: 12, color: "#666" }}>
                Number of Payments
              </div>
              <div style={{ fontSize: 18, fontWeight: "bold" }}>
                {payments.length}
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Payments Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={payments}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          loading={loading}
          scroll={{ x: 1400 }}
          locale={{
            emptyText: <Empty description="No payments found" />,
          }}
        />
      </Card>

      {/* Payment Details Drawer */}
      <Drawer
        title="Payment Details"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={500}
      >
        {selectedPayment && (
          <div>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Payment ID">
                #{selectedPayment.id}
              </Descriptions.Item>
              <Descriptions.Item label="Booking ID">
                #{selectedPayment.booking_id}
              </Descriptions.Item>
              <Descriptions.Item label="Customer">
                {selectedPayment.customer?.name}
              </Descriptions.Item>
              <Descriptions.Item label="Customer Email">
                {selectedPayment.customer?.email}
              </Descriptions.Item>
              <Descriptions.Item label="Vendor">
                {selectedPayment.vendor?.name}
              </Descriptions.Item>
              <Descriptions.Item label="Total Amount">
                <strong style={{ color: "#0066cc", fontSize: 16 }}>
                  ETB {selectedPayment.amount}
                </strong>
              </Descriptions.Item>
              <Descriptions.Item label="Platform Fee">
                <strong style={{ color: "#22c55e" }}>
                  ETB {selectedPayment.platform_fee}
                </strong>
              </Descriptions.Item>
              <Descriptions.Item label="Vendor Receives">
                <strong style={{ color: "#f59e0b" }}>
                  ETB {selectedPayment.vendor_amount}
                </strong>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={statusColors[selectedPayment.payment_status]}>
                  {selectedPayment.payment_status?.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Payment Method">
                {selectedPayment.payment_method}
              </Descriptions.Item>
              <Descriptions.Item label="Provider Reference">
                <code>{selectedPayment.provider_reference}</code>
              </Descriptions.Item>
              <Descriptions.Item label="Paid At">
                {selectedPayment.paid_at
                  ? new Date(selectedPayment.paid_at).toLocaleString()
                  : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Created">
                {new Date(selectedPayment.created_at).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>

            {selectedPayment.payment_status === "paid" && (
              <Button
                danger
                block
                style={{ marginTop: 16 }}
                onClick={() => handleInitiateRefund(selectedPayment.id)}
              >
                Initiate Refund
              </Button>
            )}

            {selectedPayment.payment_proof_path &&
              selectedPayment.payment_status !== "paid" &&
              selectedPayment.proof_verification_status !== "rejected" && (
                <Space
                  direction="vertical"
                  style={{ width: "100%", marginTop: 16 }}
                >
                  <strong>Payment Screenshot</strong>
                  <img
                    src={`${backendUrl.replace(/\/api\/?$/i, "")}/storage/${selectedPayment.payment_proof_path}`}
                    alt="Customer payment proof"
                    style={{
                      width: "100%",
                      maxHeight: 420,
                      objectFit: "contain",
                      border: "1px solid #ddd",
                    }}
                  />
                  <Space style={{ width: "100%" }}>
                    <Button
                      type="primary"
                      onClick={() =>
                        handleVerifyPayment(selectedPayment.id, true)
                      }
                    >
                      Approve Payment
                    </Button>
                    <Button
                      danger
                      onClick={() =>
                        handleVerifyPayment(selectedPayment.id, false)
                      }
                    >
                      Reject Payment
                    </Button>
                  </Space>
                </Space>
              )}
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default AdminPaymentsPage;
