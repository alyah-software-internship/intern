import { createContext, useState } from "react";

export const AppContext = createContext({
  isSignedIn: false,
});

export const AppContextProvider = (props) => {
  const [isSignedIn, setIsSignedIn] = useState(true); // Replace with actual authentication state
  const [lang, setLang] = useState("en");
  const currency = "ETB";

  const value = {
    currency,
    isSignedIn,
    lang,
    setLang,
    setIsSignedIn,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
