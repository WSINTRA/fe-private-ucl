import { Box, TextField, Button } from "@mui/material";
import React from "react";

const Login =(props: {setAuth:React.Dispatch<React.SetStateAction<boolean>> })=> {
    const {setAuth} = props;
    const [loginForm, setLoginForm]= React.useState({
      email: "",
      password: ""
    })

    //TODO - Extract into services API
    const url = 'http://192.168.0.15:3000/authenticate'
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
export default Login;