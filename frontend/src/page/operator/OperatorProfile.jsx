import { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Spin,
  Typography,
  Upload,
  message,
} from "antd";
import { FilePdfOutlined, UploadOutlined } from "@ant-design/icons";
import { AppContext } from "../../context/AppContext.jsx";
import { useTheme } from "../../context/ThemeProvider.jsx";

const { Title, Text } = Typography;

const authConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
});

const OperatorProfile = () => {
  const { backendUrl, user } = useContext(AppContext);
  const { theme } = useTheme();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const isDark = theme === "dark";
  const textColor = isDark ? "#f8fafc" : "#16251b";
  const mutedColor = isDark ? "#9db0c4" : "#617066";

  useEffect(() => {
    let mounted = true;
    axios
      .get(`${backendUrl}/user/profile`, authConfig())
      .then(({ data }) => {
        if (!mounted) return;
        const profile = data.user || {};
        form.setFieldsValue({
          first_name: profile.first_name,
          middle_name: profile.middle_name,
          last_name: profile.last_name,
          phone: profile.phone,
          professional_title: profile.professional_title,
          experience_years: profile.experience_years || 0,
          skills: profile.skills,
          professional_bio: profile.professional_bio,
        });
      })
      .catch(() =>
        messageApi.error("Unable to load your professional profile."),
      )
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [backendUrl, form, messageApi]);

  const submitProfile = async (values) => {
    if (!fileList[0]?.originFileObj) {
      messageApi.error("Please attach your CV before submitting your profile.");
      return;
    }

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null) formData.append(key, value);
    });
    if (fileList[0]?.originFileObj)
      formData.append("cv", fileList[0].originFileObj);

    try {
      setSaving(true);
      await axios.post(`${backendUrl}/user/profile`, formData, {
        ...authConfig(),
        headers: {
          ...authConfig().headers,
          "Content-Type": "multipart/form-data",
        },
      });
      messageApi.success("Professional profile submitted to vendors.");
      setFileList([]);
    } catch (error) {
      messageApi.error(
        error.response?.data?.message ||
          "Unable to save your professional profile.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="operator-profile-page">
      {contextHolder}
      <Card className="operator-profile-card">
        <Spin spinning={loading}>
          <div className="operator-profile-intro">
            <div>
              <Text className="operator-kicker">Professional profile</Text>
              <Title level={2} style={{ color: textColor }}>
                Introduce yourself to vendors
              </Title>
              <Text style={{ color: mutedColor }}>
                Add the experience and CV vendors need when considering you for
                work.
              </Text>
            </div>
            <div className="operator-profile-owner">
              {user?.email || "Operator account"}
            </div>
          </div>
          <Form
            form={form}
            layout="vertical"
            onFinish={submitProfile}
            className="operator-profile-form"
          >
            <div className="operator-profile-grid">
              <Form.Item
                label="First name"
                name="first_name"
                rules={[{ required: true, message: "Enter your first name" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item label="Middle name" name="middle_name">
                <Input />
              </Form.Item>
              <Form.Item
                label="Last name"
                name="last_name"
                rules={[{ required: true, message: "Enter your last name" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Phone"
                name="phone"
                rules={[{ required: true, message: "Enter your phone number" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Professional title"
                name="professional_title"
                rules={[
                  { required: true, message: "Add your professional title" },
                ]}
              >
                <Input placeholder="Heavy equipment operator" />
              </Form.Item>
              <Form.Item
                label="Years of experience"
                name="experience_years"
                rules={[{ required: true, message: "Add your experience" }]}
              >
                <InputNumber min={0} max={80} style={{ width: "100%" }} />
              </Form.Item>
            </div>
            <Form.Item
              label="Skills and certifications"
              name="skills"
              rules={[{ required: true, message: "List your key skills" }]}
            >
              <Input.TextArea
                rows={3}
                placeholder="Hydraulic systems, safety inspection, CAT 320 certification"
              />
            </Form.Item>
            <Form.Item
              label="Professional summary"
              name="professional_bio"
              rules={[
                {
                  required: true,
                  message: "Write a short professional summary",
                },
              ]}
            >
              <Input.TextArea
                rows={5}
                placeholder="Describe your experience, strengths, and the work you are available for."
              />
            </Form.Item>
            <Form.Item
              label="CV / resume"
              required
              extra="PDF, DOC, or DOCX. Maximum 5 MB."
            >
              <Upload
                accept=".pdf,.doc,.docx"
                maxCount={1}
                fileList={fileList}
                beforeUpload={() => false}
                onChange={({ fileList: nextFileList }) =>
                  setFileList(nextFileList)
                }
                onRemove={() => setFileList([])}
              >
                <Button icon={<UploadOutlined />}>Choose CV file</Button>
              </Upload>
              {fileList.length === 0 && (
                <Text style={{ color: mutedColor }}>
                  <FilePdfOutlined /> No new CV selected
                </Text>
              )}
            </Form.Item>
            <div className="operator-profile-actions">
              <Button type="primary" htmlType="submit" loading={saving}>
                Save professional profile
              </Button>
            </div>
          </Form>
        </Spin>
      </Card>
    </div>
  );
};

export default OperatorProfile;
