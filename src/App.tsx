import { Box, Button, IconButton, TextField } from "@mui/material";
import moment from "moment";
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
          <Route path="/" element={<Homey setAuth={setAuthorized}/>} />
        </> 
        }
      </Routes>
    </div>
  );
}

// App.js
const Homey=(props: {setAuth:React.Dispatch<React.SetStateAction<boolean>> })=> {
  const {setAuth} = props;
  const [loginForm, setLoginForm]= React.useState({
    email: "",
    password: ""
  })
  const url = 'http://127.0.0.1:3000/authenticate'
  const submitLogin  = async ()=>{
    let res = await fetch(url, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(loginForm)
    })
    if(res.ok){
      let token = await res.json()
      setAuth(token.auth_token) 
    }
  }
   return (
    <>
      <Box>
        <TextField onChange={(e)=>setLoginForm(prev => {return {...prev, email: e.target.value }} )} placeholder={'email'} />
        <TextField type="password"
          autoComplete="current-password" onChange={(e)=>setLoginForm(prev => {return {...prev, password: e.target.value }} )} placeholder={'password'} />
      </Box>
      <Box>
        <Button onClick={submitLogin}>
          Login
        </Button>
      </Box>
    </>
  );
}
function Home() {
  return (
    <>
     <nav>
        <IconButton>Customers</IconButton>
        <IconButton>Employees</IconButton>
      </nav>
      <main>
        {moment().format('MMMM Do YYYY, h:mm:ss a')}
        <h2>Customers total: 1</h2>
        <p>You can do this, I believe in you.</p>
        <h2>Active Employee count: 2</h2>
      </main>
     
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


