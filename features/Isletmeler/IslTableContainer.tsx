"use client";
import IslDataTable from "./IslDataTable";
import { DataTableWrapper } from "@/components/Layouts/Wrappers";
import { Typography, Paper, Stack } from "@mui/material";
import { Isletme } from "@/lib/types/types";

const IslTableContainer = ({ isletmeler }: { isletmeler: Isletme[] }) => {
  if (!isletmeler || isletmeler.length === 0) {
    return <Typography>No data available</Typography>;
  }

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
      <DataTableWrapper tableHeight={"78vh"} sx={{ p: { xs: 1, md: 2 } }}>
        <IslDataTable isletmeler={isletmeler} />
      </DataTableWrapper>
    </Paper>
  );
};

export default IslTableContainer;
