import { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Image,
  Popconfirm,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { AppContext } from "../../context/AppContext.jsx";

const { Title, Text } = Typography;

const authConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
});

const Category = () => {
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (loadError) {
      messageApi.error(loadError);
    }
  }, [loadError, messageApi]);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const response = await axios.get(
        `${backendUrl}/categories`,
        authConfig(),
      );
      setCategories(response.data.categories || []);
    } catch (error) {
      setLoadError(
        error.response?.data?.message || "Unable to load categories.",
      );
    } finally {
      setLoading(false);
    }
  }, [backendUrl, messageApi]);

  useEffect(() => {
    const fetchCategories = async () => {
      await loadCategories();
    };
    fetchCategories();
  }, [loadCategories]);

  const deleteCategory = async (category) => {
    try {
      await axios.delete(
        `${backendUrl}/admin/categories/${category.id}`,
        authConfig(),
      );
      messageApi.success("Category deleted successfully.");
      await loadCategories();
    } catch (error) {
      messageApi.error(
        error.response?.data?.message || "Unable to delete category.",
      );
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image_url",
      key: "image_url",
      width: 84,
      render: (imageUrl, category) =>
        imageUrl ? (
          <Image
            width={52}
            height={52}
            src={imageUrl}
            alt={`${category.name} category`}
            preview
            style={{ objectFit: "cover", borderRadius: 8 }}
          />
        ) : (
          <div className="admin-category-image-placeholder">No image</div>
        ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name, category) => (
        <Space direction="vertical" size={0}>
          <Text strong>{name}</Text>
          <Text type="secondary">/{category.slug}</Text>
        </Space>
      ),
    },
    {
      title: "Products",
      dataIndex: "products_count",
      key: "products_count",
      render: (count) => count ?? 0,
    },
    {
      title: "Order",
      dataIndex: "sort_order",
      key: "sort_order",
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (isActive) => (
        <Tag color={isActive ? "green" : "default"}>
          {isActive ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, category) => (
        <Space size={0}>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/categories/${category.id}/edit`)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete this category?"
            description="Categories with products or sub-categories cannot be deleted."
            okText="Delete"
            okButtonProps={{ danger: true }}
            onConfirm={() => deleteCategory(category)}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      {contextHolder}
      <Card>
        <Space
          align="start"
          style={{ width: "100%", justifyContent: "space-between" }}
        >
          <div>
            <Title level={3} style={{ marginTop: 0, marginBottom: 4 }}>
              Categories
            </Title>
            <Text type="secondary">
              Manage the categories available to customers and vendors.
            </Text>
          </div>
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={loadCategories}
              loading={loading}
            >
              Refresh
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("/admin/categories/new")}
            >
              Add Category
            </Button>
          </Space>
        </Space>
        <Table
          rowKey="id"
          style={{ marginTop: 24 }}
          loading={loading}
          columns={columns}
          dataSource={categories}
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: "No categories found." }}
        />
      </Card>
    </div>
  );
};

export default Category;
