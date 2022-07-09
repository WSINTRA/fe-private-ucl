import { createContext } from "react";

export const AuthContext = createContext({
  token: "",
  setToken: (token: string) => {},
});

export const AuthProvider = ({ children, token, setToken }: any) => {
  return (
    <AuthContext.Provider value={{ token: token, setToken: setToken }}>
      {children}
    </AuthContext.Provider>
  );
};
