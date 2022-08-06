import ArrowBack from "@mui/icons-material/ArrowBack";
import { Button, Divider, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { Link } from "react-router-dom";
import { signUpNewUser } from "../../../services/api";
import { signUpPayload } from "../../../types/dataTypes";
import GenericSnackbar from "../../genericSnackbar/genericSnackbar";

export const SignUpForm = () => {
  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMsg, setSnackBarMsg] = useState("");
  const submitNewUser = async () => {
    const payload: signUpPayload = {
      user: {
        name: name,
        email: email,
        password: password,
      },
      company: {
        company_name: companyName,
        address: address,
      },
    };
    let res = await signUpNewUser(payload);
    if (res.ok) {
      setSnackBarMsg("Company sign up complete, you can now go back and login");
      setSnackBarOpen(true);
    } else {
      const { error } = await res.json();
      setSnackBarMsg(`The following error occurred: ${error}`);
      setSnackBarOpen(true);
    }
  };
  return (
    <>
      <Link to="/">
        <ArrowBack />
      </Link>
      <GenericSnackbar
        open={snackBarOpen}
        setOpen={setSnackBarOpen}
        alertVariant={"info"}
        snackMsg={snackBarMsg}
      />
      <Container
        sx={{ padding: "8px", border: "3px solid silver", borderRadius: "8px" }}
      >
        <Box>
          <Typography sx={{ margin: "12px" }}>
            Create a user representing your company
          </Typography>
          <Divider />
        </Box>
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 1, width: "35ch" },
          }}
          noValidate
          autoComplete="off"
        >
          <Box>
            <TextField
              onChange={(e) => setName(e.target.value)}
              label="Company representive name"
            />
          </Box>
          <Box>
            <TextField
              onChange={(e) => setEmail(e.target.value)}
              sx={{ width: "100vw" }}
              label="Email"
            />
          </Box>
          <Box>
            <TextField
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
            />
          </Box>
          <Divider />
          <Typography sx={{ margin: "12px" }}>
            Fill in some basic company details
          </Typography>
          <Box>
            <TextField
              onChange={(e) => setCompanyName(e.target.value)}
              label="Company name"
            />
            <TextField
              onChange={(e) => setAddress(e.target.value)}
              fullWidth
              label="Company address"
            />
            {/* {TODO - Company Logo upload functionality} */}
          </Box>
          <Button onClick={() => submitNewUser()} variant="outlined">
            Submit
          </Button>
        </Box>
      </Container>
    </>
  );
};
