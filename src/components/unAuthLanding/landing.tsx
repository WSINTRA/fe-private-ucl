import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import moment from "moment";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <>
      <Container>
        <Typography variant="h4">
          Todays Date - {moment().format("MMMM Do YYYY")}
        </Typography>
        <Box sx={{ padding: "2%" }}>
          Manage and schedule your company appointments with your customers.
        </Box>
        <Box>
          <Link to="/login">Login</Link> or <Link to="/sign-up">Sign Up</Link>.
        </Box>
      </Container>
    </>
  );
};

export default Landing;
