import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  Avatar,
  Button,
  Card,
  Descriptions,
  Image,
  List,
  Modal,
  Popconfirm,
  Space,
  Spin,
  Tag,
  Typography,
  message,
  Form,
  Input,
} from "antd";
import {
  ArrowLeftOutlined,
  CheckOutlined,
  CloseOutlined,
  FileTextOutlined,
  MailOutlined,
  PhoneOutlined,
  ShopOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { AppContext } from "../../context/AppContext.jsx";
import { useTheme } from "../../context/ThemeProvider.jsx";

const { Title, Text } = Typography;
const authConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
});

const VendorDetail = () => {
  const { backendUrl } = useContext(AppContext);
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const isDark = theme === "dark";

  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const [actionLoading, setActionLoading] = useState(null);
  const [rejectModal, setRejectModal] = useState({ visible: false });
  const [suspendModal, setSuspendModal] = useState({ visible: false });
  const [form] = Form.useForm();

  useEffect(() => {
    const loadVendor = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/admin/vendors/${id}`,
          authConfig(),
        );
        setVendor(response.data.vendor);
      } catch (error) {
        messageApi.error(
          error.response?.data?.message || "Unable to load vendor details.",
        );
        navigate("/admin/vendors");
      } finally {
        setLoading(false);
      }
    };
    loadVendor();
  }, [backendUrl, id, messageApi, navigate]);

  const handleApproveVendor = async () => {
    setActionLoading("approve");
    try {
      const response = await axios.post(
        `${backendUrl}/admin/vendors/${id}/approve`,
        { notes: "" },
        authConfig(),
      );
      messageApi.success(response.data.message);
      setTimeout(() => navigate("/admin/vendors"), 1500);
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

    setActionLoading("reject");
    try {
      const response = await axios.post(
        `${backendUrl}/admin/vendors/${id}/reject`,
        { reason },
        authConfig(),
      );
      messageApi.success(response.data.message);
      setRejectModal({ visible: false });
      form.resetFields();
      setTimeout(() => navigate("/admin/vendors"), 1500);
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

    setActionLoading("suspend");
    try {
      const response = await axios.post(
        `${backendUrl}/admin/vendors/${id}/suspend`,
        { reason },
        authConfig(),
      );
      messageApi.success(response.data.message);
      setSuspendModal({ visible: false });
      form.resetFields();
      setTimeout(() => navigate("/admin/vendors"), 1500);
    } catch (error) {
      messageApi.error(
        error.response?.data?.message || "Unable to suspend vendor.",
      );
    } finally {
      setActionLoading(null);
    }
  };

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  if (!vendor) return null;

  const user = vendor.user || {};
  const initials = (user.full_name || "VN")
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  const getVerificationColor = (status) => {
    switch (status) {
      case "approved":
      case "verified":
        return "green";
      case "rejected":
        return "red";
      case "pending":
        return "gold";
      default:
        return "blue";
    }
  };

  return (
    <div
      className="admin-vendor-detail"
      style={{ background: isDark ? "#060b17" : "#f4f8fd", padding: "24px" }}
    >
      {contextHolder}

      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate("/admin/vendors")}
        style={{ marginBottom: 16 }}
      >
        Back to Vendors
      </Button>

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <Space size={16} align="start">
          <Avatar
            size={72}
            style={{ background: "#fed7aa", color: "#c2410c", fontSize: 24 }}
          >
            {initials}
          </Avatar>
          <div>
            <Title level={2} style={{ margin: 0 }}>
              {vendor.business_name || "Unnamed Vendor"}
            </Title>
            <Text type="secondary">{user.email}</Text>
            <br />
            <Tag
              color={getVerificationColor(vendor.verification_status)}
              style={{ marginTop: 8 }}
            >
              {(vendor.verification_status || "pending").toUpperCase()}
            </Tag>
          </div>
        </Space>

        {/* Action Buttons */}
        {vendor.verification_status === "pending" && (
          <Space wrap>
            <Popconfirm
              title="Approve vendor?"
              description="This vendor will be able to list products and accept bookings."
              okText="Approve"
              onConfirm={handleApproveVendor}
            >
              <Button
                type="primary"
                icon={<CheckOutlined />}
                loading={actionLoading === "approve"}
                size="large"
              >
                Approve Vendor
              </Button>
            </Popconfirm>
            <Button
              danger
              icon={<CloseOutlined />}
              loading={actionLoading === "reject"}
              onClick={() => {
                setRejectModal({ visible: true });
                form.resetFields();
              }}
              size="large"
            >
              Reject Application
            </Button>
          </Space>
        )}

        {vendor.verification_status === "verified" && vendor.is_active && (
          <Button
            danger
            icon={<StopOutlined />}
            loading={actionLoading === "suspend"}
            onClick={() => {
              setSuspendModal({ visible: true });
              form.resetFields();
            }}
            size="large"
          >
            Suspend Vendor
          </Button>
        )}
      </div>

      {/* Business Information */}
      <Card title="Business Information" style={{ marginBottom: 24 }}>
        <Descriptions column={{ xs: 1, md: 2 }} colon={false}>
          <Descriptions.Item label="Business Name">
            {vendor.business_name || "Not provided"}
          </Descriptions.Item>
          <Descriptions.Item label="Business Type">
            <Tag color="blue">
              {vendor.business_type?.replaceAll("_", " ").toUpperCase() ||
                "Not provided"}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Registration Number">
            {vendor.registration_number || "Not provided"}
          </Descriptions.Item>
          <Descriptions.Item label="Tax ID">
            {vendor.tax_id || "Not provided"}
          </Descriptions.Item>
          <Descriptions.Item label="Description" span={{ xs: 1, md: 2 }}>
            {vendor.description || "Not provided"}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Owner Information */}
      <Card title="Owner Information" style={{ marginBottom: 24 }}>
        <Descriptions column={{ xs: 1, md: 2 }} colon={false}>
          <Descriptions.Item label="Full Name">
            {user.full_name ||
              `${user.first_name} ${user.middle_name} ${user.last_name}`}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            <MailOutlined /> {user.email}
          </Descriptions.Item>
          <Descriptions.Item label="Phone">
            <PhoneOutlined /> {user.phone || "Not provided"}
          </Descriptions.Item>
          <Descriptions.Item label="Email Verified">
            {user.email_verified_at ? "Yes" : "No"}
          </Descriptions.Item>
          <Descriptions.Item label="Phone Verified">
            {user.phone_verified_at ? "Yes" : "No"}
          </Descriptions.Item>
          <Descriptions.Item label="Account Status">
            <Tag color={user.is_active ? "green" : "red"}>
              {user.is_active ? "Active" : "Inactive"}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Location Information */}
      <Card title="Location Information" style={{ marginBottom: 24 }}>
        <Descriptions column={{ xs: 1, md: 2 }} colon={false}>
          <Descriptions.Item label="Address">
            {vendor.address || "Not provided"}
          </Descriptions.Item>
          <Descriptions.Item label="City">
            {vendor.city || "Not provided"}
          </Descriptions.Item>
          <Descriptions.Item label="Country">
            {vendor.country || "Not provided"}
          </Descriptions.Item>
          <Descriptions.Item label="Postal Code">
            {vendor.postal_code || "Not provided"}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Identity Documents */}
      {user.identity_documents && user.identity_documents.length > 0 && (
        <Card title="Identity Documents" style={{ marginBottom: 24 }}>
          <List
            dataSource={user.identity_documents}
            locale={{ emptyText: "No identity documents submitted." }}
            renderItem={(document) => (
              <List.Item>
                <Space align="start" style={{ width: "100%" }}>
                  <div>
                    {[
                      ["Front", document.document_front_url],
                      ["Back", document.document_back_url],
                      ["Selfie", document.selfie_with_document_url],
                    ]
                      .filter(([, url]) => Boolean(url))
                      .map(([label, url]) => (
                        <div key={url} style={{ marginBottom: 8 }}>
                          <Image
                            width={120}
                            height={80}
                            src={url}
                            style={{ objectFit: "cover", borderRadius: 6 }}
                          />
                          <Text type="secondary" style={{ fontSize: 11 }}>
                            {label}
                          </Text>
                        </div>
                      ))}
                  </div>
                  <Space direction="vertical" size={2}>
                    <Text strong>
                      {document.document_type
                        ?.replaceAll("_", " ")
                        .toUpperCase()}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {document.document_number || "Number unavailable"}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {document.document_country || "Country unavailable"}
                    </Text>
                    <Tag
                      color={
                        document.verification_status === "verified"
                          ? "green"
                          : document.verification_status === "rejected"
                            ? "red"
                            : "gold"
                      }
                    >
                      {document.verification_status || "Pending"}
                    </Tag>
                  </Space>
                </Space>
              </List.Item>
            )}
          />
        </Card>
      )}

      {/* Payment Methods */}
      {vendor.payment_methods && vendor.payment_methods.length > 0 && (
        <Card title="Payment Methods" style={{ marginBottom: 24 }}>
          <List
            dataSource={vendor.payment_methods}
            renderItem={(method) => (
              <List.Item>
                <Space direction="vertical">
                  <Text strong>{method.method_type?.toUpperCase()}</Text>
                  <Text type="secondary">{method.account_name}</Text>
                  <Tag color={method.is_active ? "green" : "default"}>
                    {method.is_active ? "Active" : "Inactive"}
                  </Tag>
                </Space>
              </List.Item>
            )}
          />
        </Card>
      )}

      {/* Products */}
      {vendor.products && vendor.products.length > 0 && (
        <Card title="Products" style={{ marginBottom: 24 }}>
          <List
            dataSource={vendor.products}
            renderItem={(product) => (
              <List.Item>
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Text strong>{product.name}</Text>
                  <Text type="secondary">{product.description}</Text>
                  <Space>
                    <Tag color="blue">
                      {product.category?.name || "No category"}
                    </Tag>
                    <Tag color={product.status === "active" ? "green" : "red"}>
                      {product.status?.toUpperCase()}
                    </Tag>
                  </Space>
                </Space>
              </List.Item>
            )}
          />
        </Card>
      )}

      {/* Verification Summary */}
      <Card
        title="Verification Summary"
        style={{ marginBottom: 24 }}
        type="inner"
      >
        <Descriptions column={1} colon={false}>
          <Descriptions.Item label="Payment Methods Verified">
            {vendor.payment_methods_verified ? "Yes" : "No"}
          </Descriptions.Item>
          <Descriptions.Item label="Documents Verified">
            {user.identity_documents?.some(
              (d) => d.verification_status === "verified",
            )
              ? "Yes"
              : "No"}
          </Descriptions.Item>
          <Descriptions.Item label="Registration Date">
            {vendor.created_at
              ? new Date(vendor.created_at).toLocaleString()
              : "Not available"}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Reject Modal */}
      <Modal
        title="Reject Vendor Application"
        open={rejectModal.visible}
        onOk={handleRejectVendor}
        onCancel={() => {
          setRejectModal({ visible: false });
          form.resetFields();
        }}
        confirmLoading={actionLoading === "reject"}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Vendor">
            <Text>{vendor.business_name || user.email}</Text>
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
          setSuspendModal({ visible: false });
          form.resetFields();
        }}
        confirmLoading={actionLoading === "suspend"}
        okButtonProps={{ danger: true }}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Vendor">
            <Text>{vendor.business_name || user.email}</Text>
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

export default VendorDetail;
