import { createContext, useState } from "react";
import axios from "axios";

export const AppContext = createContext({
  isSignedIn: false,
  user: null,
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
  const currency = "ETB";

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL?.replace(/\/+$/, "") || "";

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
