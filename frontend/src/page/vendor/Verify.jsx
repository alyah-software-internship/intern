import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Space,
  Tag,
  Button,
  Progress,
  Input,
  Select,
  Upload,
  Form,
  Spin,
  Alert,
  Grid,
  Divider,
  Empty,
} from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  BankOutlined,
  IdcardOutlined,
  FileOutlined,
  UserOutlined,
  MobileOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { useTheme } from "../../context/ThemeProvider.jsx";

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

// Constants
const STATUS_COLORS = {
  approved: "green",
  verified: "green",
  pending: "orange",
  under_review: "blue",
  rejected: "red",
};

const DOCUMENT_TYPES = [
  { value: "national_id", label: "National ID" },
  { value: "passport", label: "Passport" },
  { value: "drivers_license", label: "Driver's License" },
  { value: "voter_id", label: "Voter ID" },
];

const PAYMENT_TYPES = [
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "mobile_money", label: "Mobile Money" },
  { value: "paypal", label: "PayPal" },
  { value: "stripe", label: "Stripe" },
  { value: "chapa", label: "Chapa" },
  { value: "telebirr", label: "Telebirr" },
];

// Utility functions
const calculateVerificationProgress = (vendor) => {
  const items = [
    vendor.identityVerified,
    vendor.paymentMethodsVerified,
    true, // Always include one for business info
  ];
  const completed = items.filter(Boolean).length;
  return Math.round((completed / items.length) * 100);
};

const isVendorFullyVerified = (vendor) => {
  return (
    vendor.verificationStatus === "approved" ||
    (vendor.identityVerified && vendor.paymentMethodsVerified)
  );
};

// Sub-components
const VerificationSummary = ({ vendor, isDark }) => {
  const screens = useBreakpoint();
  const progress = calculateVerificationProgress(vendor);

  return (
    <Card
      style={{
        borderRadius: 24,
        height: "100%",
        background: isDark ? "#0f172a" : "#ffffff",
        border: isDark
          ? "1px solid rgba(255,255,255,0.08)"
          : "1px solid rgba(15,23,42,0.07)",
      }}
    >
      <Space
        orientation="vertical"
        size={screens.xs ? 12 : 16}
        style={{ width: "100%" }}
      >
        <Title level={screens.xs ? 5 : 4} style={{ margin: 0 }}>
          Verification Summary
        </Title>
        <Progress
          percent={progress}
          status="active"
          strokeColor="#16a34a"
          size={screens.xs ? "small" : "medium"}
        />
        <div
          style={{
            display: "flex",
            flexDirection: screens.xs ? "column" : "row",
            gap: 8,
          }}
        >
          <Text strong>Business:</Text>
          <Text>{vendor.businessName}</Text>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: screens.xs ? "column" : "row",
            gap: 8,
          }}
        >
          <Text strong>Status:</Text>
          <Tag color={STATUS_COLORS[vendor.verificationStatus] || "default"}>
            {vendor.verificationStatus}
          </Tag>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: screens.xs ? "column" : "row",
            gap: 8,
          }}
        >
          <Text strong>Trust score:</Text>
          <Text>{vendor.trustScore}/100</Text>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: screens.xs ? "column" : "row",
            gap: 8,
          }}
        >
          <Text strong>Review stage:</Text>
          <Text>{vendor.reviewStage}</Text>
        </div>
      </Space>
    </Card>
  );
};

