import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  Card,
  Input,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import { EyeOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { AppContext } from "../../context/AppContext.jsx";
import { useTheme } from "../../context/ThemeProvider.jsx";

const { Title, Text } = Typography;
const authConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
});

const Users = () => {
  const { backendUrl } = useContext(AppContext);
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === "dark";
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${backendUrl}/admin/users?per_page=100`,
        authConfig(),
      );
      const data = response.data.users;
      const userList = Array.isArray(data) ? data : data?.data || [];
      setUsers(
        userList.map((user) => ({
          ...user,
          full_name:
            user.full_name ||
            [user.first_name, user.middle_name, user.last_name]
              .filter(Boolean)
              .join(" ") ||
            "Unnamed user",
          flags: user.flags || {
            active: Boolean(user.is_active),
            banned: Boolean(user.is_banned),
            label: user.is_banned
              ? "Banned"
              : user.is_active
                ? "Active"
                : "Inactive",
          },
        })),
      );
    } catch (error) {
      messageApi.error(
        error.response?.data?.message || "Unable to load users.",
      );
    } finally {
      setLoading(false);
    }
  }, [backendUrl, messageApi]);

  useEffect(() => {
    const fetchUsers = async () => {
      await loadUsers();
    };
    fetchUsers();
  }, [loadUsers]);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return users;
    return users.filter((user) =>
      [user.full_name, user.email, user.role, user.phone]
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [search, users]);

  const columns = [
    {
      title: "USER",
      key: "user",
      render: (_, user) => {
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
        return (
          <Space>
            <Avatar style={{ background: "#fed7aa", color: "#c2410c" }}>
              {initials}
            </Avatar>
            <div>
              <Text strong>{name}</Text>
              <Text type="secondary" style={{ display: "block" }}>
                ID: {user.id}
              </Text>
            </div>
          </Space>
        );
      },
    },
    { title: "EMAIL", dataIndex: "email", key: "email" },
    {
      title: "ROLE",
      dataIndex: "role",
      key: "role",
      render: (role) => <Tag color="blue">{role?.toUpperCase()}</Tag>,
    },
    {
      title: "PHONE",
      dataIndex: "phone",
      key: "phone",
      render: (phone) => phone || "Not provided",
    },
    {
      title: "STATUS",
      key: "status",
      render: (_, user) => {
        const flagState = user.flags || {
          active: Boolean(user.is_active),
          banned: Boolean(user.is_banned),
          label: user.is_banned
            ? "Banned"
            : user.is_active
              ? "Active"
              : "Inactive",
        };

        return (
          <Tag
            color={
              flagState.banned ? "red" : flagState.active ? "green" : "default"
            }
          >
            {flagState.label}
          </Tag>
        );
      },
    },
    {
      title: "ACTION",
      key: "action",
      render: (_, user) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={(event) => {
            event.stopPropagation();
            navigate(`/admin/users/${user.id}`);
          }}
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div
      className="admin-users-page"
      style={{ background: isDark ? "#060b17" : "#f4f8fd" }}
    >
      {contextHolder}
      <Card className="admin-users-card">
        <div className="admin-users-heading">
          <div>
            <Text className="admin-users-eyebrow">USER SECURITY REGISTRY</Text>
            <Title level={2}>Users & Flags</Title>
            <Text type="secondary">
              Review accounts, access levels, and security status from the
              database.
            </Text>
          </div>
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={loadUsers}
              loading={loading}
            >
              Refresh
            </Button>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search users"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              allowClear
            />
          </Space>
        </div>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredUsers}
          loading={loading}
          onRow={(user) => ({
            onClick: () => navigate(`/admin/users/${user.id}`),
            style: { cursor: "pointer" },
          })}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 900 }}
          locale={{ emptyText: "No users found." }}
        />
      </Card>
    </div>
  );
};

export default Users;
