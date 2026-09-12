import { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Empty,
  Form,
  Input,
  List,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Tag,
  Typography,
  message,
} from "antd";
import {
  BankOutlined,
  CheckCircleFilled,
  DeleteOutlined,
  EditOutlined,
  FileSearchOutlined,
  IdcardOutlined,
  MailOutlined,
  MobileOutlined,
  PhoneOutlined,
  PlusOutlined,
  SaveOutlined,
  UploadOutlined,
  WarningFilled,
} from "@ant-design/icons";
import { useTheme } from "../../context/ThemeProvider.jsx";
import { AppContext } from "../../context/AppContext.jsx";

const { Title, Text, Paragraph } = Typography;
const PAYMENT_TYPES = [
  { value: "telebirr", label: "Telebirr" },
  { value: "cbe", label: "CBE" },
  { value: "boa", label: "BOA" },
];
const DOCUMENT_LABELS = {
  national_id: "National ID",
  passport: "Passport",
  drivers_license: "Driver's License",
  voter_id: "Voter ID",
  business_license: "Business License",
  tax_certificate: "Tax Certificate",
};
const emptyVendor = {
  businessName: "",
  businessNameAm: "",
  businessType: "",
  businessTypeAm: "",
  description: "",
  descriptionAm: "",
  address: "",
  addressAm: "",
  city: "",
  cityAm: "",
  phone: "",
  email: "",
  registrationNumber: "",
  verificationStatus: "pending",
  verificationApprovedAt: null,
  paymentMethods: [],
  identityDocuments: [],
};
const authConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
});
const documentLabel = (type) => DOCUMENT_LABELS[type] || type || "Document";
const maskNumber = (value) =>
  !value
    ? "Not provided"
    : value.length <= 4
      ? value
      : `****${value.slice(-4)}`;
const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(
        new Date(value),
      )
    : "Not available";
const normalizedStatus = (value) =>
  value === "approved" ? "verified" : value || "pending";

const statusTag = (value) => {
  const status = normalizedStatus(value);
  const config = {
    verified: ["green", "Verified"],
    pending: ["gold", "Pending"],
    under_review: ["gold", "Under Review"],
    rejected: ["red", "Rejected"],
  };
  const [color, label] = config[status] || config.pending;
  return <Tag color={color}>{label}</Tag>;
};

const mapVendor = (data = {}, documents = []) => ({
  ...emptyVendor,
  businessName: data.business_name || "",
  businessNameAm: data.business_name_am || "",
  businessType: data.business_type || "",
  businessTypeAm: data.business_type_am || "",
  description: data.description || "",
  descriptionAm: data.description_am || "",
  address: data.address || "",
  addressAm: data.address_am || "",
  city: data.city || "",
  cityAm: data.city_am || "",
  phone: data.phone || "",
  email: data.email || "",
  registrationNumber: data.registration_number || "",
  verificationStatus: data.verification_status || "pending",
  verificationApprovedAt: data.verification_approved_at || null,
  paymentMethods: data.payment_methods || [],
  identityDocuments: documents || [],
});
const businessValues = (vendor) => ({
  businessName: vendor.businessName,
  businessNameAm: vendor.businessNameAm,
  businessType: vendor.businessType,
  businessTypeAm: vendor.businessTypeAm,
  description: vendor.description,
  descriptionAm: vendor.descriptionAm,
  address: vendor.address,
  addressAm: vendor.addressAm,
  city: vendor.city,
  cityAm: vendor.cityAm,
  phone: vendor.phone,
  email: vendor.email,
  registrationNumber: vendor.registrationNumber,
});

