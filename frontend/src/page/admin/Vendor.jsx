import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  Card,
  Input,
  Modal,
  Space,
  Tabs,
  Table,
  Tag,
  Typography,
  message,
  Popconfirm,
  Form,
  Select,
} from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  EyeOutlined,
  ReloadOutlined,
  SearchOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { AppContext } from "../../context/AppContext.jsx";
import { useTheme } from "../../context/ThemeProvider.jsx";

const { Title, Text } = Typography;
const authConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
});

const Vendor = () => {
  const { backendUrl } = useContext(AppContext);
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === "dark";

  const [allVendors, setAllVendors] = useState([]);
  const [pendingVendors, setPendingVendors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const [actionLoading, setActionLoading] = useState(null);
  const [rejectModal, setRejectModal] = useState({
    visible: false,
    vendor: null,
  });
  const [suspendModal, setSuspendModal] = useState({
    visible: false,
    vendor: null,
  });
  const [form] = Form.useForm();

  const loadVendors = useCallback(async () => {
    setLoading(true);
    try {
      const [allRes, pendingRes] = await Promise.all([
        axios.get(`${backendUrl}/admin/vendors?per_page=100`, authConfig()),
        axios.get(`${backendUrl}/admin/vendors/pending`, authConfig()),
      ]);

      const allData = allRes.data.vendors;
      const pendingData = pendingRes.data.vendors;

      setAllVendors(Array.isArray(allData) ? allData : allData?.data || []);
      setPendingVendors(
        Array.isArray(pendingData) ? pendingData : pendingData || [],
      );
    } catch (error) {
      messageApi.error(
        error.response?.data?.message || "Unable to load vendors.",
      );
    } finally {
      setLoading(false);
    }
  }, [backendUrl, messageApi]);

  useEffect(() => {
    loadVendors();
  }, [loadVendors]);

  const handleApproveVendor = async (vendorId) => {
    setActionLoading(`approve-${vendorId}`);
    try {
      const response = await axios.post(
        `${backendUrl}/admin/vendors/${vendorId}/approve`,
        { notes: "" },
        authConfig(),
      );
      messageApi.success(response.data.message);
      await loadVendors();
    } catch (error) {
      messageApi.error(
        error.response?.data?.message || "Unable to approve vendor.",
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectVendor = async () => {
    const reason = form.getFieldValue("reject_reason");
    if (!reason?.trim()) {
      messageApi.error("Please provide a rejection reason.");
      return;
    }

    const vendorId = rejectModal.vendor?.id;
    setActionLoading(`reject-${vendorId}`);

    try {
      const response = await axios.post(
        `${backendUrl}/admin/vendors/${vendorId}/reject`,
        { reason },
        authConfig(),
      );
      messageApi.success(response.data.message);
      setRejectModal({ visible: false, vendor: null });
      form.resetFields();
      await loadVendors();
    } catch (error) {
      messageApi.error(
        error.response?.data?.message || "Unable to reject vendor.",
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleSuspendVendor = async () => {
    const reason = form.getFieldValue("suspend_reason");
    if (!reason?.trim()) {
      messageApi.error("Please provide a suspension reason.");
      return;
    }

    const vendorId = suspendModal.vendor?.id;
    setActionLoading(`suspend-${vendorId}`);

    try {
      const response = await axios.post(
        `${backendUrl}/admin/vendors/${vendorId}/suspend`,
        { reason },
        authConfig(),
      );
      messageApi.success(response.data.message);
      setSuspendModal({ visible: false, vendor: null });
      form.resetFields();
      await loadVendors();
    } catch (error) {
      messageApi.error(
        error.response?.data?.message || "Unable to suspend vendor.",
      );
    } finally {
      setActionLoading(null);
    }
  };

  const filteredPendingVendors = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return pendingVendors;

    return pendingVendors.filter(
      (vendor) =>
        vendor.business_name?.toLowerCase().includes(term) ||
        vendor.user?.email?.toLowerCase().includes(term) ||
        vendor.user?.full_name?.toLowerCase().includes(term),
    );
  }, [search, pendingVendors]);

  const filteredAllVendors = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return allVendors;

    return allVendors.filter(
      (vendor) =>
        vendor.business_name?.toLowerCase().includes(term) ||
        vendor.user?.email?.toLowerCase().includes(term) ||
        vendor.user?.full_name?.toLowerCase().includes(term),
    );
  }, [search, allVendors]);

  const pendingColumns = [
    {
      title: "BUSINESS",
      key: "business",
      render: (_, vendor) => {
        const user = vendor.user || {};
        const initials = (user.full_name || "VN")
          .split(" ")
          .slice(0, 2)
          .map((p) => p[0])
          .join("")
          .toUpperCase();
        return (
          <Space>
            <Avatar style={{ background: "#fed7aa", color: "#c2410c" }}>
              {initials}
            </Avatar>
            <div>
              <Text strong>{vendor.business_name || "Unnamed"}</Text>
              <Text type="secondary" style={{ display: "block" }}>
                {user.email}
              </Text>
            </div>
          </Space>
        );
      },
    },
    {
      title: "TYPE",
      dataIndex: "business_type",
      key: "business_type",
      render: (type) => (
        <Tag color="blue">{type?.replaceAll("_", " ").toUpperCase()}</Tag>
      ),
    },
    {
      title: "OWNER",
      key: "owner",
      render: (_, vendor) =>
        vendor.user?.full_name ||
        `${vendor.user?.first_name} ${vendor.user?.last_name}`,
    },
    {
      title: "LOCATION",
      key: "location",
      render: (_, vendor) =>
        [vendor.city, vendor.country].filter(Boolean).join(", ") ||
        "Not provided",
    },
    {
      title: "ACTION",
      key: "action",
      width: 220,
      render: (_, vendor) => (
        <Space size="small" wrap>
          <Button
            size="small"
            type="primary"
            icon={<CheckOutlined />}
            loading={actionLoading === `approve-${vendor.id}`}
            onClick={() => handleApproveVendor(vendor.id)}
          >
            Approve
          </Button>
          <Button
            size="small"
            danger
            icon={<CloseOutlined />}
            loading={actionLoading === `reject-${vendor.id}`}
            onClick={() => {
              setRejectModal({ visible: true, vendor });
              form.resetFields();
            }}
          >
            Reject
          </Button>
          <Button
            size="small"
            type="link"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/admin/vendors/${vendor.id}`)}
          >
            Review
          </Button>
        </Space>
      ),
    },
  ];

  const allVendorsColumns = [
    {
      title: "BUSINESS",
      key: "business",
      render: (_, vendor) => {
        const user = vendor.user || {};
        const initials = (user.full_name || "VN")
          .split(" ")
          .slice(0, 2)
          .map((p) => p[0])
          .join("")
          .toUpperCase();
        return (
          <Space>
            <Avatar style={{ background: "#fed7aa", color: "#c2410c" }}>
              {initials}
            </Avatar>
            <div>
              <Text strong>{vendor.business_name || "Unnamed"}</Text>
              <Text type="secondary" style={{ display: "block" }}>
                {user.email}
              </Text>
            </div>
          </Space>
        );
      },
    },
    {
      title: "STATUS",
      key: "status",
      render: (_, vendor) => {
        const status = vendor.verification_status || "pending";
        let color = "blue";
        let label = status.toUpperCase();

        if (status === "approved" || status === "verified") {
          color = "green";
          label = "APPROVED";
        } else if (status === "rejected") {
          color = "red";
          label = "REJECTED";
        } else if (status === "pending") {
          color = "gold";
          label = "PENDING";
        }

        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: "ACTIVE",
      key: "active",
      render: (_, vendor) => (
        <Tag color={vendor.is_active ? "green" : "red"}>
          {vendor.is_active ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "TYPE",
      dataIndex: "business_type",
      key: "business_type",
      render: (type) => type?.replaceAll("_", " ").toUpperCase() || "-",
    },
    {
      title: "ACTION",
      key: "action",
      width: 150,
      render: (_, vendor) => (
        <Space size="small">
          <Button
            size="small"
            type="link"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/admin/vendors/${vendor.id}`)}
          >
            View
          </Button>
          {vendor.is_active && (
            <Button
              size="small"
              danger
              icon={<StopOutlined />}
              loading={actionLoading === `suspend-${vendor.id}`}
              onClick={() => {
                setSuspendModal({ visible: true, vendor });
                form.resetFields();
              }}
            >
              Suspend
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div
      className="admin-vendors-page"
      style={{ background: isDark ? "#060b17" : "#f4f8fd" }}
    >
      {contextHolder}

      <Tabs
        defaultActiveKey="pending"
        items={[
          {
            key: "pending",
            label: `Pending Vendors (${filteredPendingVendors.length})`,
            children: (
              <Card className="admin-vendors-card">
                <div className="admin-vendors-heading">
                  <div>
                    <Text className="admin-vendors-eyebrow">
                      VENDOR APPLICATIONS
                    </Text>
                    <Title level={2}>Pending Registrations</Title>
                    <Text type="secondary">
                      Review and approve or reject new vendor applications.
                    </Text>
                  </div>
                  <Space>
                    <Button
                      icon={<ReloadOutlined />}
                      onClick={loadVendors}
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
                  columns={pendingColumns}
                  dataSource={filteredPendingVendors}
                  loading={loading}
                  pagination={{ pageSize: 10 }}
                  scroll={{ x: 1000 }}
                  locale={{ emptyText: "No pending vendors." }}
                />
              </Card>
            ),
          },
          {
            key: "all",
            label: `All Vendors (${filteredAllVendors.length})`,
            children: (
              <Card className="admin-vendors-card">
                <div className="admin-vendors-heading">
                  <div>
                    <Text className="admin-vendors-eyebrow">
                      VENDOR REGISTRY
                    </Text>
                    <Title level={2}>All Vendors</Title>
                    <Text type="secondary">
                      View and manage all vendor accounts.
                    </Text>
                  </div>
                  <Space>
                    <Button
                      icon={<ReloadOutlined />}
                      onClick={loadVendors}
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
                  columns={allVendorsColumns}
                  dataSource={filteredAllVendors}
                  loading={loading}
                  pagination={{ pageSize: 10 }}
                  scroll={{ x: 1000 }}
                  locale={{ emptyText: "No vendors found." }}
                />
              </Card>
            ),
          },
        ]}
      />

      {/* Reject Modal */}
      <Modal
        title="Reject Vendor Application"
        open={rejectModal.visible}
        onOk={handleRejectVendor}
        onCancel={() => {
          setRejectModal({ visible: false, vendor: null });
          form.resetFields();
        }}
        confirmLoading={actionLoading?.startsWith("reject")}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Vendor">
            <Text>
              {rejectModal.vendor?.business_name ||
                rejectModal.vendor?.user?.email}
            </Text>
          </Form.Item>
          <Form.Item
            label="Rejection Reason"
            name="reject_reason"
            rules={[{ required: true, message: "Please provide a reason" }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Explain why this vendor application is being rejected..."
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Suspend Modal */}
      <Modal
        title="Suspend Vendor Account"
        open={suspendModal.visible}
        onOk={handleSuspendVendor}
        onCancel={() => {
          setSuspendModal({ visible: false, vendor: null });
          form.resetFields();
        }}
        confirmLoading={actionLoading?.startsWith("suspend")}
        okButtonProps={{ danger: true }}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Vendor">
            <Text>
              {suspendModal.vendor?.business_name ||
                suspendModal.vendor?.user?.email}
            </Text>
          </Form.Item>
          <Form.Item
            label="Suspension Reason"
            name="suspend_reason"
            rules={[{ required: true, message: "Please provide a reason" }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Explain why this vendor account is being suspended..."
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Vendor;
