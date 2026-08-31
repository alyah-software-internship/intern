import { useState, useEffect, useContext } from "react";
import {
  Card,
  Table,
  Tag,
  Typography,
  Input,
  Space,
  Button,
  message,
} from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import { AppContext } from "../../context/AppContext.jsx";
import { useTheme } from "../../context/ThemeProvider.jsx";
import axios from "axios";

const { Title, Text } = Typography;
const authConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
});

const Audit = () => {
  const { backendUrl } = useContext(AppContext);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [search, setSearch] = useState("");
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${backendUrl}/admin/audit-logs`,
        authConfig(),
      );
      setAuditLogs(
        Array.isArray(response.data?.logs) ? response.data.logs : [],
      );
    } catch (error) {
      messageApi.error("Failed to load audit logs");
      setAuditLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, [backendUrl]);

  const filteredLogs = auditLogs.filter(
    (log) =>
      String(log.action || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      String(log.target || "")
        .toLowerCase()
        .includes(search.toLowerCase()),
  );

  const columns = [
    {
      title: "ACTION",
      dataIndex: "action",
      key: "action",
      render: (action) => <Text strong>{action}</Text>,
    },
    {
      title: "USER",
      dataIndex: "user",
      key: "user",
    },
    {
      title: "TARGET",
      dataIndex: "target",
      key: "target",
    },
    {
      title: "TIMESTAMP",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (timestamp) => new Date(timestamp).toLocaleString(),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const colorMap = {
          success: "green",
          warning: "orange",
          error: "red",
        };
        return <Tag color={colorMap[status]}>{status.toUpperCase()}</Tag>;
      },
    },
  ];

  return (
    <div
      style={{
        background: isDark ? "#060b17" : "#f4f8fd",
        minHeight: "100%",
        padding: "24px",
      }}
    >
      {contextHolder}
      <Card
        style={{
          borderRadius: 20,
          background: isDark ? "#0f172a" : "#fff",
          border: isDark
            ? "1px solid rgba(255,255,255,0.08)"
            : "1px solid rgba(15,23,42,0.07)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            marginBottom: 20,
            flexWrap: "wrap",
          }}
        >
          <div>
            <Text
              style={{ display: "block", letterSpacing: 1.2, fontSize: 12 }}
            >
              COMPLIANCE
            </Text>
            <Title level={2} style={{ margin: 0 }}>
              Audit Reports
            </Title>
            <Text type="secondary">
              Track all administrative actions and system changes.
            </Text>
          </div>
          <Space>
            <Button
              icon={<ReloadOutlined />}
              loading={loading}
              onClick={fetchAuditLogs}
            >
              Refresh
            </Button>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search audit logs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              allowClear
            />
          </Space>
        </div>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredLogs}
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 900 }}
          locale={{ emptyText: "No audit records found." }}
        />
      </Card>
    </div>
  );
};

export default Audit;
