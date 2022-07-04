import ArrowBack from "@mui/icons-material/ArrowBack";
import { Box, TextField, Button } from "@mui/material";
import Container from "@mui/system/Container";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuthToken } from "../../../services/api";
import { company } from "../../../types/dataTypes";

const Login = (props: {
  setAuth: React.Dispatch<React.SetStateAction<string>>;
  setCompany: React.Dispatch<React.SetStateAction<company | undefined>>;
}) => {
  let navigate = useNavigate();
  const { setAuth, setCompany } = props;
  const [loginForm, setLoginForm] = React.useState({
    email: "",
    password: "",
  });

  const submitLogin = async () => {
    let res = await getAuthToken(loginForm);
    if (res?.ok) {
      let token = await res?.json();
      setAuth(token.auth_token);
      setCompany(token.company);
      navigate("/");
    }
  };
  return (
    <>
      <Link to="/">
        <ArrowBack />
      </Link>
      <Container>
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 1, width: "30ch" },
          }}
          noValidate
          autoComplete="off"
        >
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
          <Box>
            <Button onClick={submitLogin}>Login</Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};
export default Login;
