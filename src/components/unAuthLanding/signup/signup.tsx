import ArrowBack from "@mui/icons-material/ArrowBack";
import { Button, Divider, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";

export const SignUpForm = () => {
  return (
    <>
      <Link to="/">
        <ArrowBack />
      </Link>
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
            <TextField label="Company representive name" />
            <TextField label="Role in company" />
          </Box>
          <Box>
            <TextField sx={{ width: "100vw" }} label="Email" />
          </Box>
          <Box>
            <TextField label="Password" />
          </Box>
          <Divider />
          <Typography sx={{ margin: "12px" }}>
            Fill in some basic company details
          </Typography>
          <Box>
            <TextField label="Company name" />
            <TextField fullWidth label="Company address" />
            {/* {TODO - Company Logo upload functionality} */}
          </Box>
          <Button variant="outlined">Submit</Button>
        </Box>
      </Container>
    </>
  );
};