const DocumentList = ({ documents, isDark }) => {
  const screens = useBreakpoint();

  return (
    <Card
      style={{
        borderRadius: 24,
        height: "100%",
        background: isDark ? "#0f172a" : "#ffffff",
        border: isDark
          ? "1px solid rgba(255,255,255,0.08)"
          : "1px solid rgba(15,23,42,0.07)",
      }}
    >
      <Title level={screens.xs ? 5 : 4} style={{ marginTop: 0 }}>
        <IdcardOutlined /> Identity Documents
      </Title>
      {documents.length === 0 ? (
        <Empty description="No documents uploaded" />
      ) : (
        <div>
          {documents.map((item) => (
            <div
              key={`${item.type}-${item.number}`}
              style={{
                padding: screens.xs ? "8px 0" : "12px 0",
                borderBottom: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              <Space orientation="vertical" size={4} style={{ width: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text
                    strong
                    style={{ fontSize: screens.xs ? "14px" : "16px" }}
                  >
                    {item.type.replace("_", " ").toUpperCase()}
                  </Text>
                  <Tag
                    color={STATUS_COLORS[item.status] || "default"}
                    style={{ margin: 0 }}
                  >
                    {item.status}
                  </Tag>
                </div>
                <Text
                  type="secondary"
                  style={{ fontSize: screens.xs ? "12px" : "14px" }}
                >
                  <GlobalOutlined /> {item.country}
                </Text>
                <Text
                  copyable
                  style={{ fontSize: screens.xs ? "12px" : "14px" }}
                >
                  {item.number}
                </Text>
              </Space>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

const PaymentMethodsList = ({ payments, isDark }) => {
  const screens = useBreakpoint();

  return (
    <Card
      style={{
        borderRadius: 24,
        height: "100%",
        background: isDark ? "#0f172a" : "#ffffff",
        border: isDark
          ? "1px solid rgba(255,255,255,0.08)"
          : "1px solid rgba(15,23,42,0.07)",
      }}
    >
      <Title level={screens.xs ? 5 : 4} style={{ marginTop: 0 }}>
        <BankOutlined /> Payment Methods
      </Title>
      {payments.length === 0 ? (
        <Empty description="No payment methods added" />
      ) : (
        <div>
          {payments.map((item) => (
            <div
              key={`${item.type}-${item.accountNumber}`}
              style={{
                padding: screens.xs ? "8px 0" : "12px 0",
                borderBottom: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              <Space orientation="vertical" size={4} style={{ width: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text
                    strong
                    style={{ fontSize: screens.xs ? "14px" : "16px" }}
                  >
                    {item.type.replace("_", " ").toUpperCase()}
                  </Text>
                  <Tag
                    color={STATUS_COLORS[item.status] || "default"}
                    style={{ margin: 0 }}
                  >
                    {item.status}
                  </Tag>
                </div>
                <Text style={{ fontSize: screens.xs ? "12px" : "14px" }}>
                  {item.accountName}
                </Text>
                <Text
                  copyable
                  style={{ fontSize: screens.xs ? "12px" : "14px" }}
                >
                  {item.accountNumber}
                </Text>
              </Space>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

const VerificationForm = ({ onSubmit, isDark, loading }) => {
  const screens = useBreakpoint();
  const [form] = Form.useForm();
  const [submitState, setSubmitState] = useState("idle");
  const [error, setError] = useState(null);

  const handleSubmit = async (values) => {
    setSubmitState("submitting");
    setError(null);
    try {
      await onSubmit(values);
      setSubmitState("submitted");
      form.resetFields();
    } catch (err) {
      setError(err.message || "Submission failed");
      setSubmitState("error");
    }
  };

  return (
    <Card
      style={{
        borderRadius: 24,
        background: isDark ? "#0f172a" : "#ffffff",
        border: isDark
          ? "1px solid rgba(255,255,255,0.08)"
          : "1px solid rgba(15,23,42,0.07)",
      }}
    >
      <Title level={screens.xs ? 5 : 4} style={{ marginTop: 0 }}>
        <FileOutlined /> New Vendor Verification Inputs
      </Title>

      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          closable
          style={{ marginBottom: 16 }}
          onClose={() => setError(null)}
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          documentType: "national_id",
          documentCountry: "Ethiopia",
          paymentType: "bank_transfer",
        }}
      >
        <Row gutter={[screens.xs ? 8 : 16, screens.xs ? 8 : 16]}>
          {/* Document Section */}
          <Col xs={24}>
            <Divider
              orientation="left"
              style={{ fontSize: screens.xs ? "14px" : "16px" }}
            >
              <UserOutlined /> Document Information
            </Divider>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Form.Item
              label="Document Type"
              name="documentType"
              rules={[
                { required: true, message: "Please select document type" },
              ]}
            >
              <Select options={DOCUMENT_TYPES} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Form.Item
              label="Document Number"
              name="documentNumber"
              rules={[
                { required: true, message: "Please enter document number" },
              ]}
            >
              <Input placeholder="ET-909122867" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Form.Item
              label="Country"
              name="documentCountry"
              rules={[{ required: true, message: "Please enter country" }]}
            >
              <Input placeholder="Ethiopia" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Form.Item
              label="Document Front Image"
              name="documentFrontUrl"
              rules={[{ required: true, message: "Please upload front image" }]}
            >
              <Upload
                beforeUpload={() => false}
                maxCount={1}
                style={{ width: "100%" }}
              >
                <Button block={screens.xs}>Upload Front</Button>
              </Upload>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Document Back Image" name="documentBackUrl">
              <Upload
                beforeUpload={() => false}
                maxCount={1}
                style={{ width: "100%" }}
              >
                <Button block={screens.xs}>Upload Back</Button>
              </Upload>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Form.Item
              label="Selfie With Document"
              name="selfieWithDocumentUrl"
            >
              <Upload
                beforeUpload={() => false}
                maxCount={1}
                style={{ width: "100%" }}
              >
                <Button block={screens.xs}>Upload Selfie</Button>
              </Upload>
            </Form.Item>
          </Col>

          {/* Payment Section */}
          <Col xs={24}>
            <Divider
              orientation="left"
              style={{ fontSize: screens.xs ? "14px" : "16px" }}
            >
              <BankOutlined /> Payment Information
            </Divider>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Form.Item
              label="Payment Type"
              name="paymentType"
              rules={[
                { required: true, message: "Please select payment type" },
              ]}
            >
              <Select options={PAYMENT_TYPES} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Form.Item
              label="Account Name"
              name="accountName"
              rules={[{ required: true, message: "Please enter account name" }]}
            >
              <Input placeholder="Sterling Constructions Ltd" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Form.Item
              label="Account Number"
              name="accountNumber"
              rules={[
                { required: true, message: "Please enter account number" },
              ]}
            >
              <Input placeholder="1000002468" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Bank Name" name="bankName">
              <Input placeholder="Commercial Bank of Ethiopia" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Bank Branch" name="bankBranch">
              <Input placeholder="Addis Ababa Main Branch" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Mobile Provider" name="mobileProvider">
              <Input placeholder="Telebirr" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Mobile Number" name="mobileNumber">
              <Input placeholder="+251-900-111-222" />
            </Form.Item>
          </Col>

          {/* Business Section */}
          <Col xs={24}>
            <Divider
              orientation="left"
              style={{ fontSize: screens.xs ? "14px" : "16px" }}
            >
              <BankOutlined /> Business Information
            </Divider>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Business Name" name="businessName">
              <Input placeholder="Sterling Constructions Ltd" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Registration Number" name="registrationNumber">
              <Input placeholder="REG-2044-ET" />
            </Form.Item>
          </Col>

          {/* Form Actions */}
          <Col xs={24}>
            <Form.Item>
              <Space
                direction={screens.xs ? "vertical" : "horizontal"}
                size={16}
                style={{ width: screens.xs ? "100%" : "auto" }}
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitState === "submitting"}
                  block={screens.xs}
                >
                  Submit Verification
                </Button>
                <Button onClick={() => form.resetFields()} block={screens.xs}>
                  Reset
                </Button>
              </Space>
              {submitState === "submitted" && (
                <Alert
                  message="Success"
                  description="Verification input submitted successfully."
                  type="success"
                  showIcon
                  style={{ marginTop: 16 }}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

// Main Component
const Verify = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const screens = useBreakpoint();
  const [loading, setLoading] = useState(false);
  const [verificationData, setVerificationData] = useState(null);
  const [error, setError] = useState(null);

  // Mock data - in real app, fetch from API
  const mockData = {
    vendor: {
      verificationStatus: "approved",
      identityVerified: true,
      paymentMethodsVerified: true,
      businessName: "Sterling Constructions Ltd",
      trustScore: 92,
      totalDocs: 3,
      reviewStage: "final review",
    },
    documents: [
      {
        type: "national_id",
        number: "ET-909122867",
        status: "verified",
        country: "Ethiopia",
      },
      {
        type: "passport",
        number: "P-980421",
        status: "under_review",
        country: "Ethiopia",
      },
    ],
    payments: [
      {
        type: "bank_transfer",
        accountName: "Sterling Constructions Ltd",
        accountNumber: "1000002468",
        status: "verified",
      },
      {
        type: "telebirr",
        accountName: "Sterling Operations",
        accountNumber: "+251-900-111-222",
        status: "pending",
      },
    ],
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setVerificationData(mockData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFormSubmit = async (values) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Verification submission payload:", values);
    return Promise.resolve();
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: isDark ? "#060b17" : "#f4f8fd",
        }}
      >
        <Spin size="large" description="Loading verification data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          padding: screens.xs ? "16px" : "32px",
          background: isDark ? "#060b17" : "#f4f8fd",
        }}
      >
        <Alert
          message="Error Loading Data"
          description={error}
          type="error"
          showIcon
          style={{ borderRadius: 16 }}
        />
      </div>
    );
  }

  if (!verificationData) return null;

  const { vendor, documents, payments } = verificationData;
  const vendorVerified = isVendorFullyVerified(vendor);

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: screens.xs ? "12px" : screens.sm ? "24px" : "32px",
        background: isDark ? "#060b17" : "#f4f8fd",
      }}
    >
      <Row
        gutter={[
          screens.xs ? 12 : screens.sm ? 16 : 24,
          screens.xs ? 12 : screens.sm ? 16 : 24,
        ]}
      >
        {/* Header */}
        <Col xs={24}>
          <Card
            style={{
              borderRadius: 28,
              background: isDark ? "#0f172a" : "#ffffff",
              border: isDark
                ? "1px solid rgba(255,255,255,0.08)"
                : "1px solid rgba(15,23,42,0.07)",
            }}
          >
            <Space
              orientation={screens.xs ? "vertical" : "horizontal"}
              size={screens.xs ? 8 : 14}
              style={{ width: "100%" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Title level={screens.xs ? 4 : 3} style={{ margin: 0 }}>
                  Vendor Credentials Verification
                </Title>
                {vendorVerified ? (
                  <Tag
                    color="success"
                    style={{
                      margin: 0,
                      fontSize: screens.xs ? "12px" : "14px",
                    }}
                  >
                    <CheckCircleOutlined /> Verified
                  </Tag>
                ) : (
                  <Tag
                    color="warning"
                    style={{
                      margin: 0,
                      fontSize: screens.xs ? "12px" : "14px",
                    }}
                  >
                    <ClockCircleOutlined /> Pending
                  </Tag>
                )}
              </div>
              <Paragraph
                type="secondary"
                style={{
                  marginBottom: 0,
                  fontSize: screens.xs ? "13px" : "14px",
                }}
              >
                Review identity documents, payment methods, and operator
                eligibility using the database-backed verification schema.
              </Paragraph>
            </Space>
          </Card>
        </Col>

        {/* Verification Form or Summary */}
        {!vendorVerified ? (
          <Col xs={24}>
            <VerificationForm
              onSubmit={handleFormSubmit}
              isDark={isDark}
              loading={loading}
            />
          </Col>
        ) : (
          <>
            <Col xs={24} md={8}>
              <VerificationSummary vendor={vendor} isDark={isDark} />
            </Col>
            <Col xs={24} md={8}>
              <DocumentList documents={documents} isDark={isDark} />
            </Col>
            <Col xs={24} md={8}>
              <PaymentMethodsList payments={payments} isDark={isDark} />
            </Col>

            {/* Mobile-friendly additional info */}
            {screens.xs && (
              <Col xs={24}>
                <Card
                  style={{
                    borderRadius: 24,
                    background: isDark ? "#0f172a" : "#ffffff",
                    border: isDark
                      ? "1px solid rgba(255,255,255,0.08)"
                      : "1px solid rgba(15,23,42,0.07)",
                  }}
                >
                  <Space orientation="vertical" size={8}>
                    <Text strong>Quick Actions</Text>
                    <Button type="primary" block>
                      <CheckCircleOutlined /> Request Re-verification
                    </Button>
                    <Button block>
                      <FileOutlined /> Download Report
                    </Button>
                  </Space>
                </Card>
              </Col>
            )}
          </>
        )}
      </Row>
    </div>
  );
};

export default Verify;
