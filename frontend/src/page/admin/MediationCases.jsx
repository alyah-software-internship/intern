import { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Card,
  Input,
  Space,
  Table,
  Tag,
  Typography,
  Button,
  Modal,
  Form,
  message,
  Badge,
} from "antd";
import {
  ReloadOutlined,
  SearchOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { AppContext } from "../../context/AppContext.jsx";
import { useTheme } from "../../context/ThemeProvider.jsx";

const { Title, Text } = Typography;
const authConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
});

const MediationCases = () => {
  const { backendUrl } = useContext(AppContext);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [cases, setCases] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedCase, setSelectedCase] = useState(null);
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [resolvingId, setResolvingId] = useState(null);
  const [form] = Form.useForm();

  const fetchCases = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${backendUrl}/admin/mediation-cases?per_page=100`,
        authConfig(),
      );
      const data = response.data?.cases?.data || response.data?.cases || [];
      setCases(Array.isArray(data) ? data : []);
    } catch (error) {
      messageApi.error(
        error.response?.data?.message || "Unable to load mediation cases.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, [backendUrl]);

  const filteredCases = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return cases;

    return cases.filter((caseItem) => {
      const complainant = caseItem.complainant || {};
      const respondent = caseItem.respondent || {};
      const complainantName =
        `${complainant.first_name || ""} ${complainant.last_name || ""}`.trim();
      const respondentName =
        `${respondent.first_name || ""} ${respondent.last_name || ""}`.trim();

      return (
        caseItem.title?.toLowerCase().includes(term) ||
        complainantName.toLowerCase().includes(term) ||
        complainant.email?.toLowerCase().includes(term) ||
        respondentName.toLowerCase().includes(term) ||
        respondent.email?.toLowerCase().includes(term) ||
        caseItem.status?.toLowerCase().includes(term) ||
        caseItem.reason?.toLowerCase().includes(term)
      );
    });
  }, [cases, search]);

  const openDetails = (caseItem) => {
    setSelectedCase(caseItem);
  };

  const handleResolve = async (values) => {
    try {
      setLoading(true);
      await axios.post(
        `${backendUrl}/admin/mediation-cases/${resolvingId}/resolve`,
        {
          resolution_notes: values.resolution_notes,
          admin_notes: values.admin_notes || "",
        },
        authConfig(),
      );

      messageApi.success("Case resolved successfully");
      setResolveModalOpen(false);
      form.resetFields();
      setResolvingId(null);
      fetchCases();
    } catch (error) {
      messageApi.error(
        error.response?.data?.message || "Failed to resolve case",
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const map = {
      open: "red",
      in_progress: "orange",
      resolved: "green",
      closed: "blue",
      rejected: "magenta",
    };
    return map[status] || "default";
  };

  const getReasonColor = (reason) => {
    const map = {
      damage: "red",
      non_return: "orange",
      quality_issue: "blue",
      payment_dispute: "gold",
      other: "default",
    };
    return map[reason] || "default";
  };

  const columns = [
    {
      title: "CASE ID",
      key: "id",
      render: (_, caseItem) => (
        <Button type="link" onClick={() => openDetails(caseItem)}>
          #{caseItem.id}
        </Button>
      ),
    },
    {
      title: "TITLE",
      dataIndex: "title",
      key: "title",
      render: (title) => <Text strong>{title}</Text>,
    },
    {
      title: "COMPLAINANT",
      key: "complainant",
      render: (_, caseItem) => {
        const complainant = caseItem.complainant || {};
        return (
          <Text>
            {`${complainant.first_name || ""} ${complainant.last_name || ""}`.trim() ||
              complainant.email ||
              "-"}
          </Text>
        );
      },
    },
    {
      title: "RESPONDENT",
      key: "respondent",
      render: (_, caseItem) => {
        const respondent = caseItem.respondent || {};
        return (
          <Text>
            {`${respondent.first_name || ""} ${respondent.last_name || ""}`.trim() ||
              respondent.email ||
              "-"}
          </Text>
        );
      },
    },
    {
      title: "REASON",
      dataIndex: "reason",
      key: "reason",
      render: (reason) => (
        <Tag color={getReasonColor(reason)}>
          {(reason || "other").toUpperCase().replace("_", " ")}
        </Tag>
      ),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {(status || "open").toUpperCase().replace("_", " ")}
        </Tag>
      ),
    },
    {
      title: "ACTION",
      key: "action",
      render: (_, caseItem) =>
        caseItem.status !== "resolved" && caseItem.status !== "closed" ? (
          <Button
            type="primary"
            size="small"
            icon={<CheckCircleOutlined />}
            onClick={() => {
              setResolvingId(caseItem.id);
              setResolveModalOpen(true);
            }}
          >
            Resolve
          </Button>
        ) : (
          <Text type="secondary">-</Text>
        ),
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
              MEDIATION MANAGEMENT
            </Text>
            <Title level={2} style={{ margin: 0 }}>
              Dispute Resolution Cases
            </Title>
            <Text type="secondary">
              Review and resolve customer and vendor disputes.
            </Text>
          </div>

          <Space>
            <Badge
              count={cases.filter((c) => c.status === "open").length}
              color="#f97316"
            >
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchCases}
                loading={loading}
              >
                Refresh
              </Button>
            </Badge>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search cases"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              allowClear
            />
          </Space>
        </div>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredCases}
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1200 }}
          locale={{ emptyText: "No mediation cases found." }}
        />
      </Card>

      {selectedCase && (
        <Modal
          title={`Case #${selectedCase.id}: ${selectedCase.title}`}
          open={!!selectedCase}
          onCancel={() => setSelectedCase(null)}
          width={800}
          footer={null}
        >
          <div style={{ display: "grid", gap: 16 }}>
            <div>
              <Text strong>Status:</Text>
              <Tag
                color={getStatusColor(selectedCase.status)}
                style={{ marginLeft: 8 }}
              >
                {(selectedCase.status || "open")
                  .toUpperCase()
                  .replace("_", " ")}
              </Tag>
            </div>
            <div>
              <Text strong>Reason:</Text>
              <Tag
                color={getReasonColor(selectedCase.reason)}
                style={{ marginLeft: 8 }}
              >
                {(selectedCase.reason || "other")
                  .toUpperCase()
                  .replace("_", " ")}
              </Tag>
            </div>
            <div>
              <Text strong>Description:</Text>
              <div
                style={{
                  marginTop: 8,
                  padding: 12,
                  background: isDark ? "#0b1726" : "#f0f4f8",
                  borderRadius: 8,
                }}
              >
                <Text>{selectedCase.description}</Text>
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              <div>
                <Text strong>Complainant:</Text>
                <div style={{ marginTop: 4 }}>
                  <Text>
                    {`${selectedCase.complainant?.first_name || ""} ${selectedCase.complainant?.last_name || ""}`.trim()}
                  </Text>
                  <div>
                    <Text type="secondary">
                      {selectedCase.complainant?.email}
                    </Text>
                  </div>
                </div>
              </div>
              <div>
                <Text strong>Respondent:</Text>
                <div style={{ marginTop: 4 }}>
                  <Text>
                    {`${selectedCase.respondent?.first_name || ""} ${selectedCase.respondent?.last_name || ""}`.trim()}
                  </Text>
                  <div>
                    <Text type="secondary">
                      {selectedCase.respondent?.email}
                    </Text>
                  </div>
                </div>
              </div>
            </div>
            {selectedCase.resolution_notes && (
              <div>
                <Text strong>Resolution Notes:</Text>
                <div
                  style={{
                    marginTop: 8,
                    padding: 12,
                    background: isDark ? "#0b1726" : "#f0f4f8",
                    borderRadius: 8,
                  }}
                >
                  <Text>{selectedCase.resolution_notes}</Text>
                </div>
              </div>
            )}
            {selectedCase.status !== "resolved" &&
              selectedCase.status !== "closed" && (
                <Button
                  type="primary"
                  onClick={() => {
                    setSelectedCase(null);
                    setResolvingId(selectedCase.id);
                    setResolveModalOpen(true);
                  }}
                >
                  Resolve This Case
                </Button>
              )}
          </div>
        </Modal>
      )}

      <Modal
        title="Resolve Dispute Case"
        open={resolveModalOpen}
        onCancel={() => {
          setResolveModalOpen(false);
          setResolvingId(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText="Resolve"
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical" onFinish={handleResolve}>
          <Form.Item
            label="Resolution Notes"
            name="resolution_notes"
            rules={[
              { required: true, message: "Please enter resolution notes" },
            ]}
          >
            <textarea
              rows={6}
              placeholder="Enter your resolution decision and reasoning..."
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 6,
                border: `1px solid ${isDark ? "#1e293b" : "#cbd5e1"}`,
                background: isDark ? "#0f172a" : "#fff",
                color: isDark ? "#f8fafc" : "#0f172a",
              }}
            />
          </Form.Item>
          <Form.Item label="Admin Notes (Optional)" name="admin_notes">
            <textarea
              rows={3}
              placeholder="Internal notes for record..."
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 6,
                border: `1px solid ${isDark ? "#1e293b" : "#cbd5e1"}`,
                background: isDark ? "#0f172a" : "#fff",
                color: isDark ? "#f8fafc" : "#0f172a",
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MediationCases;
