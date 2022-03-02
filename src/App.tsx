import * as React from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Login from './components/login/login';
import Home from "./components/home/home";
import Customers from "./components/customers/customers";
import Employees from "./components/employees/employees";

export const App:React.FC =()=> {
  const [authorized, setAuthorized] = React.useState(false)
  
  return (
    <div className="App">
      <h1>Urgent Care Landscaping</h1>
      <Routes>
        {authorized ? 
          (<>
            <Route path="/" element={<Home />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/employees" element={<Employees />} />
          </>)
        :
        <>
          <Route path="/" element={<Login setAuth={setAuthorized}/>} />
        </> 
        }
      </Routes>
    </div>
  );
}



