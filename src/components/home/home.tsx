import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import moment from "moment";
import { Link } from "react-router-dom";
import { customer } from '../../types/dataTypes';
import Customers from "../customers/customers";

const Home = ({ customers }: { customers: customer[] }) => {
  console.log(customers)

  return (
    <>
      <Container>
        <Typography variant="h4">Todays Date - {moment().format('MMMM Do YYYY')}</Typography>
        <Customers customers={customers} />
      </Container>
    </>
  );
}

export default Home;