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

export const App: React.FC = () => {
  const [authorized, setAuthorized] = React.useState("");
  const [customers, setCustomers] = React.useState<customer[]>();
  const [company, setCompany] = React.useState<company>();

  React.useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      setAuthorized(loggedInUser);
    }
    if (authorized) {
      (async () => {
        setCustomers(await fetchCustomers(authorized));
        localStorage.setItem("user", authorized);
      })();
    }
  }, [authorized]);

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <AuthProvider token={authorized} setToken={setAuthorized}>
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
    </LocalizationProvider>
  );
};
