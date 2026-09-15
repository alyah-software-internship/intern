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
  Drawer,
  Descriptions,
  Row,
  Col,
  Statistic,
  DatePicker,
  Select,
} from "antd";
import { AppContext } from "../../context/AppContext.jsx";
import { EyeOutlined, DownloadOutlined, UndoOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const AdminRefundsPage = () => {
  const { backendUrl, currency } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [refunds, setRefunds] = useState([]);
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [filters, setFilters] = useState({
    status: null,
    startDate: null,
    endDate: null,
  });
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    fetchRefunds();
  }, [filters]);

  const fetchRefunds = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.startDate)
        params.start_date = filters.startDate.format("YYYY-MM-DD");
      if (filters.endDate)
        params.end_date = filters.endDate.format("YYYY-MM-DD");

      const response = await axios.get(`${backendUrl}/admin/refunds`, {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      setRefunds(response.data.refunds?.data || []);
    } catch (err) {
      messageApi.error("Failed to load refunds");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (refund) => {
    setSelectedRefund(refund);
    setDrawerVisible(true);
  };

  const statusColors = {
    pending: "blue",
    processing: "orange",
    completed: "green",
    failed: "red",
  };

  const reasonColors = {
    customer_request: "blue",
    payment_failure: "red",
    booking_cancelled: "orange",
    operator_refund: "purple",
    dispute_resolution: "red",
    other: "gray",
  };

  const columns = [
    {
      title: "Refund ID",
      dataIndex: "id",
      render: (id) => `#${id}`,
      width: 100,
    },
    {
      title: "Payment",
      dataIndex: ["payment", "id"],
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
      title: "Amount",
      dataIndex: "amount",
      render: (amount) => `${currency} ${amount}`,
      width: 120,
    },
    {
      title: "Reason",
      dataIndex: "reason",
      render: (reason) => (
        <Tag color={reasonColors[reason] || "gray"}>
          {reason?.replace(/_/g, " ").toUpperCase()}
        </Tag>
      ),
      width: 150,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <Tag color={statusColors[status] || "gray"}>
          {status?.toUpperCase()}
        </Tag>
      ),
      width: 100,
    },
    {
      title: "Initiated",
      dataIndex: "created_at",
      render: (date) => new Date(date).toLocaleDateString(),
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
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetails(record)}
        />
      ),
      width: 80,
    },
  ];

  const stats = {
    total: refunds.length,
    totalAmount: refunds.reduce((sum, r) => sum + (r.amount || 0), 0),
    pending: refunds.filter((r) => r.status === "pending").length,
    processing: refunds.filter((r) => r.status === "processing").length,
    completed: refunds.filter((r) => r.status === "completed").length,
    failed: refunds.filter((r) => r.status === "failed").length,
  };

  const reasonCounts = {};
  refunds.forEach((r) => {
    reasonCounts[r.reason] = (reasonCounts[r.reason] || 0) + 1;
  });

  return (
    <div style={{ padding: "40px 20px", maxWidth: 1400, margin: "0 auto" }}>
      {contextHolder}

      <h1>Refunds</h1>

      {/* Summary Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Refunds"
              value={stats.total}
              valueStyle={{ color: "#0066cc" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Amount"
              value={stats.totalAmount}
              prefix={`${currency} `}
              valueStyle={{ color: "#ef4444" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Completed"
              value={stats.completed}
              valueStyle={{ color: "#22c55e" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Pending"
              value={stats.pending}
              valueStyle={{ color: "#f59e0b" }}
            />
          </Card>
        </Col>
      </Row>

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
                { label: "Completed", value: "completed" },
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

      {/* Reason Breakdown */}
      <Card style={{ marginBottom: 16 }} title="Refund Reasons">
        <Row gutter={[16, 16]}>
          {Object.entries(reasonCounts).map(([reason, count]) => (
            <Col xs={24} sm={12} md={8} key={reason}>
              <div
                style={{ padding: "16px 0", borderBottom: "1px solid #f0f0f0" }}
              >
                <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>
                  {reason.replace(/_/g, " ").toUpperCase()}
                </div>
                <div style={{ fontSize: 20, fontWeight: "bold" }}>{count}</div>
              </div>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Refunds Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={refunds}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          loading={loading}
          scroll={{ x: 1400 }}
          locale={{
            emptyText: <Empty description="No refunds found" />,
          }}
        />
      </Card>

      {/* Refund Details Drawer */}
      <Drawer
        title="Refund Details"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={500}
      >
        {selectedRefund && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Refund ID">
              #{selectedRefund.id}
            </Descriptions.Item>
            <Descriptions.Item label="Payment ID">
              #{selectedRefund.payment_id}
            </Descriptions.Item>
            <Descriptions.Item label="Booking ID">
              #{selectedRefund.booking_id}
            </Descriptions.Item>
            <Descriptions.Item label="Customer">
              {selectedRefund.customer?.name}
            </Descriptions.Item>
            <Descriptions.Item label="Customer Email">
              {selectedRefund.customer?.email}
            </Descriptions.Item>
            <Descriptions.Item label="Vendor">
              {selectedRefund.vendor?.name}
            </Descriptions.Item>
            <Descriptions.Item label="Amount">
              <strong style={{ color: "#ef4444", fontSize: 16 }}>
                {currency} {selectedRefund.amount}
              </strong>
            </Descriptions.Item>
            <Descriptions.Item label="Reason">
              <Tag color={reasonColors[selectedRefund.reason]}>
                {selectedRefund.reason?.replace(/_/g, " ").toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={statusColors[selectedRefund.status]}>
                {selectedRefund.status?.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Initiated By">
              {selectedRefund.initiatedBy?.name ||
                selectedRefund.initiated_by_user?.name ||
                "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Initiated At">
              {new Date(selectedRefund.created_at).toLocaleString()}
            </Descriptions.Item>
            {(selectedRefund.processedBy ||
              selectedRefund.processed_by_user) && (
              <Descriptions.Item label="Processed By">
                {selectedRefund.processedBy?.name ||
                  selectedRefund.processed_by_user?.name}
              </Descriptions.Item>
            )}
            {selectedRefund.completed_at && (
              <Descriptions.Item label="Completed At">
                {new Date(selectedRefund.completed_at).toLocaleString()}
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Provider Reference">
              <code>{selectedRefund.provider_reference || "-"}</code>
            </Descriptions.Item>
            <Descriptions.Item label="Notes">
              {selectedRefund.notes || "-"}
            </Descriptions.Item>
            {selectedRefund.failure_reason && (
              <Descriptions.Item label="Failure Reason">
                <p style={{ color: "#ef4444" }}>
                  {selectedRefund.failure_reason}
                </p>
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Drawer>
    </div>
  );
};

export default AdminRefundsPage;
