import * as React from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Login from './components/login/login';
import Home from "./components/home/home";
import Employees from "./components/employees/employees";
import { fetchCustomers } from "./services/api";
import { customer } from "./types/dataTypes";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AuthProvider } from "./services/authContext";

export const App: React.FC = () => {
  const [authorized, setAuthorized] = React.useState("")
  const [customers, setCustomers] = React.useState<customer[]>()

  React.useEffect(() => {
    if (authorized) {
      (async () => {
        setCustomers(await fetchCustomers(authorized))
      })()
    }
  }, [authorized])
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <AuthProvider token={authorized}>
        <div className="App">
          <h1>Urgent Care Landscaping</h1>
          <Routes>
            {!!authorized ?
              (<>
                <Route path="/" element={<Home customers={customers as customer[]} />} />
                <Route path="/employees" element={<Employees />} />
              </>)
              :
              <>
                <Route path="/" element={<Login setAuth={setAuthorized} />} />
              </>
            }
          </Routes>
        </div>
      </AuthProvider>
    </LocalizationProvider>
  );
}



