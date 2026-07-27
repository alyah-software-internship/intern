import React from "react";
import { useParams } from "react-router-dom";
import DetailInfo from "../../component/Detail/DetailInfo.jsx";
import { rentalItems } from "../../assets/dummyAssets";

const DetailPage = () => {
  const { id } = useParams();
  const item = rentalItems.find((r) => r.id === id);

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <a href="/rentals">&lt; Back to Rental Catalog</a>
      <div style={{ marginTop: 12 }}>
        <DetailInfo item={item} />
      </div>
    </div>
  );
};

export default DetailPage;
