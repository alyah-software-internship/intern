import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Segmented,
  Switch,
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
import { AppContext } from "../../context/AppContext.jsx";

const { Title, Text } = Typography;
const { TextArea } = Input;

const priceUnits = [
  { label: "Per Time", value: "time" },
  { label: "Per Day", value: "day" },
  { label: "Per Month", value: "month" },
  { label: "Per Year", value: "year" },
];

const AddItem = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const { translation: t } = useTranslation();
  const { backendUrl } = useContext(AppContext);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(Boolean(editId));
  const [inputLanguage, setInputLanguage] = useState("en");
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await axios.get(`${backendUrl}/categories`);
        setCategories(
          (response.data.categories || []).map((category) => ({
            label: category.name,
            value: category.id,
          })),
        );
      } catch (error) {
        messageApi.error(
          error.response?.data?.message || "Unable to load categories.",
        );
      }
    };

    loadCategories();
  }, [backendUrl, messageApi]);

  const [form] = Form.useForm();
  const deliveryAvailable = Form.useWatch("deliveryAvailable", form);

  useEffect(() => {
    if (!editId) {
      return;
    }

    axios
      .get(`${backendUrl}/vendor/products/${editId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      .then((response) => {
        const product = response.data.product;

        if (!product) {
          throw new Error("Product not found.");
        }

        const unit = product.price_hourly
          ? "time"
          : product.price_monthly
            ? "month"
            : "day";
        const amount = Number(
          product.price_hourly ||
            product.price_monthly ||
            product.price_daily ||
            0,
        );
        const availabilityStatus = product.availability_status || "available";

        form.setFieldsValue({
          nameEn: product.name,
          nameAm: product.name_am,
          category: product.category_id,
          descriptionEn: product.description,
          descriptionAm: product.description_am,
          prices: [{ amount, unit }],
          quantity: product.quantity,
          securityDeposit: product.security_deposit_amount || 0,
          deliveryAvailable: product.delivery_available ?? false,
          deliveryFee: product.rental_policies?.delivery_fee || 0,
          lateFee: product.rental_policies?.late_fee || 0,
          lateFeeUnit: product.rental_policies?.late_fee_unit || "hour",
          cancellationPolicy:
            product.rental_policies?.cancellation_policy || "flexible",
          cancellationFee: product.rental_policies?.cancellation_fee || 0,
          availabilityStatus,
        });
      })
      .catch((error) => {
        messageApi.error(error.message || "Unable to load product.");
        navigate("/vendor/products");
      })
      .finally(() => setLoadingProduct(false));
  }, [backendUrl, editId, form, messageApi, navigate]);

  const onFinish = async (values) => {
    const price = values.prices?.[0];
    const pricingModel =
      { time: "hourly", day: "daily", month: "monthly", year: "monthly" }[
        price?.unit
      ] || "daily";

    setLoading(true);

    try {
      const payload = {
        name: values.nameEn,
        name_am: values.nameAm,
        category_id: values.category,
        description: values.descriptionEn,
        description_am: values.descriptionAm,
        pricing_model: pricingModel,
        price_daily: pricingModel === "daily" ? price.amount : 0,
        price_hourly: pricingModel === "hourly" ? price.amount : 0,
        price_monthly: pricingModel === "monthly" ? price.amount : 0,
        quantity: values.quantity,
        security_deposit_amount: values.securityDeposit || 0,
        delivery_available: values.deliveryAvailable || false,
        rental_policies: {
          delivery_fee: values.deliveryAvailable ? values.deliveryFee || 0 : 0,
          late_fee: values.lateFee || 0,
          late_fee_unit: values.lateFeeUnit || "hour",
          cancellation_policy: values.cancellationPolicy || "flexible",
          cancellation_fee: values.cancellationFee || 0,
        },
        availability_status: values.availabilityStatus || "available",
      };

      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        const formValue =
          key === "delivery_available" ? (value ? "1" : "0") : value;
        formData.append(
          key,
          typeof formValue === "object" ? JSON.stringify(formValue) : formValue,
        );
      });
      values.images?.forEach((file) => {
        if (file.originFileObj) formData.append("images[]", file.originFileObj);
      });

      const response = editId
        ? await axios.put(`${backendUrl}/vendor/products/${editId}`, payload, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          })
        : await axios.post(`${backendUrl}/vendor/products`, formData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          });

      messageApi.success(
        response.data.message ||
          t.vendor?.productSaved ||
          "Product saved successfully!",
      );
      navigate("/vendor/products");
    } catch (error) {
      const validationErrors = error.response?.data?.errors;
      const firstValidationError = validationErrors
        ? Object.values(validationErrors).flat()[0]
        : null;
      messageApi.error(
        firstValidationError ||
          error.response?.data?.message ||
          "Unable to save product. Please try again.",
      );
      if (
        error.response?.status === 403 &&
        error.response?.data?.message?.includes("subscription")
      ) {
        navigate("/vendor/subscription");
      }
    } finally {
      setLoading(false);
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <>
      {contextHolder}
      <Card
        className="shared-surface vendor-add-item-page"
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
          {editId ? "Edit Product" : t.vendor?.addProductTitle || "Add Product"}
        </Title>
        <Text type="secondary">
          {t.vendor?.addProductFormDescription ||
            "List a new product so customers can discover and rent it."}
        </Text>

        <Form
          form={form}
          layout="vertical"
          className="shared-form"
          style={{ marginTop: 24, maxWidth: 720 }}
          onFinish={onFinish}
          disabled={loadingProduct}
        >
          <Form.Item label="Input Language">
            <Segmented
              block
              options={[
                { label: "English", value: "en" },
                { label: "አማርኛ", value: "am" },
              ]}
              value={inputLanguage}
              onChange={setInputLanguage}
            />
          </Form.Item>

          {inputLanguage === "en" ? (
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
              <Input placeholder="Product Name (English)" />
            </Form.Item>
          ) : (
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
              <Input placeholder="የምርት ስም" />
            </Form.Item>
          )}

          <Form.Item
            name="category"
            label={t.vendor?.productCategory || "Product Category"}
            rules={[{ required: true, message: "Please select a category." }]}
          >
            <Select options={categories} placeholder="Select category" />
          </Form.Item>

          {inputLanguage === "en" ? (
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
              <TextArea rows={5} placeholder="Product Description (English)" />
            </Form.Item>
          ) : (
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
              <TextArea rows={5} placeholder="የምርት መግለጫ" />
            </Form.Item>
          )}

          <Form.List
            name="prices"
            initialValue={[{ amount: null, unit: "day" }]}
          >
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
            name="securityDeposit"
            label="Refundable Deposit"
            rules={[
              {
                required: true,
                message: "Please enter the refundable deposit.",
              },
            ]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              placeholder="Refundable deposit amount"
            />
          </Form.Item>

          <Card
            size="small"
            title="Rental Policies"
            style={{ marginBottom: 24 }}
          >
            <Form.Item
              name="deliveryAvailable"
              label="Delivery Available"
              valuePropName="checked"
              initialValue={false}
            >
              <Switch
                checkedChildren="Yes"
                unCheckedChildren="No"
                onChange={(checked) => {
                  if (!checked) {
                    form.setFieldValue("deliveryFee", 0);
                  }
                }}
              />
            </Form.Item>

            <Form.Item
              name="deliveryFee"
              label="Delivery Fee"
              rules={[
                {
                  required: deliveryAvailable,
                  message: "Please enter the delivery fee.",
                },
                {
                  type: "number",
                  min: 0,
                  message: "Enter a valid delivery fee.",
                },
              ]}
            >
              <InputNumber
                min={0}
                disabled={!deliveryAvailable}
                style={{ width: "100%" }}
                placeholder={deliveryAvailable ? "0" : "Delivery unavailable"}
              />
            </Form.Item>

            <Space style={{ display: "flex" }} align="start">
              <Form.Item
                name="lateFee"
                label="Late Fee"
                rules={[
                  {
                    type: "number",
                    min: 0,
                    message: "Enter a valid late fee.",
                  },
                ]}
                style={{ flex: 1 }}
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  placeholder="0"
                />
              </Form.Item>
              <Form.Item
                name="lateFeeUnit"
                label="Charged Per"
                initialValue="hour"
              >
                <Select
                  style={{ width: 140 }}
                  options={[
                    { label: "Hour", value: "hour" },
                    { label: "Day", value: "day" },
                  ]}
                />
              </Form.Item>
            </Space>

            <Form.Item
              name="cancellationPolicy"
              label="Cancellation Policy"
              initialValue="flexible"
            >
              <Select
                options={[
                  { label: "Flexible", value: "flexible" },
                  { label: "Moderate", value: "moderate" },
                  { label: "Strict", value: "strict" },
                  { label: "Non-refundable", value: "non_refundable" },
                ]}
              />
            </Form.Item>

            <Form.Item
              name="cancellationFee"
              label="Cancellation Fee"
              rules={[
                {
                  type: "number",
                  min: 0,
                  max: 100,
                  message: "Enter a percentage from 0 to 100.",
                },
              ]}
              extra="Percentage charged when a cancellation is not free."
            >
              <InputNumber
                min={0}
                max={100}
                addonAfter="%"
                style={{ width: "100%" }}
                placeholder="0"
              />
            </Form.Item>
          </Card>

          <Form.Item
            name="availabilityStatus"
            label="Calendar State"
            initialValue="available"
            rules={[
              { required: true, message: "Please select the calendar state." },
            ]}
          >
            <Select
              options={[
                { label: "Available", value: "available" },
                { label: "Unavailable", value: "unavailable" },
                { label: "Booked", value: "booked" },
                { label: "Maintenance", value: "maintenance" },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="images"
            label={t.vendor?.productImages || "Product Images"}
            valuePropName="fileList"
            getValueFromEvent={normFile}
            extra="Upload up to 4 images."
          >
            <Upload
              listType="picture"
              beforeUpload={() => false}
              multiple
              maxCount={4}
            >
              <Button icon={<UploadOutlined />}>Upload Images</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ borderRadius: 14 }}
            >
              {editId
                ? "Update Product"
                : t.vendor?.saveProduct || "Save Product"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};

export default AddItem;
