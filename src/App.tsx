import * as React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./components/unAuthLanding/login/login";
import Home from "./components/home/home";
import Employees from "./components/employees/employees";
import { fetchCustomers } from "./services/api";
import { company, customer } from "./types/dataTypes";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AuthProvider } from "./services/authContext";
import Landing from "./components/unAuthLanding/landing";
import { SignUpForm } from "./components/unAuthLanding/signup/signup";
import ThemeProvider from "@mui/styles/ThemeProvider";
import { theme } from "./theme";

export const App: React.FC = () => {
  const [authorized, setAuthorized] = React.useState("");
  const [customers, setCustomers] = React.useState<customer[]>();
  const [company, setCompany] = React.useState<company>();

  React.useEffect(() => {
    const loggedInToken = localStorage.getItem("token");
    const loggedInUser = localStorage.getItem("user");
    if (loggedInToken && loggedInUser) {
      setAuthorized(loggedInToken);
      setCompany(JSON.parse(loggedInUser));
    }
    if (authorized) {
      (async () => {
        setCustomers(await fetchCustomers(authorized));
      })();
    }
  }, [authorized]);

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <ThemeProvider theme={theme}>
        <AuthProvider
          token={authorized}
          setToken={setAuthorized}
          setCompany={setCompany}
        >
          <div className="App">
            <h1>{`${
              company?.company_name || "Welcome to Service Scheduler"
            }`}</h1>
            <Routes>
              {!!authorized ? (
                <>
                  <Route
                    path="/"
                    element={<Home customers={customers as customer[]} />}
                  />
                  <Route path="/employees" element={<Employees />} />
                </>
              ) : (
                <>
                  <Route path="/" element={<Landing />} />
                  <Route path="/sign-up" element={<SignUpForm />} />
                  <Route
                    path="/login"
                    element={
                      <Login setCompany={setCompany} setAuth={setAuthorized} />
                    }
                  />
                </>
              )}
            </Routes>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </LocalizationProvider>
  );
};
