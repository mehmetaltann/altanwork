import CircularProgress from "@mui/material/CircularProgress";
import React from "react";
import { Box } from "@mui/material";

export function Loader(): JSX.Element {
  return (
    <Box
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <CircularProgress size="3rem" color="success" />
    </Box>
  );
}