const VendorProfile = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { backendUrl } = useContext(AppContext);
  const [vendor, setVendor] = useState(emptyVendor);
  const [profileExists, setProfileExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [businessOpen, setBusinessOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [documentsOpen, setDocumentsOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [businessForm] = Form.useForm();
  const [paymentForm] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const isDark = theme === "dark";

  const loadProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${backendUrl}/vendor/profile`,
        authConfig(),
      );
      const nextVendor = mapVendor(
        response.data.vendor,
        response.data.identity_documents,
      );
      setVendor(nextVendor);
      setProfileExists(Boolean(response.data.vendor));
      if (!response.data.vendor) setBusinessOpen(true);
      localStorage.setItem(
        "vendorProfile",
        JSON.stringify(response.data.vendor),
      );
      businessForm.setFieldsValue(businessValues(nextVendor));
    } catch (error) {
      if (error.response?.status === 404) {
        setBusinessOpen(true);
      } else
        messageApi.error(
          error.response?.data?.message || "Unable to load your profile.",
        );
    } finally {
      setLoading(false);
    }
  }, [backendUrl, businessForm, messageApi]);
  useEffect(() => {
    const fetchProfile = async () => {
      await loadProfile();
    };
    fetchProfile();
  }, [loadProfile]);

  const saveBusiness = async (values) => {
    setSaving(true);
    const payload = {
      business_name: values.businessName,
      business_name_am: values.businessNameAm,
      business_type: values.businessType,
      business_type_am: values.businessTypeAm,
      description: values.description,
      description_am: values.descriptionAm,
      address: values.address,
      address_am: values.addressAm,
      city: values.city,
      city_am: values.cityAm,
      phone: values.phone,
      email: values.email,
      registration_number: values.registrationNumber,
    };
    try {
      const response = profileExists
        ? await axios.put(`${backendUrl}/vendor/profile`, payload, authConfig())
        : await axios.post(
            `${backendUrl}/vendor/register`,
            payload,
            authConfig(),
          );
      setVendor(
        mapVendor(
          response.data.vendor,
          response.data.identity_documents || vendor.identityDocuments,
        ),
      );
      localStorage.setItem(
        "vendorProfile",
        JSON.stringify(response.data.vendor),
      );
      setProfileExists(true);
      setBusinessOpen(false);
      messageApi.success(
        response.data.message || "Business information saved.",
      );
    } catch (error) {
      const errors = error.response?.data?.errors;
      messageApi.error(
        errors
          ? Object.values(errors).flat()[0]
          : error.response?.data?.message ||
              "Unable to save business information.",
      );
    } finally {
      setSaving(false);
    }
  };

  const openBusiness = () => {
    businessForm.setFieldsValue(businessValues(vendor));
    setBusinessOpen(true);
  };
  const openPayment = (item = null) => {
    setEditingPayment(item);
    paymentForm.setFieldsValue(
      item
        ? {
            paymentType: item.payment_type,
            accountName: item.account_name,
            accountNumber: item.account_number,
            bankName: item.bank_name,
            bankBranch: item.bank_branch,
            mobileProvider: item.mobile_provider,
            mobileNumber: item.mobile_number,
            isPrimary: item.is_primary,
          }
        : {
            paymentType: "telebirr",
            isPrimary: vendor.paymentMethods.length === 0,
          },
    );
    setPaymentOpen(true);
  };
  const savePayment = async (values) => {
    setSaving(true);
    const payload = {
      payment_type: values.paymentType,
      account_name: values.accountName,
      account_number: values.accountNumber,
      mobile_number: values.mobileNumber,
      is_primary: values.isPrimary || false,
      is_active: true,
    };
    try {
      const response = editingPayment
        ? await axios.put(
            `${backendUrl}/vendor/payment-methods/${editingPayment.id}`,
            payload,
            authConfig(),
          )
        : await axios.post(
            `${backendUrl}/vendor/payment-methods`,
            payload,
            authConfig(),
          );
      const item = response.data.payment_method;
      const methods = editingPayment
        ? vendor.paymentMethods.map((entry) =>
            entry.id === item.id ? item : entry,
          )
        : [...vendor.paymentMethods, item];
      setVendor((current) => ({
        ...current,
        paymentMethods: payload.is_primary
          ? methods.map((entry) => ({
              ...entry,
              is_primary: entry.id === item.id,
            }))
          : methods,
      }));
      setPaymentOpen(false);
      messageApi.success(response.data.message || "Payment method saved.");
    } catch (error) {
      const errors = error.response?.data?.errors;
      messageApi.error(
        errors
          ? Object.values(errors).flat()[0]
          : error.response?.data?.message || "Unable to save payment method.",
      );
    } finally {
      setSaving(false);
    }
  };
  const deletePayment = async (item) => {
    try {
      await axios.delete(
        `${backendUrl}/vendor/payment-methods/${item.id}`,
        authConfig(),
      );
      setVendor((current) => ({
        ...current,
        paymentMethods: current.paymentMethods.filter(
          (entry) => entry.id !== item.id,
        ),
      }));
      messageApi.success("Payment method deleted.");
    } catch (error) {
      messageApi.error(
        error.response?.data?.message || "Unable to delete payment method.",
      );
    }
  };

  const status = normalizedStatus(vendor.verificationStatus);
  return (
    <div
      className={`vendor-profile-page${isDark ? " vendor-profile-page--dark" : ""}`}
    >
      {contextHolder}
      <main className="vendor-profile-content">
        <div className="vendor-profile-intro">
          <div>
            <Text className="vendor-eyebrow">VENDOR SETTINGS</Text>
            <Title level={1}>Update your business profile</Title>
            <Paragraph>
              Keep your business information, verification, and payout details
              current.
            </Paragraph>
          </div>
          <Button type="primary" icon={<EditOutlined />} onClick={openBusiness}>
            Edit Business Info
          </Button>
        </div>
        {loading ? (
          <Card loading className="vendor-profile-card" />
        ) : (
          <Space orientation="vertical" size={20} style={{ width: "100%" }}>
            <Card
              className="vendor-profile-card"
              title={
                <SectionTitle
                  icon={<BankOutlined />}
                  title="Business Information"
                />
              }
              extra={
                <Button icon={<EditOutlined />} onClick={openBusiness}>
                  Edit Business Info
                </Button>
              }
            >
              <Descriptions column={{ xs: 1, sm: 2, lg: 3 }} colon={false}>
                <Descriptions.Item label="Business Name">
                  {vendor.businessName || "Not provided"}
                </Descriptions.Item>
                <Descriptions.Item label="Business Type">
                  {vendor.businessType || "Not provided"}
                </Descriptions.Item>
                <Descriptions.Item label="Registration Number">
                  {vendor.registrationNumber || "Not provided"}
                </Descriptions.Item>
                <Descriptions.Item label="Address">
                  {vendor.address || "Not provided"}
                </Descriptions.Item>
                <Descriptions.Item label="City">
                  {vendor.city || "Not provided"}
                </Descriptions.Item>
                <Descriptions.Item label="Phone">
                  <PhoneOutlined /> {vendor.phone || "Not provided"}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  <MailOutlined /> {vendor.email || "Not provided"}
                </Descriptions.Item>
                <Descriptions.Item label="Description" span={2}>
                  {vendor.description || "Not provided"}
                </Descriptions.Item>
              </Descriptions>
            </Card>
            <VerificationCard
              status={status}
              documents={vendor.identityDocuments}
              verifiedSince={vendor.verificationApprovedAt}
              onSubmit={() => navigate("/vendor/verify")}
              onView={() => setDocumentsOpen(true)}
            />
            <Card
              className="vendor-profile-card"
              title={
                <SectionTitle icon={<BankOutlined />} title="Payment Methods" />
              }
              extra={
                <Button
                  type="primary"
                  ghost
                  icon={<PlusOutlined />}
                  onClick={() => openPayment()}
                >
                  Add Payment Method
                </Button>
              }
            >
              {vendor.paymentMethods.length ? (
                <List
                  dataSource={vendor.paymentMethods}
                  renderItem={(item) => (
                    <PaymentRow
                      item={item}
                      onEdit={() => openPayment(item)}
                      onDelete={() => deletePayment(item)}
                    />
                  )}
                />
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No payment methods saved yet"
                />
              )}
            </Card>
            <div className="vendor-profile-actions">
              <Button size="large" onClick={openBusiness}>
                Update Business Profile
              </Button>
              <Button
                size="large"
                type="primary"
                icon={<SaveOutlined />}
                onClick={openBusiness}
              >
                Save All Changes
              </Button>
            </div>
          </Space>
        )}
      </main>
      <BusinessModal
        open={businessOpen}
        form={businessForm}
        saving={saving}
        isNew={!profileExists}
        onCancel={() => setBusinessOpen(false)}
        onSubmit={saveBusiness}
      />
      <PaymentModal
        open={paymentOpen}
        form={paymentForm}
        saving={saving}
        editing={editingPayment}
        onCancel={() => setPaymentOpen(false)}
        onSubmit={savePayment}
      />
      <Modal
        open={documentsOpen}
        title="Verified Documents"
        onCancel={() => setDocumentsOpen(false)}
        footer={<Button onClick={() => setDocumentsOpen(false)}>Close</Button>}
      >
        <List
          dataSource={vendor.identityDocuments}
          locale={{ emptyText: "No documents submitted" }}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={documentLabel(item.document_type)}
                description={`${item.document_number || "Number unavailable"} · ${item.document_country || "Country unavailable"}`}
              />
              {statusTag(item.verification_status)}
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};

const SectionTitle = ({ icon, title }) => (
  <span className="section-title">
    {icon}
    <span>{title}</span>
  </span>
);
const VerificationCard = ({
  status,
  documents,
  verifiedSince,
  onSubmit,
  onView,
}) => {
  const verified = status === "verified";
  const pending = status === "pending" || status === "under_review";
  const items =
    verified || pending
      ? documents
      : [
          { document_type: "national_id" },
          { document_type: "business_license" },
          { document_type: "tax_certificate" },
        ];
  const heading = verified
    ? "Your account is verified"
    : pending
      ? "Verification in progress"
      : status === "rejected"
        ? "Verification needs attention"
        : "Your account is not verified";
  const description = verified
    ? `Verified since: ${formatDate(verifiedSince)}`
    : pending
      ? "Your documents are being reviewed"
      : status === "rejected"
        ? "Please review and resubmit your documents"
        : "Please submit your documents to get verified";
  return (
    <Card
      className={`vendor-profile-card verification-card verification-card--${verified ? "verified" : pending ? "pending" : "not-verified"}`}
    >
      <div className="verification-card__top">
        <div className="verification-card__icon">
          {verified ? (
            <CheckCircleFilled />
          ) : pending ? (
            <FileSearchOutlined />
          ) : (
            <WarningFilled />
          )}
        </div>
        <div>
          <Title level={3}>{heading}</Title>
          <Text>{description}</Text>
          {verified && (
            <Text className="verification-level">
              Verification Level: Standard
            </Text>
          )}
          {pending && (
            <Text className="verification-level">
              Estimated time: 2-3 business days
            </Text>
          )}
        </div>
        {statusTag(status)}
      </div>
      <Divider />
      <Text strong>
        {verified
          ? "Verified Documents"
          : pending
            ? "Submitted Documents"
            : "Required Documents"}
      </Text>
      <List
        className="document-list"
        dataSource={items}
        locale={{ emptyText: "No documents submitted" }}
        renderItem={(item) => (
          <List.Item>
            <span>
              <IdcardOutlined /> {documentLabel(item.document_type)}
            </span>
            {statusTag(
              verified ? "verified" : item.verification_status || "pending",
            )}
          </List.Item>
        )}
      />
      <Button
        type={verified ? "default" : "primary"}
        icon={verified ? <FileSearchOutlined /> : <UploadOutlined />}
        onClick={verified ? onView : onSubmit}
      >
        {verified ? "View Documents" : "Verify Account"}
      </Button>
    </Card>
  );
};
const PaymentRow = ({ item, onEdit, onDelete }) => (
  <List.Item
    actions={[
      <Button key="edit" type="text" icon={<EditOutlined />} onClick={onEdit}>
        Edit
      </Button>,
      <Popconfirm
        key="delete"
        title="Delete this payment method?"
        onConfirm={onDelete}
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        <Button type="text" danger icon={<DeleteOutlined />}>
          Delete
        </Button>
      </Popconfirm>,
    ]}
  >
    <List.Item.Meta
      avatar={
        <Avatar
          className="payment-method-avatar"
          icon={item.mobile_provider ? <MobileOutlined /> : <BankOutlined />}
        />
      }
      title={
        <Space wrap>
          <Text strong>{item.payment_type_label || item.payment_type}</Text>
          {item.is_primary && <Tag color="orange">Primary</Tag>}
          {statusTag(item.verification_status)}
        </Space>
      }
      description={
        <Space orientation="vertical" size={2}>
          <Text>
            {item.account_name} · {maskNumber(item.account_number)}
          </Text>
          <Text type="secondary">
            {item.bank_name || item.mobile_provider || "Provider not provided"}
            {item.bank_branch ? ` · ${item.bank_branch}` : ""}
          </Text>
        </Space>
      }
    />
  </List.Item>
);
const Field = ({
  name,
  label,
  required = false,
  type,
  textarea = false,
  span = 6,
}) => (
  <Col xs={24} sm={12} span={span}>
    <Form.Item
      name={name}
      label={label}
      rules={[
        { required, message: `${label} is required` },
        ...(type === "email"
          ? [{ type: "email", message: "Enter a valid email" }]
          : []),
      ]}
    >
      {textarea ? <Input.TextArea rows={3} /> : <Input type={type} />}
    </Form.Item>
  </Col>
);
const BusinessModal = ({ open, form, saving, isNew, onCancel, onSubmit }) => (
  <Modal
    open={open}
    title={
      <SectionTitle icon={<BankOutlined />} title="Business Information" />
    }
    onCancel={onCancel}
    footer={null}
    width={820}
    forceRender
    destroyOnHidden
  >
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      className="modal-form"
    >
      <Row gutter={16}>
        <Field name="businessName" label="Business Name" required />
        <Field name="businessType" label="Business Type" required />
        <Field name="address" label="Address" required />
        <Field name="city" label="City" required />
        <Field name="phone" label="Phone" required />
        <Field name="email" label="Email" type="email" />
        <Field name="registrationNumber" label="Registration Number" />
        <Field name="description" label="Description" textarea span={12} />
      </Row>
      <div className="modal-form__actions">
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="primary" htmlType="submit" loading={saving}>
          {isNew ? "Create Profile" : "Save Business Info"}
        </Button>
      </div>
    </Form>
  </Modal>
);
const PaymentModal = ({ open, form, saving, editing, onCancel, onSubmit }) => (
  <Modal
    open={open}
    title={
      <SectionTitle
        icon={<BankOutlined />}
        title={editing ? "Edit Payment Method" : "Add Payment Method"}
      />
    }
    onCancel={onCancel}
    footer={null}
    width={680}
    forceRender
    destroyOnHidden
  >
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      className="modal-form"
    >
      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item
            name="paymentType"
            label="Type"
            rules={[{ required: true }]}
          >
            <Select options={PAYMENT_TYPES} />
          </Form.Item>
        </Col>
        <Field name="accountName" label="Account Name" required />
        <Field name="accountNumber" label="Account Number" required />
        <Field name="mobileNumber" label="Mobile Number" />
      </Row>
      <Form.Item name="isPrimary" valuePropName="checked">
        <Button type="link">Set as primary method</Button>
      </Form.Item>
      <div className="modal-form__actions">
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="primary" htmlType="submit" loading={saving}>
          {editing ? "Save Changes" : "Add Payment Method"}
        </Button>
      </div>
    </Form>
  </Modal>
);

export default VendorProfile;
