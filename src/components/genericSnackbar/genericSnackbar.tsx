import * as React from "react";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertColor, AlertProps } from "@mui/material/Alert";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface GenSnackBar {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onClickAction?: () => void;
  alertVariant: AlertColor;
  snackMsg: string;
}
const GenericSnackbar: React.FC<GenSnackBar> = ({
  open,
  setOpen,
  onClickAction,
  alertVariant,
  snackMsg,
}) => {
  const handleClick = () => {
    onClickAction && onClickAction();
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={alertVariant}
          sx={{ width: "100%" }}
        >
          {snackMsg}
        </Alert>
      </Snackbar>
    </Stack>
  );
};
export default GenericSnackbar;
