import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Space,
  Tag,
  List,
  Button,
  Progress,
  Input,
  Select,
  Upload,
  Form,
} from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  BankOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { useTheme } from "../../context/ThemeProvider.jsx";

const { Title, Text } = Typography;

const Verify = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [form] = Form.useForm();
  const [submitState, setSubmitState] = useState("idle");

  const verificationSnapshot = {
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

  const statusColor = {
    approved: "green",
    verified: "green",
    pending: "orange",
    under_review: "blue",
    rejected: "red",
  };

  const isVendorVerified =
    verificationSnapshot.vendor.verificationStatus === "approved" ||
    (verificationSnapshot.vendor.identityVerified &&
      verificationSnapshot.vendor.paymentMethodsVerified);

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "32px",
        background: isDark ? "#060b17" : "#f4f8fd",
      }}
    >
      <Row gutter={[24, 24]}>
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
            <Space direction="vertical" size={14} style={{ width: "100%" }}>
              <Title level={3} style={{ margin: 0 }}>
                Vendor Credentials Verification
              </Title>
              <Text type="secondary">
                Review identity documents, payment methods, and operator
                eligibility using the database-backed verification schema.
              </Text>
            </Space>
          </Card>
        </Col>

        {!isVendorVerified && (
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
              <Title level={4} style={{ marginTop: 0 }}>
                New Vendor Verification Inputs
              </Title>
              <Form
                form={form}
                layout="vertical"
                onFinish={(values) => {
                  setSubmitState("submitted");
                  console.log("Verification submission payload:", values);
                }}
              >
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Document Type"
                      name="documentType"
                      initialValue="national_id"
                    >
                      <Select
                        options={[
                          { value: "national_id", label: "National ID" },
                          { value: "passport", label: "Passport" },
                          {
                            value: "drivers_license",
                            label: "Driver's License",
                          },
                          { value: "voter_id", label: "Voter ID" },
                        ]}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Document Number"
                      name="documentNumber"
                      rules={[
                        {
                          required: true,
                          message: "Please enter document number",
                        },
                      ]}
                    >
                      <Input placeholder="ET-909122867" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Country"
                      name="documentCountry"
                      initialValue="Ethiopia"
                    >
                      <Input placeholder="Ethiopia" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Document Front Image"
                      name="documentFrontUrl"
                      rules={[
                        { required: true, message: "Upload front image" },
                      ]}
                    >
                      <Upload>
                        <Button>Upload Front</Button>
                      </Upload>
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Document Back Image"
                      name="documentBackUrl"
                    >
                      <Upload>
                        <Button>Upload Back</Button>
                      </Upload>
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Selfie With Document"
                      name="selfieWithDocumentUrl"
                    >
                      <Upload>
                        <Button>Upload Selfie</Button>
                      </Upload>
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Payment Type"
                      name="paymentType"
                      initialValue="bank_transfer"
                    >
                      <Select
                        options={[
                          { value: "bank_transfer", label: "Bank Transfer" },
                          { value: "mobile_money", label: "Mobile Money" },
                          { value: "paypal", label: "PayPal" },
                          { value: "stripe", label: "Stripe" },
                          { value: "chapa", label: "Chapa" },
                          { value: "telebirr", label: "Telebirr" },
                        ]}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Account Name"
                      name="accountName"
                      rules={[
                        {
                          required: true,
                          message: "Please enter account name",
                        },
                      ]}
                    >
                      <Input placeholder="Sterling Constructions Ltd" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Account Number"
                      name="accountNumber"
                      rules={[
                        {
                          required: true,
                          message: "Please enter account number",
                        },
                      ]}
                    >
                      <Input placeholder="1000002468" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item label="Bank Name" name="bankName">
                      <Input placeholder="Commercial Bank of Ethiopia" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item label="Bank Branch" name="bankBranch">
                      <Input placeholder="Addis Ababa Main Branch" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item label="Mobile Provider" name="mobileProvider">
                      <Input placeholder="Telebirr" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item label="Mobile Number" name="mobileNumber">
                      <Input placeholder="+251-900-111-222" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item label="Business Name" name="businessName">
                      <Input placeholder="Sterling Constructions Ltd" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Registration Number"
                      name="registrationNumber"
                    >
                      <Input placeholder="REG-2044-ET" />
                    </Form.Item>
                  </Col>

                  <Col xs={24}>
                    <Form.Item>
                      <Space size={16} wrap>
                        <Button type="primary" htmlType="submit">
                          Submit Verification
                        </Button>
                        <Button onClick={() => form.resetFields()}>
                          Reset
                        </Button>
                      </Space>
                      {submitState === "submitted" && (
                        <Text type="success">
                          Verification input submitted successfully.
                        </Text>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
          </Col>
        )}

        {isVendorVerified && (
          <>
            <Col xs={24} md={8}>
              <Card
                style={{
                  borderRadius: 24,
                  background: isDark ? "#0f172a" : "#ffffff",
                  border: isDark
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "1px solid rgba(15,23,42,0.07)",
                }}
              >
                <Space direction="vertical" size={16} style={{ width: "100%" }}>
                  <Title level={4} style={{ margin: 0 }}>
                    Verification Summary
                  </Title>
                  <Progress
                    percent={Math.round(
                      (((verificationSnapshot.vendor.identityVerified ? 1 : 0) +
                        (verificationSnapshot.vendor.paymentMethodsVerified
                          ? 1
                          : 0) +
                        1) /
                        3) *
                        100,
                    )}
                    status="active"
                    strokeColor="#16a34a"
                  />
                  <Text>
                    Business: {verificationSnapshot.vendor.businessName}
                  </Text>
                  <Text>
                    Status: {verificationSnapshot.vendor.verificationStatus}
                  </Text>
                  <Text>
                    Trust score: {verificationSnapshot.vendor.trustScore}/100
                  </Text>
                  <Text>
                    Review stage: {verificationSnapshot.vendor.reviewStage}
                  </Text>
                </Space>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card
                style={{
                  borderRadius: 24,
                  background: isDark ? "#0f172a" : "#ffffff",
                  border: isDark
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "1px solid rgba(15,23,42,0.07)",
                }}
              >
                <Title level={4} style={{ marginTop: 0 }}>
                  <IdcardOutlined /> Identity Documents
                </Title>
                <List
                  dataSource={verificationSnapshot.documents}
                  renderItem={(item) => (
                    <List.Item>
                      <Space direction="vertical" size={4}>
                        <Text strong>
                          {item.type.replace("_", " ").toUpperCase()}
                        </Text>
                        <Text>{item.number}</Text>
                        <Text>{item.country}</Text>
                        <Tag color={statusColor[item.status] || "default"}>
                          {item.status}
                        </Tag>
                      </Space>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card
                style={{
                  borderRadius: 24,
                  background: isDark ? "#0f172a" : "#ffffff",
                  border: isDark
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "1px solid rgba(15,23,42,0.07)",
                }}
              >
                <Title level={4} style={{ marginTop: 0 }}>
                  <BankOutlined /> Payment Methods
                </Title>
                <List
                  dataSource={verificationSnapshot.payments}
                  renderItem={(item) => (
                    <List.Item>
                      <Space direction="vertical" size={4}>
                        <Text strong>
                          {item.type.replace("_", " ").toUpperCase()}
                        </Text>
                        <Text>{item.accountName}</Text>
                        <Text>{item.accountNumber}</Text>
                        <Tag color={statusColor[item.status] || "default"}>
                          {item.status}
                        </Tag>
                      </Space>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </>
        )}

       
      </Row>
    </div>
  );
};

export default Verify;
