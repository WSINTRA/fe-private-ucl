import { AccountBalance, People } from "@mui/icons-material";
import { Button } from "@mui/material";
import moment from "moment";
import { Link } from "react-router-dom";

const Home=()=> {
    return (
      <>
       <nav>
       <Link to="customers"> <Button startIcon={<AccountBalance />} variant="outlined">Customers</Button></Link>
       <Link to="employees"> <Button startIcon={<People/>} variant="outlined" >Employees</Button></Link>
          
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

  export default Home;