import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import TextField from "@mui/material/TextField";
import moment from "moment";
import Stack from "@mui/material/Stack";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface dialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSave: (dateValue: Date, rFrequency: string) => void;
}
export default function NextServiceDatePrompt({
  open,
  setOpen,
  handleSave,
}: dialogProps) {
  const [rFrequency, setRFrequency] = React.useState("");
  const [date, setDate] = React.useState<Date | null>(moment().toDate());

  const handleChange = (newDate: Date | null) => {
    setDate(newDate);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        sx={{ height: "90vh" }}
      >
        <DialogTitle>Select Next Service Options</DialogTitle>
        <DialogContent sx={{ height: "45vh", padding: "24px" }}>
          <Stack spacing={2}>
            <FormControl fullWidth sx={{ margin: "auto", marginTop: "2vh" }}>
              <FormGroup>
                <DateTimePicker
                  label="Next Service Date"
                  value={date}
                  onChange={handleChange}
                  renderInput={(params) => (
                    <TextField sx={{ marginTop: "2px" }} {...params} />
                  )}
                />
              </FormGroup>
            </FormControl>
            <FormControl fullWidth sx={{ margin: "auto", marginTop: "2vh" }}>
              <FormGroup>
                <InputLabel id="Inputlabel">Recurring</InputLabel>
                <Select
                  label="Recurring?"
                  onChange={(e) => {
                    setRFrequency(e.target.value as string);
                  }}
                  sx={{ width: "100%" }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={"weekly"}>Weekly</MenuItem>
                  <MenuItem value={"2_weeks"}>2 Weeks</MenuItem>
                  <MenuItem value={"3_weeks"}>3 Weeks</MenuItem>
                  <MenuItem value={"monthly"}>Monthly</MenuItem>
                </Select>
                <Typography>
                  Active
                  <Checkbox checked={!!rFrequency} />
                </Typography>
              </FormGroup>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => handleSave(date as Date, rFrequency)}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
