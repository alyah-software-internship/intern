import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, Input, Space, Table, Tag, Typography } from "antd";
import {
  approveQueueEntry,
  getReviewQueue,
  updateQueueDraft,
} from "../../translation/reviewQueue.js";

const { Title, Text } = Typography;

const TranslationReviewPage = () => {
  const [queue, setQueue] = useState(() => getReviewQueue());
  const [drafts, setDrafts] = useState({});

  useEffect(() => {
    setQueue(getReviewQueue());
  }, []);

  const rows = useMemo(() => {
    return queue.map((entry) => ({
      ...entry,
      draft:
        drafts[entry.id] ?? entry.approvedValue ?? entry.suggestedValue ?? "",
    }));
  }, [queue, drafts]);

  const handleDraftChange = (id, value) => {
    setDrafts((prev) => ({
      ...prev,
      [id]: value,
    }));

    const updatedQueue = updateQueueDraft(id, value);
    setQueue(updatedQueue);
  };

  const handleApprove = (id) => {
    const nextQueue = approveQueueEntry(id, drafts[id]);
    setQueue(nextQueue);
  };

  const columns = [
    {
      title: "Translation key",
      dataIndex: "key",
      key: "key",
      width: 220,
    },
    {
      title: "English source",
      dataIndex: "sourceValue",
      key: "sourceValue",
      width: 280,
      render: (value) => <Text>{value}</Text>,
    },
    {
      title: "Suggested Amharic",
      dataIndex: "suggestedValue",
      key: "suggestedValue",
      width: 260,
      render: (value) => <Text>{value || "—"}</Text>,
    },
    {
      title: "Admin correction",
      dataIndex: "draft",
      key: "draft",
      width: 300,
      render: (value, record) => (
        <Input
          value={value}
          onChange={(event) => handleDraftChange(record.id, event.target.value)}
          placeholder="Approve or refine the generated translation"
        />
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (status) => (
        <Tag color={status === "approved" ? "green" : "gold"}>{status}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 120,
      render: (_, record) => (
        <Button type="primary" onClick={() => handleApprove(record.id)}>
          Approve
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 32, minHeight: "100vh" }}>
      <Card style={{ maxWidth: 1400, margin: "0 auto" }}>
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
          <Title level={3}>Translation review queue</Title>
          <Text type="secondary">
            Auto-generated text is suggested from the English source and is
            reviewed here before it is approved for the app.
          </Text>
          <Table
            columns={columns}
            dataSource={rows}
            rowKey="id"
            pagination={{ pageSize: 8 }}
            scroll={{ x: 1200 }}
          />
        </Space>
      </Card>
    </div>
  );
};

export default TranslationReviewPage;
