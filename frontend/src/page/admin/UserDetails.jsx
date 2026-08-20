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
  Popconfirm,
  Space,
  Spin,
  Tag,
  Typography,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  MailOutlined,
  PhoneOutlined,
  SafetyCertificateOutlined,
  StopOutlined,
  UnlockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { AppContext } from "../../context/AppContext.jsx";

const { Title, Text } = Typography;
const authConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
});

const UserDetails = () => {
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [documentAction, setDocumentAction] = useState(null);
  const [accountAction, setAccountAction] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/admin/users/${id}`,
          authConfig(),
        );
        setUser(response.data.user);
      } catch (error) {
        messageApi.error(
          error.response?.data?.message || "Unable to load user details.",
        );
        navigate("/admin/users");
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [backendUrl, id, messageApi, navigate]);

  const updateDocumentStatus = async (document, action) => {
    setDocumentAction(`${document.id}-${action}`);
    try {
      const response = await axios.post(
        `${backendUrl}/admin/users/${id}/documents/${document.id}/${action}`,
        action === "reject"
          ? { reason: "Document rejected by administrator" }
          : {},
        authConfig(),
      );
      setUser((current) => ({
        ...current,
        identity_documents: current.identity_documents.map((item) =>
          item.id === document.id ? response.data.document : item,
        ),
      }));
      messageApi.success(response.data.message);
    } catch (error) {
      messageApi.error(
        error.response?.data?.message || "Unable to update document.",
      );
    } finally {
      setDocumentAction(null);
    }
  };

  const updateAccount = async (action) => {
    setAccountAction(action);
    try {
      const response = await axios.post(
        `${backendUrl}/admin/users/${id}/${action}`,
        action === "ban" ? { reason: "Blocked by administrator" } : {},
        authConfig(),
      );
      setUser((current) => ({
        ...current,
        ...(action === "ban" ? { is_banned: true } : {}),
        ...(action === "unban"
          ? { is_banned: false, banned_reason: null }
          : {}),
        ...(action === "activate" ? { is_active: true } : {}),
        ...(action === "deactivate" ? { is_active: false } : {}),
      }));
      messageApi.success(response.data.message);
    } catch (error) {
      messageApi.error(
        error.response?.data?.message || "Unable to update account.",
      );
    } finally {
      setAccountAction(null);
    }
  };

  if (loading)
    return (
      <div className="admin-user-details">
        <Spin size="large" />
      </div>
    );
  if (!user) return null;

  const name =
    user.full_name ||
    [user.first_name, user.middle_name, user.last_name]
      .filter(Boolean)
      .join(" ") ||
    "Unnamed user";
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const vendor = user.vendor_profile;

  return (
    <div className="admin-user-details">
      {contextHolder}
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate("/admin/users")}
      >
        Back to Users
      </Button>
      <div className="admin-user-details__hero">
        <Space size={16}>
          <Avatar
            size={72}
            style={{ background: "#fed7aa", color: "#c2410c", fontSize: 24 }}
          >
            {initials}
          </Avatar>
          <div>
            <Title level={2}>{name}</Title>
            <Text type="secondary">{user.email}</Text>
          </div>
        </Space>
        <Space wrap>
          <Tag
            color={
              user.is_banned ? "red" : user.is_active ? "green" : "default"
            }
          >
            {user.is_banned
              ? "Blocked"
              : user.is_active
                ? "Active"
                : "Inactive"}
          </Tag>
          {user.is_banned ? (
            <Button
              icon={<UnlockOutlined />}
              loading={accountAction === "unban"}
              onClick={() => updateAccount("unban")}
            >
              Unblock
            </Button>
          ) : (
            <Popconfirm
              title="Block this user?"
              description="The user will no longer be allowed to use the account."
              okText="Block"
              okButtonProps={{ danger: true }}
              onConfirm={() => updateAccount("ban")}
            >
              <Button
                danger
                icon={<StopOutlined />}
                loading={accountAction === "ban"}
              >
                Block
              </Button>
            </Popconfirm>
          )}
          <Button
            icon={<UserOutlined />}
            loading={
              accountAction === (user.is_active ? "deactivate" : "activate")
            }
            onClick={() =>
              updateAccount(user.is_active ? "deactivate" : "activate")
            }
          >
            {user.is_active ? "Deactivate" : "Activate"}
          </Button>
        </Space>
      </div>
      <div className="admin-user-details__grid">
        <Card title="Account Information">
          <Descriptions column={1} colon={false}>
            <Descriptions.Item label="Role">
              <Tag color="blue">{user.role?.toUpperCase()}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              <MailOutlined /> {user.email}
            </Descriptions.Item>
            <Descriptions.Item label="Phone">
              <PhoneOutlined /> {user.phone || "Not provided"}
            </Descriptions.Item>
            <Descriptions.Item label="Joined">
              {user.created_at
                ? new Date(user.created_at).toLocaleString()
                : "Not available"}
            </Descriptions.Item>
            <Descriptions.Item label="Last Login">
              {user.last_login_at
                ? new Date(user.last_login_at).toLocaleString()
                : "Never"}
            </Descriptions.Item>
            <Descriptions.Item label="Trust Score">
              {user.trust_score ?? "Not available"}
            </Descriptions.Item>
          </Descriptions>
        </Card>
        <Card title="Activity Summary">
          <Descriptions column={1} colon={false}>
            <Descriptions.Item label="Bookings">
              {user.bookings_count ?? 0}
            </Descriptions.Item>
            <Descriptions.Item label="Notifications">
              {user.notifications_count ?? 0}
            </Descriptions.Item>
            <Descriptions.Item label="Email Verified">
              {user.email_verified_at ? "Yes" : "No"}
            </Descriptions.Item>
            <Descriptions.Item label="Phone Verified">
              {user.phone_verified_at ? "Yes" : "No"}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>
      {vendor && (
        <Card
          title={
            <Space>
              <SafetyCertificateOutlined /> Vendor Profile
            </Space>
          }
          style={{ marginTop: 20 }}
        >
          <Descriptions column={{ xs: 1, md: 2 }}>
            <Descriptions.Item label="Business Name">
              {vendor.business_name || "Not provided"}
            </Descriptions.Item>
            <Descriptions.Item label="Business Type">
              {vendor.business_type || "Not provided"}
            </Descriptions.Item>
            <Descriptions.Item label="Verification Status">
              {vendor.verification_status || "Pending"}
            </Descriptions.Item>
            <Descriptions.Item label="Location">
              {[vendor.address, vendor.city, vendor.country]
                .filter(Boolean)
                .join(", ") || "Not provided"}
            </Descriptions.Item>
            <Descriptions.Item label="Registration Number">
              {vendor.registration_number || "Not provided"}
            </Descriptions.Item>
            <Descriptions.Item label="Payment Methods">
              {vendor.payment_methods_verified ? "Verified" : "Not verified"}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}
      <Card title="Identity Documents" style={{ marginTop: 20 }}>
        <List
          dataSource={user.identity_documents || []}
          locale={{ emptyText: "No identity documents submitted." }}
          renderItem={(document) => (
            <List.Item>
              <Space align="start" style={{ width: "100%" }}>
                <Space wrap>
                  {[
                    ["Front", document.document_front_url],
                    ["Back", document.document_back_url],
                    ["Selfie", document.selfie_with_document_url],
                  ]
                    .filter(([, url]) => Boolean(url))
                    .map(([label, url]) => (
                      <Space key={url} direction="vertical" size={2}>
                        <Image
                          width={76}
                          height={56}
                          src={url}
                          style={{ objectFit: "cover", borderRadius: 6 }}
                        />
                        <Text type="secondary" style={{ fontSize: 11 }}>
                          {label}
                        </Text>
                      </Space>
                    ))}
                  <List.Item.Meta
                    title={document.document_type
                      ?.replaceAll("_", " ")
                      .toUpperCase()}
                    description={`${document.document_number || "Number unavailable"} · ${document.document_country || "Country unavailable"}`}
                  />
                </Space>
                <Space wrap>
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
                  {document.verification_status !== "verified" && (
                    <Button
                      size="small"
                      type="primary"
                      loading={documentAction === `${document.id}-approve`}
                      onClick={() => updateDocumentStatus(document, "approve")}
                    >
                      Approve
                    </Button>
                  )}
                  {document.verification_status !== "rejected" && (
                    <Button
                      size="small"
                      danger
                      loading={documentAction === `${document.id}-reject`}
                      onClick={() => updateDocumentStatus(document, "reject")}
                    >
                      Reject
                    </Button>
                  )}
                </Space>
              </Space>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default UserDetails;
