import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Alert, Spin, Typography } from "antd";
import { Link, useParams } from "react-router-dom";
import DetailInfo from "../../component/detail/DetailInfo";
import { AppContext } from "../../context/AppContext.jsx";

const { Text } = Typography;

const normalizeProduct = (product) => {
  const specs =
    product.specifications && typeof product.specifications === "object"
      ? Object.entries(product.specifications).map(([label, value]) => ({
          label,
          value: String(value),
        }))
      : [];
  return {
    id: product.id,
    title: product.name,
    category: product.category?.name || "Uncategorized",
    available: product.availability_status === "available",
    images: (product.images || []).map((image) => image.image_url),
    image: product.images?.[0]?.image_url || "/logo.png",
    description: product.description || "No description available.",
    longDescription: product.description,
    specs,
    price: Number(product.price_daily || 0),
    deposit: Number(product.security_deposit_amount || 0),
    vendor: product.vendor?.business_name || "Unknown vendor",
    vendorInfo: product.vendor
      ? {
          name: product.vendor.business_name,
          rating: product.vendor.rating || 0,
          onTimePercent: "",
        }
      : null,
  };
};

const DetailPage = () => {
  const { id } = useParams();
  const { backendUrl } = useContext(AppContext);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(`${backendUrl}/products/${id}`);
        setItem(normalizeProduct(response.data.product));
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Unable to load rental details.",
        );
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [backendUrl, id]);

  return (
    <div className="detail-page-shell">
      <Link to="/rentals">&lt; Back to Rental Catalog</Link>
      <div style={{ marginTop: 18 }}>
        {loading && (
          <div
            style={{ minHeight: 320, display: "grid", placeItems: "center" }}
          >
            <Spin size="large" />
          </div>
        )}
        {!loading && error && <Alert type="error" message={error} showIcon />}
        {!loading && !error && item && <DetailInfo item={item} />}
        {!loading && !error && !item && <Text>Rental not found.</Text>}
      </div>
    </div>
  );
};

export default DetailPage;
