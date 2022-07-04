import { Box, TextField, Button } from "@mui/material";
import React from "react";
import { company } from "../../types/dataTypes";

const Login = (props: {
  setAuth: React.Dispatch<React.SetStateAction<string>>;
  setCompany: React.Dispatch<React.SetStateAction<company | undefined>>;
}) => {
  const { setAuth, setCompany } = props;
  const [loginForm, setLoginForm] = React.useState({
    email: "",
    password: "",
  });

  //TODO - Extract into services API
  const url = "http://127.0.0.1:3000/authenticate";
  const submitLogin = async () => {
    let res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginForm),
    });
    if (res.ok) {
      let token = await res.json();
      console.log("token", token);
      setAuth(token.auth_token);
      setCompany(token.company);
    }
  };
  return (
    <>
      <Box>
        <TextField
          onChange={(e) =>
            setLoginForm((prev) => {
              return { ...prev, email: e.target.value };
            })
          }
          placeholder={"email"}
        />
        <TextField
          type="password"
          autoComplete="current-password"
          onChange={(e) =>
            setLoginForm((prev) => {
              return { ...prev, password: e.target.value };
            })
          }
          placeholder={"password"}
        />
      </Box>
      <Box>
        <Button onClick={submitLogin}>Login</Button>
      </Box>
    </>
  );
};
export default Login;
