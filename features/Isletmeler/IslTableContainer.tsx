"use client";
import { DataTableWrapper } from "@/components/Layouts/Wrappers";
import { Typography, Paper, Stack } from "@mui/material";
import IslDataTable from "./IslDataTable";

const IslTableContainer = ({ isletmeler }: any) => {
  return (
    <Paper>
      <Stack
        direction="row"
        justifyContent={"space-between"}
        alignItems={"center"}
        sx={{ p: 1, ml: 2, mr: 2 }}
      >
        <Typography variant="h6" color="info.main">
          İşletmeler
        </Typography>
      </Stack>
      <DataTableWrapper sxProps={{ p: { xs: 1, md: 2 } }}>
        <IslDataTable isletmeler={isletmeler} />
      </DataTableWrapper>
    </Paper>
  );
};

export default IslTableContainer;
