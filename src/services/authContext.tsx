import { createContext } from "react";
import { company } from "../types/dataTypes";

export const AuthContext = createContext({
  token: "",
  setToken: (token: string) => {},
  setCompany: (company: company | undefined) => {},
});

export const AuthProvider = ({
  children,
  token,
  setToken,
  setCompany,
}: any) => {
  return (
    <AuthContext.Provider
      value={{ token: token, setToken: setToken, setCompany: setCompany }}
    >
      {children}
    </AuthContext.Provider>
  );
};
