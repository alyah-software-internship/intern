import React from "react";
import Wishlist from "../../component/home/Wishlist.jsx";
import { useTheme } from "../../context/ThemeProvider.jsx";

const WishlistPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 24,
        background: isDark ? "#050b16" : "#f4f7ff",
      }}
    >
      <Wishlist />
    </div>
  );
};

export default WishlistPage;
