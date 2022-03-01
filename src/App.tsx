import { Preview } from "@mui/icons-material";
import { Box, TextField } from "@mui/material";
import * as React from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
export const App:React.FC =()=> {

  const [authorized, setAuthorized] = React.useState(false)
  return (
    <div className="App">
      <h1>Urgent Care Landscaping</h1>
      <Routes>
        {authorized ? 
          (<><Route path="/" element={<Home />} /><Route path="about" element={<About />} /></>)
        :
        <>
          <Route path="/" element={<Homey />} />
        </> 
        }
      </Routes>
    </div>
  );
}

// App.js
function Homey() {
  const [loginForm, setLoginForm]= React.useState({
    username: "",
    password: ""
  })
   return (
    <>
      <Box>
        <TextField onChange={(e)=>setLoginForm(prev => {return {...prev, username: e.target.value }} )} placeholder={'username'} />
        <TextField type="password"
          autoComplete="current-password" onChange={(e)=>setLoginForm(prev => {return {...prev, password: e.target.value }} )} placeholder={'password'} />
      </Box>
    </>
  );
}
function Home() {
  return (
    <>
      <main>
        <h2>Welcome to the homepage!</h2>
        <p>You can do this, I believe in you.</p>
      </main>
      <nav>
        <Link to="/about">About</Link>
      </nav>
    </>
  );
}

function About() {
  return (
    <>
      <main>
        <h2>Who are we?</h2>
        <p>
          That feels like an existential question, don't you
          think?
        </p>
      </main>
      <nav>
        <Link to="/">Home</Link>
      </nav>
    </>
  );
}
