import { Snackbar, Alert } from "@mui/material";
import React from "react";

interface InfoBoxProps {
  resStatus: number;
  resMessage: string;
  error: string;
  setOpenSnack: React.Dispatch<React.SetStateAction<boolean>>;
  openSnack: boolean;
}

const InfoBox: React.FC<InfoBoxProps> = ({
  resStatus,
  resMessage,
  error,
  setOpenSnack,
  openSnack,
}) => {
  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnack(false);
  };

  return (
    <Snackbar open={openSnack} autoHideDuration={1000} onClose={handleClose}>
      <Alert
        severity={resStatus === 200 ? "success" : "error"}
        variant="filled"
        sx={{ width: "100%" }}
        onClose={handleClose}
      >
        {resMessage}
        {error}
      </Alert>
    </Snackbar>
  );
};

export default InfoBox;
