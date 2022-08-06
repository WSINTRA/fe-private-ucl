import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import moment from "moment";
import { customer } from "../../types/dataTypes";
import { useState, useContext } from "react";
import {
  Button,
  Container,
  FormControl,
  FormGroup,
  Stack,
  TextField,
} from "@mui/material";
import NextServiceDatePrompt from "./nextServiceDatePrompt";
import {
  saveCustomer,
  saveCustomerNote,
  saveNextDate,
} from "../../services/api";
import { AuthContext } from "../../services/authContext";
import { DateTimePicker } from "@mui/x-date-pickers";
import GenericSnackbar from "../genericSnackbar/genericSnackbar";

interface customerForm {
  editM: boolean;
  createM: boolean;
  customer: customer;
  tableCell?: any;
  updateCell?: any;
}

export const CustomerForm = ({
  editM,
  createM,
  customer,
  tableCell,
  updateCell,
}: customerForm) => {
  const { token } = useContext(AuthContext);

  const emptyCustomer: customer = {
    active_status: false,
    address: "",
    contact_number: "",
    first_name: "",
    last_name: "",
    first_service_date: "",
    next_service_date: null,
    notes: "",
  };

  const [editCustomer, setEditCustomer] = useState(customer || emptyCustomer);
  const [openServiceDialog, setOpenServiceDialog] = useState(false);
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(moment().toDate());
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");

  const handleChange = (newDate: Date) => {
    setDate(newDate);
  };

  const updateTableAndView = (updatedCustomer: customer) => {
    type resKeys = keyof customer;
    Object.keys(updatedCustomer).forEach((key) => {
      const value = updatedCustomer[key as resKeys];
      updateCell(tableCell.index, key, value);
    });
  };
  const saveNewCustomer = async () => {
    //TODO - Perform validations
    const payload = {
      ...editCustomer,
      first_service_date: moment(date)
        .utc()
        .format("dddd, MMMM Do YYYY, h:mm:ss a"),
      next_service_date: moment(date)
        .utc()
        .format("dddd, MMMM Do YYYY, h:mm:ss a"),
      active_status: true,
    };

    let res = await saveCustomer(token, payload);
    if (res.ok) {
      setSnackMsg("Customer created!");
      setSnackBarOpen(true);
      updateCell(
        "nil",
        "nil",
        { ...editCustomer, next_service_date: date, first_service_date: date },
        true
      );
    }
  };
  const saveDate = async (dateValue: Date, rFrequency: string) => {
    const res = await saveNextDate(
      token,
      editCustomer.id as number,
      dateValue,
      rFrequency
    );
    updateTableAndView(res);
    setEditCustomer(res);
    setOpenServiceDialog(false);
  };
  const saveNotes = async () => {
    const res = await saveCustomerNote(token, editCustomer.id as number, notes);
    updateTableAndView(res);
    setEditCustomer(res);
  };
  const customerDetailsForm = () => {
    return (
      <Box key="customer_form">
        <FormControl
          fullWidth
          sx={{ margin: "auto", marginTop: "2vh", padding: "24px" }}
        >
          <Stack spacing={2}>
            <TextField
              onChange={(e) =>
                setEditCustomer({ ...editCustomer, first_name: e.target.value })
              }
              placeholder="First name"
              value={editCustomer.first_name}
              type="text"
            />

            <TextField
              onChange={(e) =>
                setEditCustomer({ ...editCustomer, last_name: e.target.value })
              }
              placeholder="Last name"
              value={editCustomer.last_name}
              type="text"
            />

            <TextField
              placeholder="Address"
              onChange={(e) =>
                setEditCustomer({ ...editCustomer, address: e.target.value })
              }
              value={editCustomer.address}
              type="text"
            />

            <TextField
              onChange={(e) =>
                setEditCustomer({
                  ...editCustomer,
                  contact_number: e.target.value,
                })
              }
              placeholder="Contact Number"
              value={editCustomer.contact_number}
              type="tel"
            />
            <TextField
              onChange={(e) =>
                setEditCustomer({
                  ...editCustomer,
                  notes: e.target.value,
                })
              }
              placeholder="Notes"
              value={editCustomer.notes}
              multiline
              rows={4}
              type="text"
            />
            <Box>
              <FormGroup>
                <DateTimePicker
                  label="First Service Date"
                  value={date}
                  // @ts-ignore
                  onChange={handleChange}
                  renderInput={(params) => (
                    <TextField sx={{ marginTop: "2px" }} {...params} />
                  )}
                />
              </FormGroup>
            </Box>
            <Button onClick={() => saveNewCustomer()} variant="contained">
              Save
            </Button>
          </Stack>
        </FormControl>
        <GenericSnackbar
          open={snackBarOpen}
          setOpen={setSnackBarOpen}
          alertVariant={"info"}
          snackMsg={snackMsg}
        />
      </Box>
    );
  };
  if (editM && !createM) {
    return (
      <>
        <Container>
          <Box>
            <Typography style={{ whiteSpace: "pre-line" }}>
              {editCustomer.notes}
            </Typography>
            <Typography variant="h5" sx={{ marginBottom: "2vh" }}>
              Next Service for{" "}
              {editCustomer.first_name + " " + editCustomer.last_name}-{" "}
              {moment(editCustomer.next_service_date).format(
                "hh:mm:a MMMM Do YYYY"
              )}
            </Typography>
            <NextServiceDatePrompt
              handleSave={saveDate}
              open={openServiceDialog}
              setOpen={setOpenServiceDialog}
            />
            <Button
              variant="outlined"
              onClick={() => setOpenServiceDialog(true)}
            >
              Add next Service Date
            </Button>
          </Box>
          <Box sx={{ marginTop: "2vh" }}>
            <TextField
              id="outlined-notes"
              label="Notes"
              multiline
              rows={8}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Box>
          <Button onClick={saveNotes} variant="outlined">
            Save notes
          </Button>
        </Container>
      </>
    );
  }
  if (createM) {
    return <>{customerDetailsForm()}</>;
  }
  return (
    <>
      <Box>
        <Typography>
          Active Status: {editCustomer.active_status ? "Active" : "Not Active"}
        </Typography>
        <Typography>Address: {editCustomer.address}</Typography>
        <Typography>Contact Tel: {editCustomer.contact_number}</Typography>
        <Typography>
          Contact Name: {editCustomer.first_name + " " + editCustomer.last_name}{" "}
        </Typography>
        <Typography>
          <b>Next Service Due:</b>{" "}
          {moment(editCustomer.next_service_date).format(
            "hh:mm - MMMM Do YYYY"
          )}
        </Typography>
        <Typography>
          First Service:{" "}
          {moment(editCustomer.first_service_date).format("MMMM Do YYYY")}{" "}
        </Typography>
        <Divider />
        <Typography variant="h4">Notes</Typography>
        <Typography style={{ whiteSpace: "pre-line" }}>
          {editCustomer.notes}
        </Typography>
      </Box>
    </>
  );
};
