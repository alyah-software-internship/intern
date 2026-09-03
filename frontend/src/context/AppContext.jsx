import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AppContext = createContext({
  isSignedIn: false,
  user: null,
  currency: "USD",
});

export const AppContextProvider = (props) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("authUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [isSignedIn, setIsSignedIn] = useState(() =>
    Boolean(localStorage.getItem("authToken")),
  );
  const [lang, setLang] = useState("en");
  const [currency, setCurrency] = useState("USD");

  const backendUrl = (() => {
    const configuredUrl =
      import.meta.env.VITE_BACKEND_URL?.replace(/\/+$/, "") || "";

    if (!configuredUrl) return "";
    return /\/api$/i.test(configuredUrl)
      ? configuredUrl
      : `${configuredUrl}/api`;
  })();

  useEffect(() => {
    const loadPlatformCurrency = async () => {
      if (!backendUrl) return;

      const token = localStorage.getItem("authToken");
      const activeUser = localStorage.getItem("authUser");
      const userRole = activeUser ? JSON.parse(activeUser)?.role : user?.role;

      if (!token || !userRole || userRole !== "admin") {
        setCurrency("USD");
        return;
      }

      try {
        const response = await axios.get(
          `${backendUrl}/admin/platform-settings`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const nextCurrency = response.data?.settings?.currency || "USD";
        setCurrency(nextCurrency);
      } catch (error) {
        console.warn("Unable to load platform currency:", error);
        setCurrency("USD");
      }
    };

    loadPlatformCurrency();
  }, [backendUrl, user]);

  const signIn = (authUser, token) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("authUser", JSON.stringify(authUser));
    setUser(authUser);
    setIsSignedIn(true);
  };

  const signOut = async () => {
    const token = localStorage.getItem("authToken");

    if (backendUrl && token) {
      try {
        await axios.post(
          `${backendUrl}/logout`,
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        );
      } catch (error) {
        console.warn(
          "Logout request failed, clearing local session anyway:",
          error,
        );
      }
    }

    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    setUser(null);
    setIsSignedIn(false);
  };

  const value = {
    backendUrl,
    currency,
    isSignedIn,
    user,
    lang,
    setLang,
    setIsSignedIn,
    signIn,
    signOut,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
