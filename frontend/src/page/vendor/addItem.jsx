import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  message,
  Typography,
  Space,
} from "antd";
import {
  ArrowLeftOutlined,
  UploadOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useTheme } from "../../context/ThemeProvider.jsx";
import { useTranslation } from "../../component/LanguageProvider.jsx";

const { Title, Text } = Typography;
const { TextArea } = Input;

const categories = [
  { label: "Construction", value: "construction" },
  { label: "Agriculture", value: "agriculture" },
  { label: "Event", value: "event" },
  { label: "Tools", value: "tools" },
];

const priceUnits = [
  { label: "Per Time", value: "time" },
  { label: "Per Day", value: "day" },
  { label: "Per Month", value: "month" },
  { label: "Per Year", value: "year" },
];

const AddItem = () => {
  const navigate = useNavigate();
  const { translation: t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const onFinish = (values) => {
    message.success(t.vendor?.productSaved || "Product saved successfully!");
    navigate("/vendor/products");
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <Card
      style={{
        borderRadius: 24,
        minHeight: "72vh",
        background: isDark ? "#0b1120" : "#ffffff",
        color: isDark ? "#f8fafc" : "#0f172a",
      }}
    >
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: 24, padding: 0 }}
      >
        {t.vendor?.dashboard || "Back"}
      </Button>

      <Title
        level={3}
        style={{ marginBottom: 8, color: isDark ? "#f8fafc" : "#0f172a" }}
      >
        {t.vendor?.addProductTitle || "Add Product"}
      </Title>
      <Text type="secondary">
        {t.vendor?.addProductFormDescription ||
          "List a new product so customers can discover and rent it."}
      </Text>

      <Form
        layout="vertical"
        style={{ marginTop: 24, maxWidth: 720 }}
        onFinish={onFinish}
      >
        <Form.Item
          name="nameEn"
          label={t.vendor?.productNameEnglish || "Product Name (English)"}
          rules={[
            {
              required: true,
              message: "Please enter a product name in English.",
            },
          ]}
        >
          <Input
            placeholder={
              t.vendor?.productNameEnglish || "Product Name (English)"
            }
          />
        </Form.Item>

        <Form.Item
          name="nameAm"
          label={t.vendor?.productNameAmharic || "Product Name (Amharic)"}
          rules={[
            {
              required: true,
              message: "Please enter a product name in Amharic.",
            },
          ]}
        >
          <Input
            placeholder={
              t.vendor?.productNameAmharic || "Product Name (Amharic)"
            }
          />
        </Form.Item>

        <Form.Item
          name="category"
          label={t.vendor?.productCategory || "Product Category"}
          rules={[{ required: true, message: "Please select a category." }]}
        >
          <Select options={categories} placeholder="Select category" />
        </Form.Item>

        <Form.Item
          name="descriptionEn"
          label={
            t.vendor?.productDescriptionEnglish ||
            "Product Description (English)"
          }
          rules={[
            {
              required: true,
              message: "Please enter a product description in English.",
            },
          ]}
        >
          <TextArea
            rows={5}
            placeholder={
              t.vendor?.productDescriptionEnglish ||
              "Product Description (English)"
            }
          />
        </Form.Item>

        <Form.Item
          name="descriptionAm"
          label={
            t.vendor?.productDescriptionAmharic ||
            "Product Description (Amharic)"
          }
          rules={[
            {
              required: true,
              message: "Please enter a product description in Amharic.",
            },
          ]}
        >
          <TextArea
            rows={5}
            placeholder={
              t.vendor?.productDescriptionAmharic ||
              "Product Description (Amharic)"
            }
          />
        </Form.Item>

        <Form.List name="prices" initialValue={[{ amount: null, unit: "day" }]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <Space
                  key={key}
                  style={{ display: "flex", marginBottom: 8 }}
                  align="baseline"
                >
                  <Form.Item
                    {...restField}
                    name={[name, "amount"]}
                    fieldKey={[fieldKey, "amount"]}
                    label={t.vendor?.priceAmount || "Price"}
                    rules={[{ required: true, message: "Enter a price." }]}
                  >
                    <InputNumber
                      style={{ width: 160 }}
                      min={0}
                      formatter={(value) => `${value}`}
                      parser={(value) => value?.replace(/\D/g, "")}
                      placeholder={t.vendor?.priceAmount || "Price"}
                    />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "unit"]}
                    fieldKey={[fieldKey, "unit"]}
                    label={t.vendor?.priceUnit || "Unit"}
                    rules={[{ required: true, message: "Select a unit." }]}
                  >
                    <Select
                      options={priceUnits}
                      placeholder={t.vendor?.priceUnit || "Unit"}
                      style={{ width: 180 }}
                    />
                  </Form.Item>

                  {fields.length > 1 ? (
                    <MinusCircleOutlined
                      onClick={() => remove(name)}
                      style={{ marginTop: 30, color: "#ff4d4f" }}
                    />
                  ) : null}
                </Space>
              ))}

              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                  style={{ borderRadius: 14 }}
                >
                  {t.vendor?.addPriceOption || "Add Price Option"}
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item
          name="quantity"
          label={t.vendor?.productQuantity || "Quantity Available"}
          rules={[{ required: true, message: "Please enter a quantity." }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={1}
            placeholder={t.vendor?.productQuantity || "Quantity Available"}
          />
        </Form.Item>

        <Form.Item
          name="images"
          label={t.vendor?.productImages || "Product Images"}
          valuePropName="fileList"
          getValueFromEvent={normFile}
          extra="Upload up to 4 images."
        >
          <Upload listType="picture" beforeUpload={() => false} maxCount={4}>
            <Button icon={<UploadOutlined />}>Upload Images</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ borderRadius: 14 }}>
            {t.vendor?.saveProduct || "Save Product"}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AddItem;
