"use client";
import IslDataTable from "./IslDataTable";
import { DataTableWrapper } from "@/components/Layouts/Wrappers";
import { Typography, Paper, Stack } from "@mui/material";
import { DisplayIsletmes } from "@/lib/types/types";
import { useEffect, useState } from "react";
import { fetchIsletmeler } from "@/app/actions/fetchData";
import { Loader } from "@/components/Ui/Loader";

const IslTableContainer: React.FC = () => {
  const [isletmeler, setIsletmeler] = useState<DisplayIsletmes[]>([]);
  const [update, setUpdate] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchIsletmeler();
        setIsletmeler(response);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchData();
    setUpdate(false);
  }, [update]);

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
      {!isletmeler || isletmeler?.length < 1 ? (
        <Loader />
      ) : (
        <DataTableWrapper tableHeight={"78vh"} sx={{ p: { xs: 1, md: 2 } }}>
          <IslDataTable setUpdate={setUpdate} isletmeler={isletmeler} />
        </DataTableWrapper>
      )}
    </Paper>
  );
};

export default IslTableContainer;
