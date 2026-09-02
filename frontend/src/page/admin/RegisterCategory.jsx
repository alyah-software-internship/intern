import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Card,
  Form,
  Input,
  Select,
  Space,
  Upload,
  Typography,
  message,
} from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { AppContext } from "../../context/AppContext.jsx";

const { Title, Text } = Typography;
const { Dragger } = Upload;

const authConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
});

const RegisterCategory = () => {
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const editing = Boolean(id);
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(editing);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (!editing) return;

    const loadCategory = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/categories/${id}`,
          authConfig(),
        );
        const category = response.data.category;
        form.setFieldsValue({
          name: category.name,
          slug: category.slug,
          description: category.description,
          status: category.is_active ? "active" : "inactive",
          image: category.image_url
            ? [
                {
                  uid: "existing-category-image",
                  name: "Current category image",
                  status: "done",
                  url: category.image_url,
                },
              ]
            : [],
        });
      } catch (error) {
        messageApi.error(
          error.response?.data?.message || "Unable to load category.",
        );
        navigate("/admin/categories");
      } finally {
        setLoading(false);
      }
    };

    loadCategory();
  }, [backendUrl, editing, form, id, messageApi, navigate]);

  const handleSubmit = async (values) => {
    setSaving(true);
    try {
      const payload = {
        name: values.name,
        slug: values.slug || values.name,
        description: values.description || undefined,
        is_active: values.status === "active" ? 1 : 0,
      };
      const imageFile = values.image?.[0]?.originFileObj;
      const requestData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined) requestData.append(key, value);
      });
      if (imageFile) requestData.append("image", imageFile);
      if (editing) {
        requestData.append("_method", "PUT");
        await axios.post(`${backendUrl}/admin/categories/${id}`, requestData, {
          ...authConfig(),
          headers: {
            ...authConfig().headers,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await axios.post(`${backendUrl}/admin/categories`, requestData, {
          ...authConfig(),
          headers: {
            ...authConfig().headers,
            "Content-Type": "multipart/form-data",
          },
        });
      }
      messageApi.success(
        editing
          ? "Category updated successfully."
          : "Category registered successfully.",
      );
      navigate("/admin/categories");
    } catch (error) {
      const errors = error.response?.data?.errors;
      const firstError = errors ? Object.values(errors).flat()[0] : null;
      messageApi.error(
        firstError ||
          error.response?.data?.message ||
          "Unable to register category.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-category-register">
      {contextHolder}
      <Space orientation="vertical" size={4}>
        <Title level={2}>
          {editing ? "Edit Category" : "Register Category"}
        </Title>
        <Text type="secondary">
          <span>Dashboard</span>{" "}
          <span className="admin-category-register__crumb">›</span>{" "}
          <span>Categories</span>{" "}
          <span className="admin-category-register__crumb">›</span>{" "}
          <Text type="warning">
            {editing ? "Edit Category" : "Register Category"}
          </Text>
        </Text>
      </Space>

      <Card
        className="admin-category-register__card"
        title="Category Information"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: "active" }}
          onFinish={handleSubmit}
          disabled={loading}
        >
          <Form.Item
            name="name"
            label="Category Name"
            extra="This will be the name of the category."
            rules={[
              { required: true, message: "Please enter a category name." },
            ]}
          >
            <Input placeholder="Enter category name" />
          </Form.Item>
          <Form.Item
            name="slug"
            label="Slug"
            extra="A unique URL-friendly version of the category name."
          >
            <Input placeholder="Enter slug (will be auto-generated if left blank)" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            extra="Provide a short description about this category."
          >
            <Input.TextArea rows={4} placeholder="Enter category description" />
          </Form.Item>
          <Form.Item
            name="image"
            label="Category Image"
            valuePropName="fileList"
            getValueFromEvent={(event) => event?.fileList || []}
            extra="PNG, JPG, JPEG up to 2 MB"
          >
            <Dragger
              beforeUpload={() => false}
              maxCount={1}
              accept=".png,.jpg,.jpeg"
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click to upload or drag and drop
              </p>
              <p className="ant-upload-hint">PNG, JPG, JPEG up to 2 MB</p>
            </Dragger>
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            extra="Active categories will be visible to users."
          >
            <Select
              options={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ]}
            />
          </Form.Item>
          <div className="admin-category-register__actions">
            <Button onClick={() => navigate("/admin/categories")}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={saving}>
              {editing ? "Save Changes" : "Register Category"}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterCategory;
