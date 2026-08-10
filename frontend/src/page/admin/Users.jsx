import React, { useMemo, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Input,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import { DeleteOutlined, FlagOutlined } from "@ant-design/icons";
import { users as allUsers } from "../../assets/dummyAssets.js";
import { useTheme } from "../../context/ThemeProvider.jsx";

const { Title, Text } = Typography;

const Users = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [searchValue, setSearchValue] = useState("");
  const [userStatus, setUserStatus] = useState({
    "user-1": "active",
    "user-2": "active",
    "user-3": "active",
    "user-4": "suspended",
  });

  const rows = useMemo(() => {
    return allUsers.map((user) => {
      const status = userStatus[user.id] || "active";
      return {
        key: user.id,
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.toUpperCase(),
        joinDate: user.joinDate,
        status,
        initials: user.name
          .split(" ")
          .map((part) => part[0])
          .slice(0, 2)
          .join("")
          .toUpperCase(),
      };
    });
  }, [userStatus]);

  const filteredRows = useMemo(() => {
    const term = searchValue.trim().toLowerCase();
    if (!term) return rows;

    return rows.filter((row) => {
      return [row.name, row.email, row.role, row.joinDate, row.status]
        .join(" ")
        .toLowerCase()
        .includes(term);
    });
  }, [rows, searchValue]);

  const columns = [
    {
      title: "USER NAME",
      dataIndex: "name",
      key: "name",
      render: (name, record) => (
        <Space size={14} align="center">
          <Avatar size={40} style={{ background: "#c7d2fe", color: "#3730a3" }}>
            {record.initials}
          </Avatar>
          <div>
            <Text strong style={{ color: isDark ? "#f8fafc" : "#111827" }}>
              {name}
            </Text>
            <Text type="secondary" style={{ display: "block" }}>
              ID: {record.id}
            </Text>
          </div>
        </Space>
      ),
      width: 260,
    },
    {
      title: "CONTACT EMAIL",
      dataIndex: "email",
      key: "email",
      render: (email) => (
        <Text style={{ color: isDark ? "#cbd5e1" : "#475569" }}>{email}</Text>
      ),
      width: 260,
    },
    {
      title: "SYSTEM ACCESS LEVEL",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color="geekblue" style={{ borderRadius: 999, fontWeight: 700 }}>
          {role}
        </Tag>
      ),
      width: 180,
    },
    {
      title: "MEMBER SINCE",
      dataIndex: "joinDate",
      key: "joinDate",
      render: (joinDate) => <Text>{joinDate}</Text>,
      width: 160,
    },
    {
      title: "SECURITY STATE",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={status === "active" ? "#dcfce7" : "#fee2e2"}
          style={{
            color: status === "active" ? "#166534" : "#991b1b",
            borderRadius: 999,
            fontWeight: 700,
          }}
        >
          {status.toUpperCase()}
        </Tag>
      ),
      width: 180,
    },
    {
      title: "ADMINISTRATIVE ACTIONS",
      key: "actions",
      render: (_, record) => (
        <Space size={8} wrap>
          <Button
            type={record.status === "active" ? "primary" : "default"}
            danger={record.status === "active"}
            onClick={() => {
              setUserStatus((prev) => ({
                ...prev,
                [record.id]:
                  prev[record.id] === "active" ? "suspended" : "active",
              }));
            }}
            style={{ borderRadius: 8 }}
          >
            {record.status === "active" ? "Flag & Suspend" : "Activate Account"}
          </Button>
          <Button
            type="text"
            icon={<DeleteOutlined />}
            style={{ color: isDark ? "#f8fafc" : "#ef4444" }}
          />
        </Space>
      ),
      width: 240,
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 28,
        background: isDark ? "#060b17" : "#f4f8fd",
      }}
    >
      <Card
        style={{
          borderRadius: 22,
          background: isDark ? "#0f172a" : "#ffffff",
          border: isDark
            ? "1px solid rgba(255,255,255,0.08)"
            : "1px solid rgba(15,23,42,0.08)",
        }}
      >
        <Space
          direction="vertical"
          size={20}
          style={{ width: "100%", marginBottom: 20 }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <Text
                style={{
                  display: "block",
                  textTransform: "uppercase",
                  letterSpacing: "0.24em",
                  color: isDark ? "#94a3b8" : "#64748b",
                  fontWeight: 700,
                  fontSize: 12,
                }}
              >
                User Security Registry
              </Text>
              <Title
                level={3}
                style={{
                  margin: "8px 0 0",
                  color: isDark ? "#f8fafc" : "#0f172a",
                }}
              >
                Suspend, activate, or review operator logs.
              </Title>
            </div>

            <Input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search user name, email, or status"
              style={{
                minWidth: 280,
                borderRadius: 12,
                background: isDark ? "#0b1423" : "#f8fafc",
                color: isDark ? "#f8fafc" : "#0f172a",
                border: isDark
                  ? "1px solid rgba(255,255,255,0.08)"
                  : "1px solid rgba(15,23,42,0.08)",
              }}
            />
          </div>
          <Text type="secondary">
            Review operator account logs and flag fraudulent transactions from
            this registry.
          </Text>
        </Space>

        <Table
          columns={columns}
          dataSource={filteredRows}
          pagination={false}
          rowKey="key"
          scroll={{ x: 1200 }}
          style={{ background: isDark ? "#0f172a" : "#ffffff" }}
        />
      </Card>
    </div>
  );
};

export default Users;
