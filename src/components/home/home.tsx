import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import moment from "moment";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../services/authContext";
import { customer } from "../../types/dataTypes";
import Customers from "../customers/customers";

const Home = ({ customers }: { customers: customer[] }) => {
  const { setToken } = useContext(AuthContext);
  let navigate = useNavigate();
  const logout = () => {
    localStorage.clear();
    setToken("");
    navigate("/");
  };
  return (
    <>
      <Button onClick={() => logout()}>Logout</Button>
      <Container>
        <Typography variant="h4">
          Todays Date - {moment().format("MMMM Do YYYY")}
        </Typography>
        <Customers customers={customers} />
      </Container>
    </>
  );
};

export default Home;
